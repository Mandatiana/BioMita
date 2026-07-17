export default function Dashboard(){
    return
        <div className="px-8 py-8"><h1 className="text-xl font-semibold text-stone-900">Tableau de bord</h1></div>
}
export function Visitors() {
  return <div className="px-8 py-8"><h1 className="text-xl font-semibold text-stone-900">Visiteurs</h1></div>;
}
export function Incidents() {
  return <div className="px-8 py-8"><h1 className="text-xl font-semibold text-stone-900">Incidents</h1></div>;
}
export function Agents() {
  return <div className="px-8 py-8"><h1 className="text-xl font-semibold text-stone-900">Agents</h1></div>;
}
export function ProtectedAreas() {
  return <div className="px-8 py-8"><h1 className="text-xl font-semibold text-stone-900">Aires protégées</h1></div>;
}


// les types itambbaran admin sy agents
export type Visite = {
  id: number,
  time: string,
  representant_nom: string,
  nationalite: string,
  aire_nom: string;
  nombre_visiteurs: number,
  montant_total: number,
  date_visite: string,
}

export type IncidentStatus = "signale" | "en_cours" | "resolu";

export type Incident = {
  id: number;
  type_incident: string;
  localisation: string;
  description: string;
  statut: IncidentStatus;
  aire_id: number;
  aire_nom: string;
  agent_id: number;
  agent_nom: string;
  date_incident: string;
};

export type AireProtegee = {
  id: string,
  nom: string,
  localisation: string,
  tarif_ticket: string, // si decimal => string
  tarif_guide: string,
};


export type Agent = {
  id: number;
  nom: string;
  aire_nom: string;
  total_visites: number;
  total_observations: number;
  total_incidents: number;
};

export type Espece = {
  id: number;
  nom: string;
  nom_scientifique: string;
  population: number;
  image?: string;
};

export type Observation = {
  id: number;
  nombre_observe: number;
  localisation: string;
  commentaire: string;
  espece_id: number;
  espece_nom: string;
  aire_id: number;
  aire_nom: string;
  agent_id: number;
  agent_nom: string;
  date_observation: string;
};