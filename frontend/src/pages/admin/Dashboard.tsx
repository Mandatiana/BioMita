import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { initialVisits, initialIncidents } from "../../data/MockData";

type KpiCardProps = {
  label: string;
  value: string | number;
  delta: string;
  up: boolean;
};
function money(nombre_visiteurs: number): string {
  return nombre_visiteurs.toLocaleString("fr-FR") + " Ar";
}

function KpiCard({ label, value, delta, up }: KpiCardProps) {
  return (
    <Card>
      <CardContent>
        <p className="text-xs text-stone-500">{label}</p>
        <div className="flex items-end justify-between mt-2">
          <p className="text-2xl font-semibold text-stone-900 tracking-tight">{value}</p>
          <span className={`flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-700" : "text-stone-500"}`}>
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {delta}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const totalVisitors = initialVisits.reduce((sum, v) => sum + v.nombre_visiteurs, 0);
  const totalRevenue = initialVisits.reduce((sum, v) => sum + v.montant_total, 0);
  const activeIncidents = initialIncidents.filter((i) => i.status !== "Résolu").length;

  return (
    <div className="px-5 md:px-8">
      <div className="pt-6 md:pt-8 pb-5">
        <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Tableau de bord</h1>
        <p className="text-sm text-stone-500 mt-0.5">Vue d'ensemble des trois aires gérées</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Visiteurs du jour" value={totalVisitors} delta="+12% vs hier" up />
        <KpiCard label="Revenus du jour" value={money(totalRevenue)} delta="+8% vs hier" up />
        <KpiCard label="Observations (semaine)" value={58} delta="+5 vs sem. dernière" up />
        <KpiCard label="Incidents actifs" value={activeIncidents} delta="-1 vs hier" up={false} />
      </div>

      <Card>
        <CardHeader><CardTitle>Derniers incidents</CardTitle></CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-stone-100">
            {initialIncidents.map((inc) => (
              <li key={inc.id} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-stone-700">{inc.type} — {inc.loc}</span>
                <span className="text-xs text-stone-400">{inc.status}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}