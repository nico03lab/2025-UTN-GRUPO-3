import { useMemo } from "react";
import {
  BookOpenIcon,
  CheckCircleIcon,
  CalendarIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function AdminCourseSidebar({
  cursos = [],
  selectedCurso,
  setSelectedCurso,
  tab,
  setTab,
  filters = { nivel: "", turno: "", grado: "" }, // ✅ cambio aquí
  setFilters = () => {},                         // ✅ y aquí
}) {
  const cursosFiltrados = useMemo(() => {
    return cursos.filter((c) => {
      const matchNivel = !filters.nivel || c.Nivel === filters.nivel;
      const matchTurno = !filters.turno || c.Turno === filters.turno;
      const matchGrado = !filters.grado || c.Grado === parseInt(filters.grado);
      return matchNivel && matchTurno && matchGrado;
    });
  }, [cursos, filters]);

  const handleChangeFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ nivel: "", turno: "", grado: "" });
  };

  return (
    <div className="bg-base-100 rounded-box p-4 shadow space-y-5">
      {/* 🧭 Filtros */}
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
          <BookOpenIcon className="h-5 w-5 text-primary" />
          Filtrar cursos
        </h2>

        <div className="space-y-2">
          {/* Nivel */}
          <select
            className="select select-bordered w-full"
            value={filters.nivel}
            onChange={(e) => handleChangeFilter("nivel", e.target.value)}
          >
            <option value="">Nivel</option>
            <option value="Primario">Primario</option>
            <option value="Secundario">Secundario</option>
          </select>

          {/* Turno */}
          <select
            className="select select-bordered w-full"
            value={filters.turno}
            onChange={(e) => handleChangeFilter("turno", e.target.value)}
          >
            <option value="">Turno</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
          </select>

          {/* Grado */}
          <select
            className="select select-bordered w-full"
            value={filters.grado}
            onChange={(e) => handleChangeFilter("grado", e.target.value)}
          >
            <option value="">Grado / Año</option>
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <option key={g} value={g}>
                {g}°
              </option>
            ))}
          </select>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className="btn btn-xs btn-outline w-full mt-1"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* 📘 Curso seleccionado */}
      {selectedCurso && (
        <div className="bg-base-200 rounded-box p-3 text-sm shadow-sm">
          <p className="font-medium">
            {selectedCurso.Grado}°{selectedCurso.Letra} —{" "}
            {selectedCurso.Nivel}
          </p>
          <p className="opacity-70">
            Turno: {selectedCurso.Turno}
            {selectedCurso.Especialidad && ` • ${selectedCurso.Especialidad}`}
          </p>
        </div>
      )}

      {/* ⚙️ Navegación secundaria */}
      <div className="mt-4 border-t pt-3 text-sm space-y-2 opacity-90">
        <SidebarButton
          icon={<CheckCircleIcon className="h-5 w-5" />}
          label="Asistencias"
          active={tab === "attendance"}
          onClick={() => setTab("attendance")}
          color="primary"
        />
        <SidebarButton
          icon={<AcademicCapIcon className="h-5 w-5" />}
          label="Calificaciones"
          active={tab === "grades"}
          onClick={() => setTab("grades")}
          color="accent"
        />
        <SidebarButton
          icon={<CalendarIcon className="h-5 w-5" />}
          label="Calendario"
          active={tab === "calendar"}
          onClick={() => setTab("calendar")}
          color="secondary"
        />

        <SidebarButton
          icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
          label="Horarios"
          active={tab === "schedule"}
          onClick={() => setTab("schedule")}
          color="neutral"
        />
      </div>
    </div>
  );
}

// 🔹 Subcomponente de botón reutilizable
function SidebarButton({ icon, label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-2 rounded-box transition-all ${
        active
          ? `bg-${color} text-${color}-content shadow`
          : "hover:bg-base-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
