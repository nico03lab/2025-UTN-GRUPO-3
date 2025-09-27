export default function SolicitudDashboard({ solicitud }) {
  if (!solicitud) {
    return (
      <div className="p-6 border rounded-lg shadow text-gray-500 bg-gray-50">
        Seleccioná una solicitud para ver el detalle.
      </div>
    );
  }

  return (
    <div
      className={`p-6 border-l-4 rounded-lg shadow bg-white ${
        solicitud.estado === "Pendiente"
          ? "border-yellow-400"
          : solicitud.estado === "Aprobada"
          ? "border-green-400"
          : "border-red-400"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Detalle de la Solicitud</h2>
      <h3 className="mb-2 text-gray-600">Los incisos con * son obligatorios</h3>

      <div className="grid grid-cols-2 gap-4">
        
        <div>
          <p><strong>*Nombre:</strong> {solicitud.nombre}</p>
          <p><strong>*DNI:</strong> {solicitud.dni}</p>
          <p><strong>*Email:</strong> {solicitud.email || "No informado"}</p>
          <p><strong>*Fecha de nacimiento:</strong> {solicitud.nacimiento}</p>
        </div>

        <div>
          <p>
            <strong>Estado:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-sm ${
                solicitud.estado === "Pendiente"
                  ? "bg-yellow-100 text-yellow-800"
                  : solicitud.estado === "Aprobada"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {solicitud.estado}
            </span>
          </p>
          <p>
            <strong>Fecha de solicitud:</strong> {solicitud.fecha}
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Documentos</h3>
      <ul className="list-disc ml-5">
        {solicitud.docs.map((doc, index) => (
          <li key={index} className="text-blue-500 underline cursor-pointer">
            {doc}
          </li>
        ))}
      </ul>

      {/* Mostrar botones solo si está pendiente */}
      {solicitud.estado === "Pendiente" && (
        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Aprobar
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Rechazar
          </button>
        </div>
      )}
    </div>
  );
}
