// Client API pour le backend CodeIgniter (BioMita)
// En dev avec `php spark serve`, le backend tourne sur http://localhost:8080
// et n'a pas besoin de "index.php" dans l'URL (contrairement à Apache/Laragon
// sans le bon .htaccess actif).
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function handleResponse(res: Response) {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = body?.errors
      ? Object.values(body.errors).join(" ")
      : body?.message ?? `Erreur ${res.status}`;
    throw new Error(message);
  }
  return body;
}

// --- Aires protégées ---
export type AireApi = {
  id: number;
  nom: string;
  localisation: string;
  tarif_ticket: string; // decimal renvoyé en string par MySQL/CodeIgniter
  tarif_guide: string;
  image: string | null;
};

export async function fetchAires(): Promise<AireApi[]> {
  const res = await fetch(`${API_BASE_URL}/aires-protegees`);
  const body = await handleResponse(res);
  return body.data;
}

// --- Agents (utilisateurs de terrain) ---
export type AgentApi = {
  id: number;
  nom: string;
  role: string;
};

export async function fetchAgentsTerrain(): Promise<AgentApi[]> {
  const res = await fetch(`${API_BASE_URL}/utilisateurs/agents-terrain`);
  const body = await handleResponse(res);
  return body.data;
}

// --- Visites ---
export type VisiteApiRow = {
  id: number;
  representant_nom: string;
  cin_passeport: string;
  nationalite: string;
  nombre_visiteurs: number;
  aire_id: number;
  agent_id: number;
  montant_total: string;
  date_visite: string;
  aire_nom: string;
  agent_nom: string;
};

export type NouvelleVisitePayload = {
  representant_nom: string;
  cin_passeport: string;
  nationalite: string;
  nombre_visiteurs: number;
  aire_id: number;
  agent_id: number;
  montant_total: number;
  date_visite: string; // format "YYYY-MM-DD HH:mm:ss"
};

export async function fetchVisites(): Promise<VisiteApiRow[]> {
  const res = await fetch(`${API_BASE_URL}/visites`);
  const body = await handleResponse(res);
  return body.data;
}

export async function createVisite(payload: NouvelleVisitePayload): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/visites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await handleResponse(res);
  return body.id;
}
