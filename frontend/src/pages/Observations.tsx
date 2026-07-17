import { useEffect, useState, type FormEvent } from "react";
import { Search, Plus, X } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import type { Observation, AireProtegee, Agent, Espece } from "../types/objectTypes";

const API_BASE = "http://localhost:8080";

type NouvelleObservationForm = {
  espece_id: string;
  nombre_observe: string;
  localisation: string;
  commentaire: string;
  aire_id: string;
  agent_id: string;
  date_observation: string;
};

const emptyForm: NouvelleObservationForm = {
  espece_id: "",
  nombre_observe: "1",
  localisation: "",
  commentaire: "",
  aire_id: "",
  agent_id: "",
  date_observation: new Date().toISOString().slice(0, 10),
};

// liste des observations d'espèces
export default function Observations() {
  const [query, setQuery] = useState<string>("");
  const [areaFilter, setAreaFilter] = useState<string>("Toutes");
  const [observations, setObservations] = useState<Observation[]>([]);
  const [aires, setAires] = useState<AireProtegee[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [especes, setEspeces] = useState<Espece[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NouvelleObservationForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = observations.filter((o) => {
    const matchesArea = areaFilter === "Toutes" || o.aire_nom === areaFilter;
    const matchesQuery = (o.espece_nom ?? "").toLowerCase().includes(query.toLowerCase()) ||
      (o.localisation ?? "").toLowerCase().includes(query.toLowerCase());
    return matchesArea && matchesQuery;
  });

  async function getObservations() {
    try {
      const res = await fetch(`${API_BASE}/observations`);
      const data = await res.json();
      setObservations(Array.isArray(data) ? data : []);
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

  async function getEspeces() {
    try {
      const res = await fetch(`${API_BASE}/especes`);
      const data = await res.json();
      setEspeces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getObservations();
    getAire();
    getAgents();
    getEspeces();
  }, []);

  function updateForm<K extends keyof NouvelleObservationForm>(key: K, value: NouvelleObservationForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openModal() {
    setForm({
      ...emptyForm,
      espece_id: especes[0]?.id ? String(especes[0].id) : "",
      aire_id: aires[0]?.id ?? "",
      agent_id: agents[0]?.id ? String(agents[0].id) : "",
      date_observation: new Date().toISOString().slice(0, 10),
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
      !form.espece_id ||
      !form.nombre_observe ||
      !form.localisation ||
      !form.aire_id ||
      !form.agent_id ||
      !form.date_observation
    ) {
      setFormError("Merci de remplir tous les champs.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/observations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          espece_id: Number(form.espece_id),
          nombre_observe: Number(form.nombre_observe),
          localisation: form.localisation,
          commentaire: form.commentaire,
          aire_id: Number(form.aire_id),
          agent_id: Number(form.agent_id),
          date_observation: form.date_observation,
        }),
      });

      const data = await res.json();

      if (!res.ok || data?.status === "error") {
        const messages = data?.errors ? Object.values(data.errors).join(" ") : data?.message;
        setFormError(messages || "Impossible d'enregistrer l'observation.");
        return;
      }

      await getObservations();
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
        <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Observations</h1>
        <p className="text-sm text-stone-500 mt-0.5">Toutes les observations d'espèces, toutes aires confondues</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Rechercher une espèce ou un lieu…"
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
          <Plus size={16} /> Nouvelle observation
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-500 border-b border-stone-100">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Espèce</th>
                <th className="px-5 py-3 font-medium">Nombre observé</th>
                <th className="px-5 py-3 font-medium">Localisation</th>
                <th className="px-5 py-3 font-medium">Aire</th>
                <th className="px-5 py-3 font-medium">Agent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-stone-50 hover:bg-stone-50">
                  <td className="px-5 py-3 text-stone-500">{o.date_observation}</td>
                  <td className="px-5 py-3 text-stone-900 font-medium">{o.espece_nom}</td>
                  <td className="px-5 py-3 text-stone-600">{o.nombre_observe}</td>
                  <td className="px-5 py-3 text-stone-600">{o.localisation}</td>
                  <td className="px-5 py-3 text-stone-600">{o.aire_nom}</td>
                  <td className="px-5 py-3 text-stone-600">{o.agent_nom}</td>
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
              <h2 className="font-semibold text-stone-900 text-[15px] tracking-tight">Nouvelle observation</h2>
              <button
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-600"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="espece_id">Espèce</Label>
                  <select
                    id="espece_id"
                    value={form.espece_id}
                    onChange={(e) => updateForm("espece_id", e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm"
                  >
                    <option value="">Sélectionner…</option>
                    {especes.map((e) => (
                      <option key={e.id} value={e.id}>{e.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="nombre_observe">Nombre observé</Label>
                  <Input
                    id="nombre_observe"
                    type="number"
                    min={0}
                    value={form.nombre_observe}
                    onChange={(e) => updateForm("nombre_observe", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="localisation">Localisation</Label>
                <Input
                  id="localisation"
                  value={form.localisation}
                  onChange={(e) => updateForm("localisation", e.target.value)}
                  placeholder="Ex: Lisière forestière nord…"
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

              <div className="space-y-1.5">
                <Label htmlFor="date_observation">Date de l'observation</Label>
                <Input
                  id="date_observation"
                  type="date"
                  value={form.date_observation}
                  readOnly
                  disabled
                  className="bg-stone-50 text-stone-700 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="commentaire">Commentaire (optionnel)</Label>
                <textarea
                  id="commentaire"
                  value={form.commentaire}
                  onChange={(e) => updateForm("commentaire", e.target.value)}
                  rows={3}
                  placeholder="Comportement observé, contexte…"
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
