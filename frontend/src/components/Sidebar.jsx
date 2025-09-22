import React from "react";
import {
  BookOpenIcon,
  CheckCircleIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

// Lista de cursos
export function CursoList({ cursos, selectedCurso, setSelectedCurso, setTab }) {
  return (
    <div className="space-y-2">
      {cursos.map(c => (
        <button
          key={c.IdCurso}
          onClick={() => { setSelectedCurso(c.IdCurso); setTab("attendance"); }}
          className={`w-full text-left p-3 rounded-box flex items-center gap-3 ${
            selectedCurso === c.IdCurso
              ? `bg-${c.color} text-${c.color}-content`
              : "hover:bg-base-200"
          }`}
        >
          <div className={`bg-${c.color} bg-opacity-20 p-2 rounded-box`}>
            <BookOpenIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium">{c.Materia} • {c.Nivel}</div>
            <div className="text-xs opacity-70">{c.alumnos} alumnos</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// Selector de tabs
export function TabSelector({ tab, setTab }) {
  return (
    <div className="mt-6 border-t pt-4 opacity-70 text-sm space-y-2">
      <button
        onClick={() => setTab("attendance")}
        className={`flex items-center gap-3 w-full p-2 rounded-box ${
          tab === "attendance" ? "bg-primary text-primary-content" : "hover:bg-base-200"
        }`}
      >
        <CheckCircleIcon className="h-5 w-5" /> Pasar Asistencia
      </button>

      <button
        onClick={() => setTab("schedule")}
        className={`flex items-center gap-3 w-full p-2 rounded-box ${
          tab === "schedule" ? "bg-secondary text-secondary-content" : "hover:bg-base-200"
        }`}
      >
        <CalendarIcon className="h-5 w-5" /> Ver Horarios
      </button>

      <button
        onClick={() => setTab("grades")}
        className={`flex items-center gap-3 w-full p-2 rounded-box ${
          tab === "grades" ? "bg-accent text-accent-content" : "hover:bg-base-200"
        }`}
      >
        <AcademicCapIcon className="h-5 w-5" /> Calificar Alumnos
      </button>
    </div>
  );
}

// Panel de estadísticas
export function StatsPanel({ stats }) {
  return (
    <div className="mt-6 bg-base-100 rounded-box p-4 shadow">
      <div className="mb-3 text-sm font-medium opacity-70">Estadísticas</div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 rounded-box bg-primary bg-opacity-20">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5 text-primary" />
            <span className="text-sm">Total alumnos</span>
          </div>
          <span className="font-semibold text-primary">{stats.totalAlumnos}</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-box bg-success bg-opacity-20">
          <div className="flex items-center gap-2">
            <CheckBadgeIcon className="h-5 w-5 text-success" />
            <span className="text-sm">Asistencia promedio</span>
          </div>
          <span className="font-semibold text-success">{stats.asistenciaPromedio}%</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-box bg-warning bg-opacity-20">
          <div className="flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-warning" />
            <span className="text-sm">Calificación promedio</span>
          </div>
          <span className="font-semibold text-warning">{stats.calificacionPromedio}</span>
        </div>
      </div>
    </div>
  );
}

// Sidebar completo
export default function Sidebar({ cursos, selectedCurso, setSelectedCurso, tab, setTab, stats }) {
  return (
    <aside className="lg:col-span-1">
      <div className="bg-base-100 rounded-box p-4 shadow">
        <CursoList cursos={cursos} selectedCurso={selectedCurso} setSelectedCurso={setSelectedCurso} setTab={setTab} />
        <TabSelector tab={tab} setTab={setTab} />
      </div>
      <StatsPanel stats={stats} />
    </aside>
  );
}
