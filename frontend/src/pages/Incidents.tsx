import { useEffect, useState, type FormEvent } from "react";
import { Search, Plus, X } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import type { Incident, AireProtegee, Agent, IncidentStatus } from "../types/objectTypes";

const API_BASE = "http://localhost:8080";

const STATUTS: { value: IncidentStatus; label: string }[] = [
  { value: "signale", label: "Signalé" },
  { value: "en_cours", label: "En cours" },
  { value: "resolu", label: "Résolu" },
];

function statutLabel(statut: string): string {
  return STATUTS.find((s) => s.value === statut)?.label ?? statut;
}

function statutBadgeClass(statut: string): string {
  switch (statut) {
    case "resolu":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "en_cours":
      return "bg-amber-50 text-amber-700 border-amber-100";
    default:
      return "bg-red-50 text-red-700 border-red-100";
  }
}

type NouvelIncidentForm = {
  type_incident: string;
  localisation: string;
  description: string;
  statut: IncidentStatus;
  aire_id: string;
  agent_id: string;
  date_incident: string;
};

const emptyForm: NouvelIncidentForm = {
  type_incident: "",
  localisation: "",
  description: "",
  statut: "signale",
  aire_id: "",
  agent_id: "",
  date_incident: new Date().toISOString().slice(0, 10),
};

// liste des incidents
export default function Incidents() {
  const [query, setQuery] = useState<string>("");
  const [areaFilter, setAreaFilter] = useState<string>("Toutes");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [aires, setAires] = useState<AireProtegee[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NouvelIncidentForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = incidents.filter((i) => {
    const matchesArea = areaFilter === "Toutes" || i.aire_nom === areaFilter;
    const matchesQuery = (i.type_incident ?? "").toLowerCase().includes(query.toLowerCase()) ||
      (i.localisation ?? "").toLowerCase().includes(query.toLowerCase());
    return matchesArea && matchesQuery;
  });

  async function getIncidents() {
    try {
      const res = await fetch(`${API_BASE}/incidents`);
      const data = await res.json();
      setIncidents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function getAire() {
    try {
      const res = await fetch(`${API_BASE}/aires-protegees`);
      const data = await res.json();
      setAires(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function getAgents() {
    try {
      const res = await fetch(`${API_BASE}/utilisateurs/agents-terrain-full`);
      const data = await res.json();
      setAgents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getIncidents();
    getAire();
    getAgents();
  }, []);

  function updateForm<K extends keyof NouvelIncidentForm>(key: K, value: NouvelIncidentForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openModal() {
    setForm({
      ...emptyForm,
      aire_id: aires[0]?.id ?? "",
      agent_id: agents[0]?.id ? String(agents[0].id) : "",
      date_incident: new Date().toISOString().slice(0, 10),
    });
    setFormError(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setFormError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (
      !form.type_incident ||
      !form.localisation ||
      !form.description ||
      !form.aire_id ||
      !form.agent_id ||
      !form.date_incident
    ) {
      setFormError("Merci de remplir tous les champs.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type_incident: form.type_incident,
          localisation: form.localisation,
          description: form.description,
          statut: form.statut,
          aire_id: Number(form.aire_id),
          agent_id: Number(form.agent_id),
          date_incident: form.date_incident,
        }),
      });

      const data = await res.json();

      if (!res.ok || data?.status === "error") {
        const messages = data?.errors ? Object.values(data.errors).join(" ") : data?.message;
        setFormError(messages || "Impossible d'enregistrer l'incident.");
        return;
      }

      await getIncidents();
      closeModal();
    } catch (error) {
      console.error(error);
      setFormError("Erreur réseau : impossible de contacter le serveur.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-5 md:px-8">
      <div className="pt-6 md:pt-8 pb-5">
        <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Incidents</h1>
        <p className="text-sm text-stone-500 mt-0.5">Tous les incidents signalés, toutes aires confondues</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Rechercher un type ou un lieu…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm"
        >
          <option>Toutes</option>
          {aires.map((a) => (
            <option key={a.id}>{a.nom}</option>
          ))}
        </select>
        <Button onClick={openModal} className="ml-auto shrink-0">
          <Plus size={16} /> Nouvel incident
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-500 border-b border-stone-100">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Localisation</th>
                <th className="px-5 py-3 font-medium">Aire</th>
                <th className="px-5 py-3 font-medium">Agent</th>
                <th className="px-5 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b border-stone-50 hover:bg-stone-50">
                  <td className="px-5 py-3 text-stone-500">{i.date_incident}</td>
                  <td className="px-5 py-3 text-stone-900 font-medium">{i.type_incident}</td>
                  <td className="px-5 py-3 text-stone-600">{i.localisation}</td>
                  <td className="px-5 py-3 text-stone-600">{i.aire_nom}</td>
                  <td className="px-5 py-3 text-stone-600">{i.agent_nom}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statutBadgeClass(i.statut)}`}>
                      {statutLabel(i.statut)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-semibold text-stone-900 text-[15px] tracking-tight">Nouvel incident</h2>
              <button
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-600"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="type_incident">Type d'incident</Label>
                <Input
                  id="type_incident"
                  value={form.type_incident}
                  onChange={(e) => updateForm("type_incident", e.target.value)}
                  placeholder="Ex: Braconnage, Incendie…"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="localisation">Localisation</Label>
                <Input
                  id="localisation"
                  value={form.localisation}
                  onChange={(e) => updateForm("localisation", e.target.value)}
                  placeholder="Ex: Secteur nord, sentier 3…"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="aire_id">Aire protégée</Label>
                  <select
                    id="aire_id"
                    value={form.aire_id}
                    onChange={(e) => updateForm("aire_id", e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm"
                  >
                    <option value="">Sélectionner…</option>
                    {aires.map((a) => (
                      <option key={a.id} value={a.id}>{a.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="agent_id">Agent</Label>
                  <select
                    id="agent_id"
                    value={form.agent_id}
                    onChange={(e) => updateForm("agent_id", e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm"
                  >
                    <option value="">Sélectionner…</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>{ag.nom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="statut">Statut</Label>
                  <select
                    id="statut"
                    value={form.statut}
                    onChange={(e) => updateForm("statut", e.target.value as IncidentStatus)}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm"
                  >
                    {STATUTS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date_incident">Date de l'incident</Label>
                  <Input
                    id="date_incident"
                    type="date"
                    value={form.date_incident}
                    readOnly
                    disabled
                    className="bg-stone-50 text-stone-700 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  rows={3}
                  placeholder="Détails de l'incident…"
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-shadow placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-900/10 focus-visible:border-emerald-800"
                />
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Annuler
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Enregistrement…" : "Enregistrer"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
