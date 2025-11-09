import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { CalendarIcon, BookOpenIcon, TrendingUpIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

/**
 * AdminGradesTab.jsx
 * Muestra calificaciones agrupadas por alumno: promedio/observaciones primero, luego lista desplegable de materias.
 *
 * Props:
 * - curso: objeto del curso seleccionado (con IdCurso)
 * - onFilterChange: función opcional para reportar cambios de filtros
 */
export default function AdminGradesTab({ curso, onFilterChange }) {
  const API_BASE_URL = "http://localhost:3002/api";

  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState({});  // Para controlar qué alumno está expandido

  // Filtros (opcional, si quieres filtrar por alumno o algo más)
  const [filtros, setFiltros] = useState({
    alumno: "",  // Agrega si quieres filtrar por nombre
  });

  // Cargar calificaciones desde la API
  useEffect(() => {
    if (curso?.IdCurso) {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/cursos/${curso.IdCurso}/calificaciones`)
        .then((res) => {
          console.log("Calificaciones cargadas:", res.data);
          setCalificaciones(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al cargar calificaciones:", err);
          setCalificaciones([]);
          setLoading(false);
        });
    }
  }, [curso]);

  // Agrupar calificaciones por DNIAlumno
  const calificacionesAgrupadas = useMemo(() => {
    return calificaciones.reduce((acc, curr) => {
      const existente = acc.find(a => a.DNIAlumno === curr.DNIAlumno);
      if (existente) {
        // Agregar materia si no existe
        if (!existente.materias.some(m => m.Materia === curr.Materia)) {
          existente.materias.push({
            Materia: curr.Materia,
            NotaMateria: curr.NotaMateria,
          });
        }
      } else {
        acc.push({
          DNIAlumno: curr.DNIAlumno,
          Apellido: curr.Apellido,
          Nombres: curr.Nombres,
          Promedio: curr.Promedio,
          Observaciones: curr.Observaciones,
          materias: [{
            Materia: curr.Materia,
            NotaMateria: curr.NotaMateria,
          }],
        });
      }
      return acc;
    }, []);
  }, [calificaciones]);

  // Filtrar por alumno (opcional)
  const calificacionesFiltradas = useMemo(() => {
    return calificacionesAgrupadas.filter((a) => {
      const nombreCompleto = `${a.Apellido} ${a.Nombres}`.toLowerCase();
      return !filtros.alumno || nombreCompleto.includes(filtros.alumno.toLowerCase());
    });
  }, [calificacionesAgrupadas, filtros]);

  const handleFilterChange = (key, value) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
    onFilterChange?.(key, value);
  };

  const toggleExpand = (dni) => {
    setExpandido((prev) => ({
      ...prev,
      [dni]: !prev[dni],
    }));
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando calificaciones...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header del curso */}
      <div className="flex items-center justify-between bg-base-200 p-3 rounded-box">
        <div>
          <h3 className="font-semibold">
            Calificaciones — {curso.Grado}°{curso.Letra} {curso.Nivel}
          </h3>
          <p className="text-sm opacity-70">Ver promedios y detalles por alumno</p>
        </div>
      </div>

      {/* Filtros opcionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="label text-sm font-medium">
            Buscar Alumno
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Apellido o Nombre"
            value={filtros.alumno}
            onChange={(e) => handleFilterChange("alumno", e.target.value)}
          />
        </div>
      </div>

      {/* Lista de alumnos */}
      <div className="space-y-4">
        {calificacionesFiltradas.length > 0 ? (
          calificacionesFiltradas.map((alumno) => (
            <div key={alumno.DNIAlumno} className="bg-base-100 p-4 rounded-box shadow">
              {/* Información principal: Promedio y Observaciones */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{alumno.Apellido} {alumno.Nombres}</h4>
                  <p className="text-sm opacity-70">
                    <strong>Promedio:</strong> {alumno.Promedio}/10
                  </p>
                  <p className="text-sm opacity-70">
                    <strong>Observaciones:</strong> {alumno.Observaciones || "Sin observaciones"}
                  </p>
                </div>
                {/* Botón para expandir/colapsar */}
                <button
                  onClick={() => toggleExpand(alumno.DNIAlumno)}
                  className="btn btn-sm btn-outline"
                >
                  {expandido[alumno.DNIAlumno] ? (
                    <>
                      <ChevronUpIcon className="h-4 w-4 mr-1" /> Ocultar Materias
                    </>
                  ) : (
                    <>
                      <ChevronDownIcon className="h-4 w-4 mr-1" /> Ver Materias
                    </>
                  )}
                </button>
              </div>

              {/* Lista desplegable de materias */}
              {expandido[alumno.DNIAlumno] && (
                <div className="mt-4 border-t pt-4">
                  <h5 className="font-medium mb-2">Materias y Notas</h5>
                  <ul className="space-y-2">
                    {alumno.materias.map((materia, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-base-200 p-2 rounded">
                        <span>{materia.Materia}</span>
                        <span className="font-semibold text-primary">{materia.NotaMateria}/10</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center opacity-70">No hay calificaciones que coincidan con los filtros.</div>
        )}
      </div>
    </div>
  );
}