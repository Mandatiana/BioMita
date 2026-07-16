import { useState } from "react";
import { Leaf, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import Illustration from "../assets/fauneflore.svg";
import { useNavigate } from "react-router-dom";


// refa mse connecter dia mandray valeur iray amreo
type Role  = "agent" | "responsable";

type LoginProps = {

  // mitondra ilay role oe agent sa responsable, parametre 
  onLogin: (role: Role) => void;
};



export default function LoginScreen ({onLogin}: LoginProps){

  //<Role>: memoire qui ne peut contenir que agent ou responsable
  const[role, setRole] = useState<Role>("agent");
  const navigate = useNavigate();
  const roles: {key: Role, label: string}[] = [
    {key: "agent", label:"agent de terrain"},
    {key: "responsable", label: "responsable"},
  ];

  return(
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12">
        <div className="max-w-sm mx-auto w-full">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-emerald-900 flex items-center justify-center shadow-sm">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-stone-900">
              BIO MITA
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-stone-900 mb-1 tracking-tight">
            Connexion
          </h1>
          <p className="text-sm text-stone-500 mb-8">
            Gestion des aires protégées de Madagascar
          </p>

          <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 rounded-xl mb-8">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  role === r.key
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <Label>Identifiant</Label>
              <Input
                defaultValue={role === "agent" ? "lord snow" : "monsieur.responsable"}
              />
            </div>
            <div>
              <Label>Mot de passe</Label>
              <Input type="password" defaultValue="••••••••" />
            </div>
            <Button className="w-full mt-2" size="lg" onClick={() =>{ onLogin(role); navigate('/adminLayout');}}>
              Se connecter <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-emerald-50 h-full">
        <img
          src={Illustration}
          alt="Illustration terrain BIO MITA"
          className="w-full h-full object-contain p-16"
        />
      </div>
    </div>
  )


}