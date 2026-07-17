import Dashboard from "./Dashboard";
import Visitors from "./Visitors";
import Incidents from "../Incidents";
import Observations from "../Observations";
import Agents from "../Agents";
import Areas from "./Area";
import { useState } from "react";
import {
  LayoutDashboard, Users, Search, AlertTriangle, User, MapPin,
  Leaf, LogOut,
} from "lucide-react";


//ireto ilay menu ho clickena
type MenuKey = 
    | "Dashboard"
    | "visitors"
    | "incidents"
    | "observations"
    | "agents"
    |  "areas";



//composante d'un menu
type NavItem = {
    key: MenuKey;
    label: string;
    icon: LucideIcon;
}


//avec les données preparées
const navItems: NavItem[] = [
  { key: "Dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "visitors", label: "Visiteurs", icon: Users },
  { key: "incidents", label: "Incidents", icon: AlertTriangle },
  { key: "observations", label: "Observations", icon: Search },
  { key: "agents", label: "Agents", icon: User },
  { key: "areas", label: "Aires protégées", icon: MapPin },
];



export default function AdminLayout(){
    const [current, setCurrent] = useState<MenuKey>("Dashboard");

    function RenduPage(){
        switch(current){
            case "Dashboard":
                return <Dashboard />;
            case "agents":
                return <Agents />;
            case "visitors": 
                return <Visitors />
            case "areas":
                return <Areas />
            case "incidents":
                return <Incidents />
            case "observations":
                return <Observations />
        }
    }

    return(
        <section className="min-h-screen bg-stone-50 flex">
            <aside className="w-64 shrink-0 bg-white border-r border-stone-200 flex flex-col">
                <div className="h-16 flex items-center gap-2.5 px-5 border-b border-stone-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-900 flex items-center justify-center">
                        <Leaf size={16} className="text-white" />
                    </div>
                    <span className="font-semibold text-stone-900 tracking-tight">BIO MITA</span>
                </div>
                <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-6 pt-4 pb-2">
                    Menu
                </p>

                <nav className="flex-1 px-3 space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = current === item.key;
                        return (
                        <button
                            key={item.key}
                            onClick={() => setCurrent(item.key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            isActive
                                ? "bg-emerald-900 text-white shadow-sm"
                                : "text-stone-600 hover:bg-stone-100"
                            }`}
                        >
                            <item.icon
                            size={17}
                            className={isActive ? "text-white" : "text-stone-400"}
                            />
                            {item.label}
                        </button>
                        );
                    })}
                </nav>

                <div className="border-t border-stone-100 p-3">
                    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-stone-500 hover:bg-stone-100">
                        <LogOut size={15} /> Déconnexion
                    </button>
                </div>

            </aside>

            <main className="flex-1 min-w-0">{RenduPage()}</main>
        </section>
    )

}