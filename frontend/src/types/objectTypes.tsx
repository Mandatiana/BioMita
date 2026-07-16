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
}

export type IncidentStatus = "Déclaré" | "En cours" | "Résolu";
export type IncidentUrgence = "Faible" | "Moyen" | "Élevé";

export type Incident = {
  id: number,
  type: string,
  loc: string,
  desc: string,
  urgence: IncidentUrgence,
  status: IncidentStatus,
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