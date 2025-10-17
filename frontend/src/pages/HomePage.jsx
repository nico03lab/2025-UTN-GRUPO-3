import CardNota from "../components/CardNota";
import {UserCheck} from "lucide-react";
import { GraduationCap } from 'lucide-react';
import { Users } from 'lucide-react';
import { UserLock } from 'lucide-react';
import ThemeToggle from "../components/ThemeToggle";


export const HomePage = () => {
  return (
    <div className="bg-base-200">
    <div className="container mx-auto px-4 md:px-8 py-8">
      <header className="bg-base-100">
        <div className="navbar bg-base-150 p-6 rounded-lg shadow-md mb-6">
        <div className="flex-1">
            <a className="font-bold text-blue-400 ">Inicio</a>
        </div>
        <ThemeToggle/>
    </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <CardNota texto="Inscripcion" path="/inscripcion" descripcion="Gestion de inscripciones" icon={UserCheck}/>
        <CardNota texto="Docente" path="/docente" descripcion="Portal de docentes" icon={Users}/>
        <CardNota texto="Estudiantes" path="/estudiantes" descripcion="Portal de estudiantes y padres" icon={GraduationCap}/>
        <CardNota texto="Directivos" path="/directivos" descripcion="Portal de directivos" icon={UserLock}/>
      </div>
    </div>
    </div>
    
  );
};