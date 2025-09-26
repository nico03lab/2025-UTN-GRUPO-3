import { useState } from "react";
import SolicitudDashboard from "../components/SolicitudDashboard.jsx";

const solicitudes = [
  { id: 1, nombre: "Juan Pérez", fecha: "2025-09-25", estado: "Pendiente", dni: "40123456", nacimiento: "2005-03-10", docs: ["DNI.pdf", "Boletín.pdf"] },
  { id: 2, nombre: "María Gómez", fecha: "2025-09-20", estado: "Revisada", dni: "39111222", nacimiento: "2004-07-22", docs: ["DNI.pdf"] },
];

export default function Solicitudes() {
  const [seleccionada, setSeleccionada] = useState(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Solicitudes de Inscripción</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Lista de solicitudes */}
        <div className="col-span-1 space-y-2">
          {solicitudes.map((s) => (
            <div
              key={s.id}
              className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100"
              onClick={() => setSeleccionada(s)}
            >
              <p className="font-semibold">{s.nombre}</p>
              <p className="text-sm text-gray-600">Estado: {s.estado}</p>
            </div>
          ))}
        </div>

        {/* Dashboard de la solicitud */}
        <div className="col-span-2">
          <SolicitudDashboard solicitud={seleccionada} />
        </div>
      </div>
    </div>
  );
}
