import { useEffect, useState } from "react";
import axios from "axios";

export default function SolicitudDashboard({ solicitud }) {
  console.log("🧾 Solicitud recibida:", solicitud);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarAsignacion, setMostrarAsignacion] = useState(false); // 👈 nuevo estado
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");

  // 🧠 Cargar documentos
  useEffect(() => {
    if (!solicitud?.IdInscripcion) return;

    const fetchDocumentos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3002/api/documentos/${solicitud.IdInscripcion}`
        );
        setDocumentos(res.data);
      } catch (err) {
        console.error("❌ Error al obtener documentos:", err);
        setDocumentos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentos();
  }, [solicitud]);

  // 🧩 Cargar lista de cursos disponibles
  useEffect(() => {
    if (mostrarAsignacion) {
      axios
        .get("http://localhost:3002/api/cursos")
        .then((res) => setCursos(res.data))
        .catch((err) => {
          console.error("❌ Error al obtener cursos:", err);
          setCursos([]);
        });
    }
  }, [mostrarAsignacion]);

  const estado = solicitud.Estado;

  const handleUpdateEstado = async (nuevoEstado) => {
    try {
      const confirm = window.confirm(
        `¿Seguro que deseas marcar esta solicitud como "${nuevoEstado}"?`
      );
      if (!confirm) return;

      await axios.put(
        `http://localhost:3002/api/inscripcion/${solicitud.IdInscripcion}/estado`,
        { estado: nuevoEstado }
      );

      alert(`✅ Estado actualizado a "${nuevoEstado}"`);

      solicitud.Estado = nuevoEstado;

      // 🧠 Si fue aprobada, abrir modal de asignación
      if (nuevoEstado === "aprobada") {
        setMostrarAsignacion(true);
      }
    } catch (err) {
      console.error("❌ Error al actualizar estado:", err);
      alert("Error al actualizar el estado. Ver consola.");
    }
  };

  const handleAsignarCurso = async () => {
    if (!cursoSeleccionado) {
      alert("Por favor seleccioná un curso.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3002/api/alumnos/${solicitud.DNIAlumno}/curso`,
        {
          idCurso: cursoSeleccionado
        }
      );

      alert("✅ Alumno asignado correctamente al curso y activado.");
      setMostrarAsignacion(false);
    } catch (err) {
      console.error("❌ Error al asignar curso:", err);
      alert("Error al asignar curso. Ver consola.");
    }
  };

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
            <strong>*Apellido y Nombres:</strong> {solicitud.Apellido}{" "}
            {solicitud.Nombres}
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
          <p>
            <strong>*Especialidad:</strong> {solicitud.NombreEspecialidad}
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

      {/* 📂 Documentos */}
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
                ({doc.TipoMime?.split("/")[1]?.toUpperCase() || "?"} •{" "}
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
          <button
            className="btn btn-success"
            onClick={() => handleUpdateEstado("aprobada")}
          >
            ✅ Aprobar
          </button>
          <button
            className="btn btn-error"
            onClick={() => handleUpdateEstado("rechazada")}
          >
            ❌ Rechazar
          </button>
        </div>
      )}

      {/* 🧩 Modal de Asignación */}
      {mostrarAsignacion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
            <h3 className="text-lg font-semibold mb-4">
              Asignar curso al alumno
            </h3>

            {cursos.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay cursos disponibles o aún se están cargando.
              </p>
            ) : (
              <select
                className="select select-bordered w-full mb-4"
                value={cursoSeleccionado}
                onChange={(e) => setCursoSeleccionado(e.target.value)}
              >
                <option value="">Seleccionar curso...</option>
                {cursos.map((c) => (
                  <option key={c.IdCurso} value={c.IdCurso}>
                    {c.Grado}° {c.Letra} - {c.Nivel} - ({c.Turno})
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end gap-3">
              <button
                className="btn btn-outline"
                onClick={() => setMostrarAsignacion(false)}
              >
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleAsignarCurso}>
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
