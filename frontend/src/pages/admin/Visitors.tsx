import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { NewVisitModal } from "../../components/ui/formulaireVisite";
import { fetchVisites, type VisiteApiRow } from "../../lib/api";
import { formatMontant } from "../../lib/format";

// tableau qui va afficher la liste des visiteurs (données réelles depuis le backend)
export default function Visitors() {
  const [visits, setVisits] = useState<VisiteApiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [areaFilter, setAreaFilter] = useState<string>("Toutes");
  const [modalOpen, setModalOpen] = useState(false);

  function loadVisites() {
    setLoading(true);
    setLoadError(null);
    fetchVisites()
      .then(setVisits)
      .catch(() => setLoadError("Impossible de charger les visites depuis le serveur."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadVisites();
  }, []);

  const areasDisponibles = Array.from(new Set(visits.map((v) => v.aire_nom)));

  const filtered = visits.filter((v) => {
    const matchesArea = areaFilter === "Toutes" || v.aire_nom === areaFilter;
    const matchesQuery = v.representant_nom.toLowerCase().includes(query.toLowerCase());
    return matchesArea && matchesQuery;
  });

  function handleCreated() {
    setModalOpen(false);
    loadVisites(); // recharge la liste depuis le backend pour refléter la BD
  }

  return (
    <div className="px-5 md:px-8">
      <div className="pt-6 md:pt-8 pb-5 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Visiteurs</h1>
          <p className="text-sm text-stone-500 mt-0.5">Toutes les visites, tous agents confondus</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Nouvelle visite
        </Button>
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
          {areasDisponibles.map((nom) => (
            <option key={nom}>{nom}</option>
          ))}
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-500 border-b border-stone-100">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Représentant</th>
                <th className="px-5 py-3 font-medium">Nationalité</th>
                <th className="px-5 py-3 font-medium">Aire</th>
                <th className="px-5 py-3 font-medium">Visiteurs</th>
                <th className="px-5 py-3 font-medium text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-stone-400">
                    Chargement…
                  </td>
                </tr>
              )}
              {!loading && loadError && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-red-600">
                    {loadError}
                  </td>
                </tr>
              )}
              {!loading && !loadError && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-stone-400">
                    Aucune visite enregistrée.
                  </td>
                </tr>
              )}
              {!loading &&
                !loadError &&
                filtered.map((v) => (
                  <tr key={v.id} className="border-b border-stone-50 hover:bg-stone-50">
                    <td className="px-5 py-3 text-stone-500">
                      {new Date(v.date_visite).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3 text-stone-900 font-medium">{v.representant_nom}</td>
                    <td className="px-5 py-3 text-stone-600">{v.nationalite}</td>
                    <td className="px-5 py-3 text-stone-600">{v.aire_nom}</td>
                    <td className="px-5 py-3 text-stone-600">{v.nombre_visiteurs}</td>
                    <td className="px-5 py-3 text-stone-900 text-right font-medium">
                      {formatMontant(Number(v.montant_total))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      <NewVisitModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={handleCreated} />
    </div>
  );
}
