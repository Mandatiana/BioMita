import { useState } from "react";
import { Search } from "lucide-react";
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input";
import { AREAS, initialVisits } from "../data/MockData";

  function money(nombre_visiteurs: number): string {
    return nombre_visiteurs.toLocaleString("fr-FR") + " Ar";
  }
//liste des incidents

export default function Visitors() {
  const [query, setQuery] = useState<string>("");
  const [areaFilter, setAreaFilter] = useState<string>("Toutes");

  const filtered = initialVisits.filter((v) => {
    const matchesArea = areaFilter === "Toutes" || v.aire_nom === areaFilter;
    const matchesQuery = v.representant_nom.toLowerCase().includes(query.toLowerCase());
    return matchesArea && matchesQuery;
  });

  return (
    <div className="px-5 md:px-8">
      <div className="pt-6 md:pt-8 pb-5">
        <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Visiteurs</h1>
        <p className="text-sm text-stone-500 mt-0.5">Toutes les visites, tous agents confondus</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Rechercher un représentant…"
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
          {AREAS.map((a) => (
            <option key={a.id}>{a.nom}</option>
          ))}
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-500 border-b border-stone-100">
                <th className="px-5 py-3 font-medium">Heure</th>
                <th className="px-5 py-3 font-medium">Représentant</th>
                <th className="px-5 py-3 font-medium">Nationalité</th>
                <th className="px-5 py-3 font-medium">Aire</th>
                <th className="px-5 py-3 font-medium">Visiteurs</th>
                <th className="px-5 py-3 font-medium text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-stone-50 hover:bg-stone-50">
                  <td className="px-5 py-3 text-stone-500">{v.time}</td>
                  <td className="px-5 py-3 text-stone-900 font-medium">{v.representant_nom}</td>
                  <td className="px-5 py-3 text-stone-600">{v.nationalite}</td>
                  <td className="px-5 py-3 text-stone-600">{v.aire_nom}</td>
                  <td className="px-5 py-3 text-stone-600">{v.nombre_visiteurs}</td>
                  <td className="px-5 py-3 text-stone-900 text-right font-medium">{money(v.montant_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}