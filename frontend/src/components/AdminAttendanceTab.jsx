import { useEffect, useState } from "react";
import { CalendarIcon, UserGroupIcon, BookOpenIcon } from "@heroicons/react/24/outline";

/**
 * AdminAttendanceTab.jsx
 * Permite al directivo filtrar y visualizar asistencias de un curso.
 *
 * Props:
 * - asistencias: array con datos de asistencia (simulados o del backend)
 * - curso: objeto del curso seleccionado
 * - onFilterChange: función opcional para reportar cambios de filtros
 */
export default function AdminAttendanceTab({ asistencias = [], curso, onFilterChange }) {
  const [materias, setMaterias] = useState([]);
  const [fechas, setFechas] = useState([]);

  // Filtros seleccionados
  const [filtros, setFiltros] = useState({
    materia: "",
    fecha: "",
  });

  // 🔹 Simulación inicial de materias y docentes (luego lo traerás del backend)
  useEffect(() => {
    if (curso) {
      setMaterias([
        "Matemática",
        "Lengua",
        "Ciencias Naturales",
        "Inglés",
      ]);
      // Fechas simuladas de registros previos de asistencia
      setFechas([
        "2025-10-08",
        "2025-10-09",
        "2025-10-10",
      ]);
    }
  }, [curso]);

  const handleFilterChange = (key, value) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
    onFilterChange?.(key, value);
  };

  // 🔹 Filtrar asistencias por filtros activos (por ahora simulado)
  const asistenciasFiltradas = asistencias.filter((a) => {
    const matchMateria = !filtros.materia || a.materia === filtros.materia;
    const matchFecha = !filtros.fecha || a.fecha === filtros.fecha;
    return matchMateria && matchFecha;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* 🧭 Header del curso */}
      <div className="flex items-center justify-between bg-base-200 p-3 rounded-box">
        <div>
          <h3 className="font-semibold">
            Asistencias — {curso.Grado}°{curso.Letra} {curso.Nivel}
          </h3>
          <p className="text-sm opacity-70">Seleccione filtros o una fecha para ver detalles</p>
        </div>
      </div>

      {/* 🎚️ Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="label text-sm font-medium">
            <BookOpenIcon className="h-4 w-4 mr-1 inline" /> Materia
          </label>
          <select
            className="select select-bordered w-full"
            value={filtros.materia}
            onChange={(e) => handleFilterChange("materia", e.target.value)}
          >
            <option value="">Todas</option>
            {materias.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label text-sm font-medium">
            <CalendarIcon className="h-4 w-4 mr-1 inline" /> Fecha
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={filtros.fecha}
            onChange={(e) => handleFilterChange("fecha", e.target.value)}
          />
        </div>
      </div>

      {/* 📅 Fechas disponibles */}
      <div className="mt-4">
        <h4 className="font-medium mb-2">Registros disponibles</h4>
        {fechas.length === 0 ? (
          <p className="text-sm opacity-70">No hay registros de asistencia aún.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {fechas.map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange("fecha", f)}
                className={`btn btn-sm ${
                  filtros.fecha === f ? "btn-primary" : "btn-outline"
                }`}
              >
                {new Date(f).toLocaleDateString("es-AR", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 📋 Lista de asistencias (simulada) */}
      <div className="overflow-x-auto mt-4">
        <table className="table table-sm table-zebra">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Materia</th>
              <th>Fecha</th>
              <th>Presente</th>
            </tr>
          </thead>
          <tbody>
            {asistenciasFiltradas.length > 0 ? (
              asistenciasFiltradas.map((a, idx) => (
                <tr key={idx}>
                  <td>{a.alumno}</td>
                  <td>{a.materia}</td>
                  <td>{a.fecha}</td>
                  <td>
                    <input type="checkbox" className="checkbox checkbox-sm" checked={a.presente} readOnly />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center opacity-70">
                  No hay registros que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
