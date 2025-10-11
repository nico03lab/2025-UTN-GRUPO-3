import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SolicitudDashboard from "../components/SolicitudDashboard";

export default function Solicitudes() {
  const [inscripciones, setInscripciones] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3002/api/inscripcion")
      .then((res) => {
        setInscripciones(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error al cargar inscripciones:", err);
        setLoading(false);
      });
  }, []);

  // 🔍 Filtrado dinámico
  const filtered = inscripciones.filter((i) => {
    const texto = `${i.DNIAlumno} ${i.Nivel} ${i.Grado} ${i.Turno}`.toLowerCase();
    return texto.includes(search.toLowerCase());
  });

  const getColor = (estado) => {
    switch (estado.toLowerCase()) {
      case "aprobada":
        return "bg-green-100 border-green-400 text-green-800";
      case "rechazada":
        return "bg-red-100 border-red-400 text-red-800";
      default:
        return "bg-yellow-100 border-yellow-400 text-yellow-800";
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">📋 Inscripciones</h1>

      {/* 🔎 Buscador */}
      <input
        type="text"
        placeholder="Buscar por DNI, nivel o turno..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input input-bordered w-full mb-6"
      />

      {loading ? (
        <div className="text-center py-6 opacity-70">Cargando inscripciones...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 📜 Listado */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-3">
              Resultados ({filtered.length})
            </h2>

            {filtered.length === 0 ? (
              <p className="text-sm opacity-70">
                No se encontraron inscripciones.
              </p>
            ) : (
              filtered.map((i) => (
                <div
                  key={i.IdInscripcion}
                  onClick={() => setSeleccionada(i)}
                  className={`cursor-pointer p-4 mb-3 rounded-box border-l-4 transition-all shadow hover:shadow-md ${getColor(i.Estado)} ${
                    seleccionada?.IdInscripcion === i.IdInscripcion
                      ? "ring ring-primary ring-offset-1"
                      : ""
                  }`}
                >
                  <h3 className="font-semibold text-sm">
                    DNI: {i.DNIAlumno}
                  </h3>
                  <h3 className="font-semibold text-sm">
                    Apellido y nombres: {i.Apellido} {i.Nombres}
                  </h3>
                  <p className="text-sm opacity-80">
                    {i.Nivel} — {i.Grado}° ({i.Turno})
                  </p>
                  <p className="text-xs opacity-70">
                    Fecha: {new Date(i.FechaInscripcion).toLocaleDateString()}
                  </p>
                  <span className="text-xs font-medium">{i.Estado}</span>
                </div>
              ))
            )}
          </div>

          {/* 📊 Panel de detalle */}
          <div className="md:col-span-2">
            {seleccionada ? (
              <SolicitudDashboard solicitud={seleccionada} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 italic opacity-60">
                Selecciona una inscripción para ver más detalles.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
