import { useState } from "react";
import { Link } from "react-router-dom";
import SolicitudDashboard from "../components/SolicitudDashboard.jsx";

const solicitudes = [
  { id: 1, codigo: "Solicitud #0001", nombre: "Juan Pérez", fecha: "2025-09-25", estado: "Pendiente", dni: "40.123.456", nacimiento: "2005-03-10", docs: ["DNI.pdf", "Boletín.pdf"], email: "juanperez05@gmail.com" },
  { id: 2, codigo: "Solicitud #0002", nombre: "María Gómez", fecha: "2025-09-20", estado: "Aprobada", dni: "39.111.222", nacimiento: "2004-07-22", docs: ["DNI.pdf"] },
  { id: 3, codigo: "Solicitud #0003", nombre: "Lorena Garcia", fecha: "2025-09-27", estado: "Rechazada", dni: "50.076.123", nacimiento: "2006-10-11", docs: ["DNI.pdf"] },
];

export default function Solicitudes() {
  const [seleccionada, setSeleccionada] = useState(null);
  const [search, setSearch] = useState("");

  // Filtrado por código, nombre o DNI
  const filteredSolicitudes = solicitudes.filter((s) =>
    s.codigo.toLowerCase().includes(search.toLowerCase()) ||
    s.nombre.toLowerCase().includes(search.toLowerCase()) ||
    s.dni.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <Link to="/">
        <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Volver al Inicio
        </button>
      </Link>
      
      <h1 className="text-2xl font-bold mb-4">Solicitudes de Inscripción</h1>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar solicitud..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 mb-6 w-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Listado filtrado */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-2">Resultados</h2>
          {filteredSolicitudes.map((s) => (
            <div
              key={s.id}
              className={`cursor-pointer p-4 mb-3 shadow rounded border-l-4 ${
                s.estado === "Pendiente"
                  ? "bg-yellow-50 border-yellow-400"
                  : s.estado === "Aprobada"
                  ? "bg-green-50 border-green-400"
                  : "bg-red-50 border-red-400"
              }`}
              onClick={() => setSeleccionada(s)}
            >
              <h3 className="font-semibold">{s.codigo}</h3>
              <p>{s.nombre}</p>
              <p>DNI: {s.dni}</p>
              <span className="text-sm">{s.estado}</span>
            </div>
          ))}
        </div>

        {/* Dashboard de la solicitud seleccionada */}
        <div className="md:col-span-2">
          <SolicitudDashboard solicitud={seleccionada} />
        </div>
      </div>
    </div>
  );
}
