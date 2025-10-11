import CardNota from "../components/CardNota";
import {UserCheck} from "lucide-react";
import { BookUser } from 'lucide-react';
import { GraduationCap } from 'lucide-react';
import { Users } from 'lucide-react';
import { UserLock } from 'lucide-react';


export const HomePage = () => {
  return (
    <div className="bg-base-200">
    <div className="container mx-auto px-4 md:px-8 py-8">
      <header className="bg-base-100">
        <div className="navbar bg-base-150 p-6 rounded-lg shadow-md mb-6">
        <div className="flex-1">
            <a className="font-bold text-blue-400 ">Inicio</a>
        </div>
        <label className="flex cursor-pointer gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path
                d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <input type="checkbox" value="dark" className="toggle theme-controller" />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        </label>
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