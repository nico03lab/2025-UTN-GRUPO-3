import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  BellIcon,
  CogIcon,
  XCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "./ThemeContext";
import ThemeToggle from "./ThemeToggle";

export default function UserHeader({
  user,
  onLogout,
  onSettings,
}) {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Cargar notificaciones
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3002/api/notificaciones/${user.userId}`
        );
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error cargando notificaciones:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Marcar como leída

  const marcarLeida = async (idNotificacion) => {
    try {
      // Llamada al backend
      await axios.put(
        `http://localhost:3002/api/notificaciones/${idNotificacion}/leida/${user.userId}`
      );

      // Actualizar estado local (para feedback inmediato)
      setNotifications((prev) =>
        prev.map((n) =>
          n.IdNotificacion === idNotificacion ? { ...n, Leida: 1 } : n
        )
      );
    } catch (err) {
      console.error("Error marcando notificación como leída:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.Leida).length;

  return (
    <header className="flex items-center justify-between mb-6 bg-base-100 p-4 rounded-box shadow-md transition-all duration-300">
      {/* Avatar y nombre */}
      <div className="flex items-center gap-4">
        <div className="avatar online">
          <div className="w-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-lg font-semibold shadow-md">
            {user.name?.charAt(0)}
          </div>
        </div>
        <div>
          <div className="text-lg font-bold">{user.name}</div>
          <div className="text-sm opacity-70">{user.mail}</div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2" ref={dropdownRef}>
        {/* Notificaciones */}
        <div className="relative">
          <button
            type="button"
            className="btn btn-ghost btn-circle"
            onClick={() => setOpenDropdown((prev) => !prev)}
            aria-label="Notificaciones"
          >
            <div className="indicator">
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="badge badge-xs badge-primary indicator-item">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-3 z-50 w-80 bg-base-200 shadow-2xl rounded-xl overflow-hidden border border-base-300 animate-fade-in">
              <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-300/30 backdrop-blur-sm">
                <span className="font-bold text-base text-primary">
                  Notificaciones
                </span>
                {loading && (
                  <span className="loading loading-spinner loading-xs text-primary"></span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-base-300">
                {notifications.length === 0 && !loading && (
                  <div className="text-center py-4 text-sm opacity-70">
                    No tienes notificaciones
                  </div>
                )}

                {notifications.map((n) => {
                  const isLeida = Boolean(n.Leida);
                  return (
                    <div
                      key={n.IdNotificacion}
                      onClick={() => marcarLeida(n.IdNotificacion)}
                      className={`group relative p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 border border-transparent shadow-sm flex justify-between items-start ${
                        isLeida
                          ? "bg-base-300 text-gray-500"
                          : "bg-primary/10 hover:bg-primary/20 border-primary/30 shadow-md"
                      }`}
                    >
                      <div className="flex-1 pr-2">
                        <p
                          className={`text-sm leading-snug ${
                            isLeida
                              ? "font-normal text-gray-600"
                              : theme === "light"
                              ? "font-semibold text-gray-900"
                              : "font-semibold text-white"
                          }`}
                        >
                          {n.Mensaje}
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                          {new Date(n.Fecha).toLocaleString("es-AR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        {/* Etiqueta “Leída” */}
                        {isLeida && (
                          <span className="absolute bottom-1 right-3 text-[10px] italic text-green-600 opacity-70">
                            Leída
                          </span>
                        )}
                      </div>

                      {/* Botón de tilde */}
                      {!isLeida && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            marcarLeida(n.IdNotificacion);
                          }}
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                          title="Marcar como leída"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <ThemeToggle />

        {/* Configuración */}
        <button
          type="button"
          className="btn btn-ghost btn-circle"
          onClick={onSettings}
        >
          <CogIcon className="h-6 w-6" />
        </button>

        {/* Logout */}
        <button
          type="button"
          className="btn btn-outline btn-sm flex items-center gap-2"
          onClick={onLogout}
        >
          <XCircleIcon className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
