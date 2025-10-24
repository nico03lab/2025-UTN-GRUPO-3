import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { UserGroupIcon, SearchIcon } from "@heroicons/react/24/outline"; 
/**
 * DocentesManage.jsx
 * Panel completo de gestión de docentes para directivos.
 * - Carga docentes del backend
 * - Filtra en tiempo real por nombre, apellido, DNI o materia
 * - Muestra estadísticas generales
 */

export default function DocentesManage() {
  const API_BASE_URL = "http://localhost:3002/api";

  const [docentes, setDocentes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState({});

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/docentes/materias`)
      .then((res) => {
        setDocentes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener docentes:", err);
        setLoading(false);
      });
  }, []);

  // Agrupar docentes por DNI con sus materias
  const docentesAgrupados = useMemo(() => {
    return docentes.reduce((acc, curr) => {
      const existente = acc.find(d => d.DNIDocente === curr.DNIDocente);
      
      if (existente) {
        if (curr.Materia && !existente.materias.includes(curr.Materia)) {
          existente.materias.push(curr.Materia);
        }
      } else {
        acc.push({
          DNIDocente: curr.DNIDocente,
          Nombre: curr.Nombre,
          Apellido: curr.Apellido,
          Email: curr.Email,
          materias: curr.Materia ? [curr.Materia] : []
        });
      }
      
      return acc;
    }, []);
  }, [docentes]);

  //Filtrado en tiempo real (nombre, apellido, DNI o materia)
  const docentesFiltrados = useMemo(() => {
    return docentesAgrupados.filter((d) => {
      const texto = `${d.Nombre} ${d.Apellido} ${d.DNIDocente} ${d.Email} ${d.materias.join(' ')}`.toLowerCase();
      return texto.includes(search.toLowerCase());
    });
  }, [docentesAgrupados, search]);

  const toggleExpand = (dni) => {
    setExpandido(prev => ({
      ...prev,
      [dni]: !prev[dni]
    }));
  };

  //Estadísticas rápidas
  const stats = {
    total: docentesAgrupados.length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Listado de Docentes</h3>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o materia..."
            className="input input-bordered w-full md:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Estadísticas en una línea */}
      <div className="flex items-center gap-2 px-4">
        <span className="text-base-content/70">Total de docentes:</span>
        <span className="text-xl font-semibold text-primary">{stats.total}</span>
      </div>

      {/* Tabla de docentes */}
      <div className="overflow-x-auto rounded-box bg-base-100 shadow">
        {loading ? (
          <div className="p-6 text-center opacity-70">Cargando docentes...</div>
        ) : docentesFiltrados.length === 0 ? (
          <div className="p-6 text-center opacity-70">No se encontraron docentes.</div>
        ) : (
          <table className="table table-zebra table-sm w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>DNI</th>
                <th>Nombre y Apellido</th>
                <th>Materias</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {docentesFiltrados.map((d) => (
                <tr key={d.DNIDocente}>
                  <td>{d.DNIDocente}</td>
                  <td>{d.Apellido} {d.Nombre}</td>
                  <td>
                    <div>
                      <button 
                        onClick={() => toggleExpand(d.DNIDocente)}
                        className="flex items-center gap-2 text-blue-900 hover:text-blue-900 transition-colors"
                        >
                        <span className="text-xs text-blue-900">{expandido[d.DNIDocente] ? '▼' : '▶'}</span>
                        <span className="font-medium">
                            {d.materias.length} materia{d.materias.length !== 1 ? 's' : ''}
                        </span>
                      </button>
                      
                      {expandido[d.DNIDocente] && (
                        <ul className="mt-2 ml-4 space-y-1">
                          {d.materias.length > 0 ? (
                            d.materias.map((materia, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <span className="text-primary">•</span>
                                <span>{materia}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-base-content/50">Sin materias asignadas</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </td>
                  <td className="text-xs">{d.Email || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}