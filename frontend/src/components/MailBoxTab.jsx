import { useState } from "react";
import {
  Inbox,
  Send,
  Trash2,
  FileEdit,
  Mail,
  Reply,
  Forward,
  Plus,
} from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";

export default function MailboxTab() {
  const userId = 1;
  const [tab, setTab] = useState("inbox");
  const [selected, setSelected] = useState(null);
  const [composeMode, setComposeMode] = useState(false);

  // Mensajes simulados
  const [mensajes, setMensajes] = useState([
    {
      IdMensaje: 1,
      Emisor: 99,
      Receptor: userId,
      Contenido: "Bienvenido al sistema 👋",
      Asunto: "Bienvenida",
      FechaEnvio: new Date(),
      Leido: false,
    },
    {
      IdMensaje: 2,
      Emisor: 100,
      Receptor: userId,
      Contenido: "Tienes examen el lunes a las 9hs",
      Asunto: "Aviso importante",
      FechaEnvio: new Date(Date.now() - 1000 * 60 * 60),
      Leido: true,
    },
    {
      IdMensaje: 3,
      Emisor: userId,
      Receptor: 200,
      Contenido: "Hola profe, tengo una consulta sobre la tarea.",
      Asunto: "Consulta tarea",
      FechaEnvio: new Date(Date.now() - 1000 * 60 * 60 * 24),
      Leido: true,
    },
  ]);

  // Filtrar según pestaña
  const mensajesFiltrados = mensajes.filter((msg) =>
    tab === "inbox" ? msg.Receptor === userId : msg.Emisor === userId
  );

  // Acciones
  const marcarLeido = (id) =>
    setMensajes((prev) =>
      prev.map((m) => (m.IdMensaje === id ? { ...m, Leido: true } : m))
    );

  const eliminarMensaje = (id) =>
    setMensajes((prev) => prev.filter((m) => m.IdMensaje !== id));

  const redactarNuevo = () => {
    setComposeMode(true);
    setSelected(null);
  };

  return (
    <div className="flex h-[600px] rounded-xl shadow bg-base-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-base-200 p-4 flex flex-col gap-4">
        <button
          className="btn btn-primary w-full flex items-center gap-2"
          onClick={redactarNuevo}
        >
          <Plus size={18} /> Nuevo
        </button>

        <nav className="flex flex-col gap-2">
          <button
            className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
              tab === "inbox" ? "bg-primary text-white" : "hover:bg-base-300"
            }`}
            onClick={() => setTab("inbox")}
          >
            <Inbox size={18} /> Inbox
          </button>
          <button
            className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
              tab === "sent" ? "bg-primary text-white" : "hover:bg-base-300"
            }`}
            onClick={() => setTab("sent")}
          >
            <Send size={18} /> Enviados
          </button>
          <button
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-base-300"
            onClick={() => setTab("trash")}
          >
            <Trash2 size={18} /> Papelera
          </button>
        </nav>
      </div>

      {/* Lista de mensajes */}
      <div className="w-80 border-r overflow-y-auto">
        {mensajesFiltrados.length === 0 ? (
          <div className="p-4 text-center opacity-70">No hay mensajes</div>
        ) : (
          mensajesFiltrados.map((msg) => (
            <div
              key={msg.IdMensaje}
              className={`p-3 border-b cursor-pointer hover:bg-base-200 ${
                !msg.Leido ? "bg-yellow-50" : ""
              } ${selected?.IdMensaje === msg.IdMensaje ? "bg-primary/20" : ""}`}
              onClick={() => {
                setSelected(msg);
                marcarLeido(msg.IdMensaje);
                setComposeMode(false);
              }}
            >
              <div className="font-semibold truncate">{msg.Asunto}</div>
              <div className="text-sm opacity-80 truncate">{msg.Contenido}</div>
              <div className="text-xs opacity-60">
                {msg.FechaEnvio.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Panel de lectura / redacción */}
      <div className="flex-1 p-4">
        {!selected && !composeMode && (
          <div className="h-full flex items-center justify-center opacity-60">
            Selecciona un mensaje o redacta uno nuevo
          </div>
        )}

        {/* Vista de mensaje */}
        {selected && !composeMode && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{selected.Asunto}</h2>
            <p className="text-sm opacity-70">
              {tab === "inbox"
                ? `De: Usuario ${selected.Emisor}`
                : `Para: Usuario ${selected.Receptor}`}
            </p>
            <div className="p-3 bg-base-200 rounded-lg">{selected.Contenido}</div>
            <div className="flex gap-2">
              <Tippy content="Responder" theme="light-border">
                <button className="btn btn-sm">
                  <Reply size={16} />
                </button>
              </Tippy>
              <Tippy content="Reenviar" theme="light-border">
                <button className="btn btn-sm">
                  <Forward size={16} />
                </button>
              </Tippy>
              <Tippy content="Eliminar" theme="light-border">
                <button
                  className="btn btn-sm text-error"
                  onClick={() => eliminarMensaje(selected.IdMensaje)}
                >
                  <Trash2 size={16} />
                </button>
              </Tippy>
            </div>
          </div>
        )}

        {/* Redacción */}
        {composeMode && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileEdit size={20} /> Redactar mensaje
            </h2>
            <input
              type="text"
              placeholder="Para..."
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Asunto..."
              className="input input-bordered w-full"
            />
            <textarea
              placeholder="Escribe tu mensaje..."
              className="textarea textarea-bordered w-full h-40"
            />
            <div className="flex gap-2">
              <button className="btn btn-primary">Enviar</button>
              <button
                className="btn"
                onClick={() => setComposeMode(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
