import { useEffect, useState } from "react";
import axios from "axios";
import {
  BellIcon,
  CogIcon,
  MoonIcon,
  SunIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function UserHeader({
  user,
  toggleTheme,
  theme = "light",
  onLogout,
  onSettings,
}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:300/api/notificaciones/${user.idUsuario}`
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

  const unreadCount = notifications.filter((n) => !n.Leida).length;

  return (
    <header className="flex items-center justify-between mb-6 bg-base-100 p-4 rounded-box shadow">
      {/* Avatar y nombre */}
      <div className="flex items-center gap-4">
        <div className="avatar online">
          <div className="w-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-lg font-semibold">
            {user.name?.charAt(0)}
          </div>
        </div>
        <div>
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-sm opacity-70">{user.email}</div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        <div className="dropdown dropdown-end">
          <button
            type="button"
            className="btn btn-ghost btn-circle"
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

          <div
            tabIndex={0}
            className="mt-3 z-[1] card card-compact dropdown-content w-64 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg">Notificaciones</span>
              {loading && (
                <span className="text-sm text-gray-400">Cargando...</span>
              )}
              {!loading && notifications.length === 0 && (
                <span className="text-sm text-gray-400">
                  No tienes notificaciones
                </span>
              )}
              {!loading &&
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.IdNotificacion}
                    className={`p-2 rounded-md text-sm ${
                      n.Leida ? "opacity-60" : "font-semibold"
                    }`}
                  >
                    <p>{n.Mensaje}</p>
                    <p className="text-xs opacity-70">
                      {new Date(n.Fecha).toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-circle"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <MoonIcon className="h-5 w-5" />
          ) : (
            <SunIcon className="h-5 w-5" />
          )}
        </button>

        <button
          type="button"
          className="btn btn-ghost btn-circle"
          onClick={onSettings}
        >
          <CogIcon className="h-6 w-6" />
        </button>

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
