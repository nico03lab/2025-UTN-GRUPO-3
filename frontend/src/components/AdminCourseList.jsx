import { useMemo, useState } from "react";
import {
  BookOpenIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

/**
 * AdminCoursesList.jsx
 * Renderiza una lista o grilla de cursos filtrados.
 *
 * Props:
 * - cursos: array de cursos
 * - filtros: objeto { nivel, turno, grado, especialidad }
 * - selectedCurso: curso actualmente seleccionado
 * - setSelectedCurso: función para actualizar el curso activo
 */
export default function AdminCoursesList({
  cursos = [],
  filtros,
  selectedCurso,
  setSelectedCurso,
}) {
  const [vista, setVista] = useState("list"); // "grid" o "list"

  // 🔹 Filtrado dinámico según selectores activos
  const cursosFiltrados = useMemo(() => {
    return cursos.filter((c) => {
      const matchNivel = !filtros.nivel || c.Nivel === filtros.nivel;
      const matchTurno = !filtros.turno || c.Turno === filtros.turno;
      const matchGrado = !filtros.grado || c.Grado === parseInt(filtros.grado);
      const matchEspecialidad =
        filtros.nivel !== "Secundaria" ||
        !filtros.especialidad ||
        c.Especialidad === filtros.especialidad;
      return matchNivel && matchTurno && matchGrado && matchEspecialidad;
    });
  }, [cursos, filtros]);

  return (
    <section className="bg-base-100 rounded-box shadow p-4 md:p-6 mb-4">
      {/* 🧭 Encabezado con toggle de vista */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5 text-primary" />
          Cursos disponibles
        </h2>

        <div className="flex items-center gap-2">
          <button
            className={`btn btn-sm btn-square ${
              vista === "grid" ? "btn-primary" : "btn-ghost"
            }`}
            title="Vista de tarjetas"
            onClick={() => setVista("grid")}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            className={`btn btn-sm btn-square ${
              vista === "list" ? "btn-primary" : "btn-ghost"
            }`}
            title="Vista de lista"
            onClick={() => setVista("list")}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 🧩 Contenido dinámico */}
      {cursosFiltrados.length === 0 ? (
        <p className="text-sm opacity-70">
          {cursos.length === 0
            ? "No hay cursos cargados."
            : "No hay cursos que coincidan con los filtros."}
        </p>
      ) : vista === "grid" ? (
        // 🟩 Vista en tarjetas
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
          {cursosFiltrados.map((c) => (
            <button
              key={c.IdCurso}
              onClick={() => setSelectedCurso(c)}
              className={`p-4 text-left rounded-box border transition-all duration-200 
                ${
                  selectedCurso?.IdCurso === c.IdCurso
                    ? "bg-primary text-primary-content shadow-md"
                    : "bg-base-200 hover:bg-base-300"
                }`}
            >
              <div className="font-medium text-sm">
                {c.Grado}°{c.Letra} — {c.Nivel}
              </div>
              <div className="text-xs opacity-80">
                Turno: {c.Turno}
                {c.Especialidad && ` • ${c.Especialidad}`}
              </div>
            </button>
          ))}
        </div>
      ) : (
        // 🟦 Vista en lista
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="table table-zebra table-sm w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>Curso</th>
                <th>Nivel</th>
                <th>Turno</th>
                <th>Especialidad</th>
                <th>Capacidad</th>
              </tr>
            </thead>
            <tbody>
              {cursosFiltrados.map((c) => (
                <tr
                  key={c.IdCurso}
                  onClick={() => setSelectedCurso(c)}
                  className={`cursor-pointer ${
                    selectedCurso?.IdCurso === c.IdCurso
                      ? "bg-primary text-primary-content"
                      : ""
                  }`}
                >
                  <td>
                    {c.Grado}°{c.Letra}
                  </td>
                  <td>{c.Nivel}</td>
                  <td>{c.Turno}</td>
                  <td>{c.Especialidad || "-"}</td>
                  <td>{c.CantMaxAlumnos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
