import { useState, useEffect, useRef } from "react";
import axios from "axios";
import SolicitudDashboard from "../components/SolicitudDashboard";
import { ClipboardList } from 'lucide-react';
export default function Solicitudes() {
  const [inscripciones, setInscripciones] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todas"); // 👈 nuevo estado
  const dashboardRef = useRef(null);

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

  // 🧠 Ocultar panel al hacer clic fuera del detalle
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dashboardRef.current && !dashboardRef.current.contains(e.target)) {
        setSeleccionada(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📦 Filtro combinado: texto + estado
  const filtered = inscripciones.filter((i) => {
    const texto = `${i.DNIAlumno} ${i.Nivel} ${i.Grado} ${i.Turno}`.toLowerCase();
    const coincideTexto = texto.includes(search.toLowerCase());
    const coincideEstado =
      filtroEstado === "todas" || i.Estado.toLowerCase() === filtroEstado;
    return coincideTexto && coincideEstado;
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
      <div className="flex items-center mb-4">
        <ClipboardList size={25} className="mr-1"/> 
        <h1 className="text-2xl font-bold"> 
          Inscripciones
        </h1>
      </div>
      {/* 🔎 Buscador */}
      <input
        type="text"
        placeholder="Buscar por DNI, nivel o turno..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input input-bordered w-full mb-4"
      />

      {/* 🧩 Filtros de estado */}
      <div className="flex gap-2 mb-6">
        {["todas", "pendiente", "aprobada", "rechazada"].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`btn btn-sm capitalize ${
              filtroEstado === estado
                ? "btn-primary"
                : "btn-outline btn-primary"
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-6 opacity-70">
          Cargando inscripciones...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 📜 Listado */}
          <div className="md:col-span-1 flex flex-col h-[600px]">
            <h2 className="text-xl font-bold mb-3 sticky top-0 bg-white z-10 py-2">
              Resultados ({filtered.length})
            </h2>

            <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
              {filtered.length === 0 ? (
                <p className="text-sm opacity-70">
                  No se encontraron inscripciones.
                </p>
              ) : (
                filtered.map((i) => (
                  <div
                    key={i.IdInscripcion}
                    onClick={() => setSeleccionada(i)}
                    className={`cursor-pointer p-4 rounded-box border-l-4 transition-all shadow hover:shadow-md ${getColor(
                      i.Estado
                    )} ${
                      seleccionada?.IdInscripcion === i.IdInscripcion
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-base-100"
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
                      Fecha:{" "}
                      {new Date(i.FechaInscripcion).toLocaleDateString()}
                    </p>
                    <span className="text-xs font-medium">{i.Estado}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 📊 Panel de detalle */}
          <div className="md:col-span-2" ref={dashboardRef}>
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