import { useEffect, useState } from "react";
import axios from "axios";

export default function SolicitudDashboard({ solicitud }) {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Cargar documentos cuando cambia la solicitud seleccionada
  useEffect(() => {
    if (!solicitud?.IdInscripcion) return;

    setLoading(true);
    axios
      .get(`http://localhost:3002/api/documentos/${solicitud.IdInscripcion}`)
      .then((res) => {
        setDocumentos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error al obtener documentos:", err);
        setDocumentos([]);
        setLoading(false);
      });
  }, [solicitud]);

  if (!solicitud) {
    return (
      <div className="p-6 border rounded-lg shadow text-gray-500 bg-gray-50">
        Seleccioná una solicitud para ver el detalle.
      </div>
    );
  }

  const estado = solicitud.Estado || solicitud.estado || "pendiente";

  return (
    <div
      className={`p-6 border-l-4 rounded-lg shadow bg-white ${
        estado === "pendiente"
          ? "border-yellow-400"
          : estado === "aprobada"
          ? "border-green-400"
          : "border-red-400"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Detalle de la Solicitud</h2>

      {/* 🧩 Información general */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>
            <strong>*Apellido y Nombres:</strong> {solicitud.Apellido} {solicitud.Nombres}
          </p>
          <p>
            <strong>*DNI:</strong> {solicitud.DNIAlumno}
          </p>
          <p>
            <strong>*Nivel:</strong> {solicitud.Nivel}
          </p>
          <p>
            <strong>*Grado:</strong> {solicitud.Grado}°
          </p>
          <p>
            <strong>*Turno:</strong> {solicitud.Turno}
          </p>
        </div>

        <div>
          <p>
            <strong>Estado:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-sm ${
                estado === "pendiente"
                  ? "bg-yellow-100 text-yellow-800"
                  : estado === "aprobada"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {estado}
            </span>
          </p>
          <p>
            <strong>Fecha de inscripción:</strong>{" "}
            {new Date(solicitud.FechaInscripcion).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 📂 Documentos asociados */}
      <h3 className="text-lg font-semibold mt-6 mb-2">📎 Documentos</h3>

      {loading ? (
        <p className="text-sm opacity-70">Cargando documentos...</p>
      ) : documentos.length > 0 ? (
        <ul className="list-disc ml-6 text-sm space-y-1">
          {documentos.map((doc) => (
            <li key={doc.IdDocumento}>
              <a
                href={`http://localhost:3002/${doc.RutaArchivo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {doc.Descripcion || doc.NombreArchivo}
              </a>{" "}
              <span className="opacity-60 text-xs">
                ({doc.TipoMime.split("/")[1].toUpperCase()} •{" "}
                {new Date(doc.FechaSubida).toLocaleDateString()})
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm opacity-70">No hay documentos asociados.</p>
      )}

      {/* 🟢 Botones de acción */}
      {estado.toLowerCase() === "pendiente" && (
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
