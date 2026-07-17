import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { HorizontalBarChart, RevenueLineChart } from "../../components/DashboardCharts";
import type { Visite, Incident, Observation } from "../../types/objectTypes";

const API_BASE = "http://localhost:8080";

function money(montant: number): string {
  return montant.toLocaleString("fr-FR") + " Ar";
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function pctDelta(current: number, previous: number): { text: string; up: boolean } {
  if (previous === 0) {
    return current > 0 ? { text: `+${current} vs hier`, up: true } : { text: "= vs hier", up: true };
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  return { text: `${pct >= 0 ? "+" : ""}${pct}% vs hier`, up: pct >= 0 };
}

function statutLabel(statut: string): string {
  switch (statut) {
    case "resolu":
      return "Résolu";
    case "en_cours":
      return "En cours";
    default:
      return "Signalé";
  }
}

type KpiCardProps = {
  label: string;
  value: string | number;
  delta: string;
  up: boolean;
};

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
  const [visites, setVisites] = useState<Visite[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      try {
        const [visitesRes, incidentsRes, observationsRes] = await Promise.all([
          fetch(`${API_BASE}/visites`),
          fetch(`${API_BASE}/incidents`),
          fetch(`${API_BASE}/observations`),
        ]);
        const [visitesData, incidentsData, observationsData] = await Promise.all([
          visitesRes.json(),
          incidentsRes.json(),
          observationsRes.json(),
        ]);
        setVisites(Array.isArray(visitesData) ? visitesData : []);
        setIncidents(Array.isArray(incidentsData) ? incidentsData : []);
        setObservations(Array.isArray(observationsData) ? observationsData : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const today = todayISO();
  const yesterday = yesterdayISO();

  // --- KPIs ---
  const visitesToday = visites.filter((v) => v.date_visite === today);
  const visitesYesterday = visites.filter((v) => v.date_visite === yesterday);
  const visitorsToday = visitesToday.reduce((sum, v) => sum + Number(v.nombre_visiteurs), 0);
  const visitorsYesterday = visitesYesterday.reduce((sum, v) => sum + Number(v.nombre_visiteurs), 0);
  const revenueToday = visitesToday.reduce((sum, v) => sum + Number(v.montant_total), 0);
  const revenueYesterday = visitesYesterday.reduce((sum, v) => sum + Number(v.montant_total), 0);

  const weekStart = daysAgoISO(7);
  const prevWeekStart = daysAgoISO(14);
  const observationsThisWeek = observations.filter((o) => o.date_observation >= weekStart).length;
  const observationsPrevWeek = observations.filter(
    (o) => o.date_observation >= prevWeekStart && o.date_observation < weekStart
  ).length;
  const observationsDelta = observationsThisWeek - observationsPrevWeek;

  const activeIncidents = incidents.filter((i) => i.statut !== "resolu");
  const incidentsToday = incidents.filter((i) => i.date_incident === today).length;
  const incidentsYesterday = incidents.filter((i) => i.date_incident === yesterday).length;

  const visitorsDelta = pctDelta(visitorsToday, visitorsYesterday);
  const revenueDelta = pctDelta(revenueToday, revenueYesterday);

  // --- Nationalités (nombre de visiteurs par nationalité, toutes visites confondues) ---
  const nationaliteTotals = new Map<string, number>();
  visites.forEach((v) => {
    const key = v.nationalite || "Non précisé";
    nationaliteTotals.set(key, (nationaliteTotals.get(key) ?? 0) + Number(v.nombre_visiteurs));
  });
  const nationaliteData = Array.from(nationaliteTotals.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // --- Revenus par mois (12 derniers mois avec données) ---
  const monthTotals = new Map<string, number>();
  visites.forEach((v) => {
    if (!v.date_visite) return;
    const monthKey = v.date_visite.slice(0, 7); // YYYY-MM
    monthTotals.set(monthKey, (monthTotals.get(monthKey) ?? 0) + Number(v.montant_total));
  });
  const revenueData = Array.from(monthTotals.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([monthKey, value]) => {
      const [year, month] = monthKey.split("-");
      const label = new Date(Number(year), Number(month) - 1).toLocaleDateString("fr-FR", { month: "short" });
      return { label, value };
    });

  const recentIncidents = [...incidents]
    .sort((a, b) => (b.date_incident || "").localeCompare(a.date_incident || ""))
    .slice(0, 6);

  return (
    <div className="px-5 md:px-8">
      <div className="pt-6 md:pt-8 pb-4">
        <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Tableau de bord</h1>
        <p className="text-sm text-stone-500 mt-0.5">Vue d'ensemble des aires gérées</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
        <KpiCard
          label="Visiteurs du jour"
          value={loading ? "…" : visitorsToday}
          delta={visitorsDelta.text}
          up={visitorsDelta.up}
        />
        <KpiCard
          label="Revenus du jour"
          value={loading ? "…" : money(revenueToday)}
          delta={revenueDelta.text}
          up={revenueDelta.up}
        />
        <KpiCard
          label="Observations (semaine)"
          value={loading ? "…" : observationsThisWeek}
          delta={`${observationsDelta >= 0 ? "+" : ""}${observationsDelta} vs sem. dernière`}
          up={observationsDelta >= 0}
        />
        <KpiCard
          label="Incidents actifs"
          value={loading ? "…" : activeIncidents.length}
          delta={`${incidentsToday - incidentsYesterday >= 0 ? "+" : ""}${incidentsToday - incidentsYesterday} vs hier`}
          up={incidentsToday - incidentsYesterday <= 0}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 pb-6">
        <Card className="flex flex-col">
          <CardHeader><CardTitle>Visiteurs par nationalité</CardTitle></CardHeader>
          <CardContent className="pt-0 h-72">
            <HorizontalBarChart data={nationaliteData} />
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader><CardTitle>Revenus par mois</CardTitle></CardHeader>
          <CardContent className="pt-0 h-72">
            <RevenueLineChart data={revenueData} />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Derniers incidents</CardTitle></CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-stone-100">
            {recentIncidents.map((inc) => (
              <li key={inc.id} className="flex items-center justify-between px-5 py-2.5">
                <span className="text-sm text-stone-700">{inc.type_incident} — {inc.localisation}</span>
                <span className="text-xs text-stone-400">{statutLabel(inc.statut)}</span>
              </li>
            ))}
            {recentIncidents.length === 0 && (
              <li className="px-5 py-4 text-sm text-stone-400">Aucun incident enregistré.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
