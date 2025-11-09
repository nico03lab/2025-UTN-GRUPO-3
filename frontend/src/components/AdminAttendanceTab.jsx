import { useEffect, useState } from "react";
import axios from "axios";  // Agrega axios para llamadas a la API
import { CalendarIcon, UserGroupIcon, BookOpenIcon } from "@heroicons/react/24/outline";

/**
 * AdminAttendanceTab.jsx
 * Permite al directivo filtrar y visualizar asistencias de un curso.
 *
 * Props:
 * - curso: objeto del curso seleccionado (con IdCurso)
 * - onFilterChange: función opcional para reportar cambios de filtros
 */
export default function AdminAttendanceTab({ curso, onFilterChange }) {
  const API_BASE_URL = "http://localhost:3002/api";  // Ajusta si es diferente

  const [asistencias, setAsistencias] = useState([]);  // Datos reales desde la API
  const [materias, setMaterias] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros seleccionados
  const [filtros, setFiltros] = useState({
    materia: "",
    fecha: "",
  });

  // 🔹 Cargar asistencias desde la API
  useEffect(() => {
    if (curso?.IdCurso) {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/asistencias/${curso.IdCurso}`)
        .then((res) => {
          console.log("Asistencias cargadas:", res.data);
          setAsistencias(res.data);  // Setear datos reales
          // Extraer materias y fechas únicas de los datos
          const uniqueMaterias = [...new Set(res.data.map(a => a.Materia))];
          const uniqueFechas = [...new Set(res.data.map(a => a.Fecha))];
          setMaterias(uniqueMaterias);
          setFechas(uniqueFechas);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al cargar asistencias:", err);
          setAsistencias([]);
          setMaterias([]);
          setFechas([]);
          setLoading(false);
        });
    }
  }, [curso]);

  const handleFilterChange = (key, value) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
    onFilterChange?.(key, value);
  };

  // 🔹 Filtrar asistencias por filtros activos
  const asistenciasFiltradas = asistencias.filter((a) => {
    const matchMateria = !filtros.materia || a.Materia === filtros.materia;
    const matchFecha = !filtros.fecha || a.Fecha === filtros.fecha;
    return matchMateria && matchFecha;
  });

  if (loading) {
    return <div className="p-6 text-center">Cargando asistencias...</div>;
  }

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

      {/* 📋 Lista de asistencias */}
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
                  <td>{a.Apellido} {a.Nombres}</td>
                  <td>{a.Materia}</td>
                  <td>{a.Fecha}</td>
                  <td>
                    <input type="checkbox" className="checkbox checkbox-sm" checked={!!a.Presente} readOnly />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center opacity-70">
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