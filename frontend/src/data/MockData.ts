import type { Visite, Incident, Agent, AireProtegee } from "../types/objectTypes";



//faux data afaka atao exemple mandrapa mifandray am backend
export const AREAS: AireProtegee[] = [
  { id: "andasibe", nom: "Andasibe-Mantadia", localisation: "Alaotra-Mangoro", tarif_ticket: '65000', tarif_guide: '40000', },
  { id: "ranomafana", nom: "Ranomafana", localisation: "Haute Matsiatra", tarif_ticket: '65000', tarif_guide: '45000' },
  { id: "isalo", nom: "Isalo", localisation: "Ihorombe", tarif_ticket: '55000', tarif_guide: '50000' },
];

export const AGENTS: Agent[] = [
  { id: 1, nom: "Fenosoa Rakoto", aire_nom: "Andasibe-Mantadia", total_visites: 18, total_observations: 27, total_incidents: 3 },
  { id: 2, nom: "Voahangy Randria", aire_nom: "Ranomafana", total_visites: 24, total_observations: 31, total_incidents: 1 },
];

export const initialVisits: Visite[] = [
  { id: 1, time: "08:12", representant_nom: "Harilala Rasoa", nationalite: "Malgache", aire_nom: "Andasibe-Mantadia", nombre_visiteurs: 4, montant_total: 65000 * 4 + 40000 },
  { id: 2, time: "09:40", representant_nom: "John Miller", nationalite: "États-Unis", aire_nom: "Andasibe-Mantadia", nombre_visiteurs: 2, montant_total: 65000 * 2 + 40000 },
  { id: 3, time: "11:05", representant_nom: "Élise Dubois", nationalite: "France", aire_nom: "Andasibe-Mantadia", nombre_visiteurs: 3, montant_total: 65000 * 3 + 40000 },
];

export const initialIncidents: Incident[] = [
  { id: 1, type: "Feu de brousse", loc: "Lisière est, secteur 4", desc: "Départ de feu limité, zone de défriche agricole voisine.", urgence: "Élevé", status: "En cours" },
  { id: 2, type: "Braconnage", loc: "Sentier Mantadia nord", desc: "Traces de collets suspectées le long du sentier.", urgence: "Moyen", status: "Déclaré" },
  { id: 3, type: "Déforestation", loc: "Zone tampon sud", desc: "Coupe illégale de bois de rose signalée par un tarif_guide local.", urgence: "Élevé", status: "Résolu" },
];

