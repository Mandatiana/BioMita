import { useEffect, useMemo, useState } from "react";
import { User } from "lucide-react";
import { Modal } from "./modal";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { formatMontant } from "../../lib/format";
import {
  fetchAires,
  fetchAgentsTerrain,
  createVisite,
  type AireApi,
  type AgentApi,
} from "../../lib/api";

// Pas de table "nationalites" côté backend pour l'instant — liste statique locale au formulaire
const NATIONALITES = ["Malgache", "France", "États-Unis", "Allemagne", "Autre"];

type NewVisitModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void; // on recharge la liste depuis le backend après succès
};

export function NewVisitModal({ open, onClose, onCreated }: NewVisitModalProps) {
  const [aires, setAires] = useState<AireApi[]>([]);
  const [agents, setAgents] = useState<AgentApi[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(false);

  const [rep, setRep] = useState("");
  const [cin, setCin] = useState("");
  const [nat, setNat] = useState(NATIONALITES[0]);
  const [n, setN] = useState(1);
  const [aireId, setAireId] = useState<number | null>(null);
  const [agentId, setAgentId] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charge les aires et agents réels depuis le backend à l'ouverture du modal
  useEffect(() => {
    if (!open) return;
    setLoadingRefs(true);
    setError(null);
    Promise.all([fetchAires(), fetchAgentsTerrain()])
      .then(([airesData, agentsData]) => {
        setAires(airesData);
        setAgents(agentsData);
        setAireId(airesData[0] ? Number(airesData[0].id) : null);
        setAgentId(agentsData[0]?.id ?? null);
      })
      .catch(() => setError("Impossible de charger les aires/agents depuis le serveur."))
      .finally(() => setLoadingRefs(false));
  }, [open]);

  const aireSelectionnee = aires.find((a) => Number(a.id) === aireId);

  const montant = useMemo(() => {
    if (!aireSelectionnee || n < 1) return 0;
    return Number(aireSelectionnee.tarif_ticket) * n + Number(aireSelectionnee.tarif_guide);
  }, [aireSelectionnee, n]);

  const isValid =
    rep.trim() !== "" && cin.trim() !== "" && n >= 1 && aireId !== null && agentId !== null;

  const now = new Date();
  const dateAffichee = now.toLocaleDateString("fr-FR");
  const heureAffichee = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  function reset() {
    setRep("");
    setCin("");
    setNat(NATIONALITES[0]);
    setN(1);
    setError(null);
  }

  function formatDateForApi(date: Date): string {
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  async function handleSubmit() {
    if (!isValid || aireId === null || agentId === null) return;
    setSubmitting(true);
    setError(null);
    try {
      await createVisite({
        representant_nom: rep.trim(),
        cin_passeport: cin.trim(),
        nationalite: nat,
        nombre_visiteurs: n,
        aire_id: aireId,
        agent_id: agentId,
        montant_total: montant,
        date_visite: formatDateForApi(now),
      });
      reset();
      onCreated(); // le parent recharge la liste (GET /visites) et ferme le modal
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Nouvelle visite"
      description="Billetterie — enregistrement d'un groupe"
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="rep">Nom du représentant</Label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <Input
              id="rep"
              placeholder="Ex. Harilala Rasoa"
              className="pl-9"
              value={rep}
              onChange={(e) => setRep(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cin">N° CIN ou passeport</Label>
          <Input
            id="cin"
            placeholder="Ex. 101245789012"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="nat">Nationalité</Label>
            <select
              id="nat"
              value={nat}
              onChange={(e) => setNat(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-900/10 focus-visible:border-emerald-800"
            >
              {NATIONALITES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="n">Nombre de visiteurs</Label>
            <Input
              id="n"
              type="number"
              min={1}
              value={n}
              onChange={(e) => setN(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="aire">Aire protégée visitée</Label>
          <select
            id="aire"
            value={aireId ?? ""}
            disabled={loadingRefs || aires.length === 0}
            onChange={(e) => setAireId(Number(e.target.value))}
            className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-900/10 focus-visible:border-emerald-800 disabled:opacity-50"
          >
            {aires.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="agent">Agent responsable</Label>
          <select
            id="agent"
            value={agentId ?? ""}
            disabled={loadingRefs || agents.length === 0}
            onChange={(e) => setAgentId(Number(e.target.value))}
            className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-900/10 focus-visible:border-emerald-800 disabled:opacity-50"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
          <span className="text-sm font-medium text-emerald-900">Montant (ticket + guide)</span>
          <span className="text-base font-semibold text-emerald-900">{formatMontant(montant)}</span>
        </div>

        <div className="flex justify-between text-xs text-stone-500">
          <span>Date : {dateAffichee}</span>
          <span>Heure : {heureAffichee}</span>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button className="w-full" disabled={!isValid || submitting} onClick={handleSubmit}>
          {submitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </Modal>
  );
}
