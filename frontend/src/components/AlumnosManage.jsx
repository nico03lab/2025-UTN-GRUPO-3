import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { UsersIcon, SearchIcon } from "@heroicons/react/24/outline";

/**
 * AlumnosManage.jsx
 * Panel completo de gestión de alumnos para directivos.
 * - Carga alumnos del backend
 * - Filtra en tiempo real por nombre, apellido, DNI o curso
 * - Muestra estadísticas generales
 */

export default function AlumnosManage() {
  const API_BASE_URL = "http://localhost:3002/api";

  const [alumnos, setAlumnos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/alumnos`)
      .then((res) => {
        setAlumnos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error al obtener alumnos:", err);
        setLoading(false);
      });
  }, []);

  // 🔹 Filtrado en tiempo real (nombre, apellido, DNI o curso)
  const alumnosFiltrados = useMemo(() => {
    return alumnos.filter((a) => {
      const texto = `${a.Nombres} ${a.Apellido} ${a.DNIAlumno} ${a.IdCurso}`.toLowerCase();
      return texto.includes(search.toLowerCase());
    });
  }, [alumnos, search]);

  // 🔹 Estadísticas rápidas
  const stats = {
    total: alumnos.length,
    activos: alumnos.filter((a) => a.Estado === "activo").length,
    inactivos: alumnos.filter((a) => a.Estado !== "activo").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 🧭 Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Listado de Alumnos</h3>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, DNI o curso..."
            className="input input-bordered w-full md:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 📊 Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="stat bg-base-200 rounded-box p-2 shadow">
          <div className="stat-title">Total</div>
          <div className="stat-value text-primary">{stats.total}</div>
        </div>
        <div className="stat bg-base-200 rounded-box p-2 shadow">
          <div className="stat-title">Activos</div>
          <div className="stat-value text-success">{stats.activos}</div>
        </div>
        <div className="stat bg-base-200 rounded-box p-2 shadow">
          <div className="stat-title">Inactivos</div>
          <div className="stat-value text-error">{stats.inactivos}</div>
        </div>
      </div>

      {/* 📋 Tabla de alumnos */}
      <div className="overflow-x-auto rounded-box bg-base-100 shadow">
        {loading ? (
          <div className="p-6 text-center opacity-70">Cargando alumnos...</div>
        ) : alumnosFiltrados.length === 0 ? (
          <div className="p-6 text-center opacity-70">No se encontraron alumnos.</div>
        ) : (
          <table className="table table-zebra table-sm w-full">
            <thead>
              <tr className="text-sm text-base-content/70">
                <th>DNI</th>
                <th>Nombre completo</th>
                <th>Curso</th>
                <th>Estado</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {alumnosFiltrados.map((a) => (
                <tr key={a.DNIAlumno}>
                  <td>{a.DNIAlumno}</td>
                  <td>{a.Apellido} {a.Nombres}</td>
                  <td>{a.IdCurso}</td>
                  <td>
                    <span
                      className={`badge ${
                        a.Estado === "activo" ? "badge-success" : "badge-error"
                      }`}
                    >
                      {a.Estado}
                    </span>
                  </td>
                  <td className="text-xs">{a.Email || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
