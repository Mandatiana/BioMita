import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import type { Agent } from "../types/objectTypes";



//informations des agents employées par l admin du site touristique
export default function Agents() {

  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(()=>{
    async function getAgents(){
      try{
        const res = await fetch('http://localhost:8080/utilisateurs/agents-terrain-full');
        const agents: Agent[] = await res.json();
        setAgents(agents);
      }
      catch(error){console.error(error)}
    }
    getAgents();
  });

  return (
    <div className="px-5 md:px-8">
      <div className="pt-6 md:pt-8 pb-5">
        <h1 className="text-xl font-semibold text-stone-900 tracking-tight">Agents</h1>
        <p className="text-sm text-stone-500 mt-0.5">Agents de terrain et statistiques d'activité</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {agents.map((a) => (
          <Card key={a.id}>
            <CardContent>
              <p className="font-medium text-stone-900">{a.nom}</p>
              <p className="text-xs text-stone-500">{a.aire_nom}</p>
            </CardContent>
            <div className="grid grid-cols-3 border-t border-stone-100">
              {([[a.total_visites, "Visites"], [a.total_observations, "Observ."], [a.total_incidents, "Incidents"]] as const).map(
                ([value, label]) => (
                  <div key={label} className="text-center py-3 border-r last:border-r-0 border-stone-100">
                    <p className="text-sm font-semibold text-stone-900">{value}</p>
                    <p className="text-[11px] text-stone-500">{label}</p>
                  </div>
                )
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}