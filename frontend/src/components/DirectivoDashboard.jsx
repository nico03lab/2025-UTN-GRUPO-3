import React, { useState } from "react";
import { BellIcon, CogIcon, MoonIcon, SunIcon, XCircleIcon } from "@heroicons/react/24/outline";

// UserHeader con Tailwind
const UserHeader = ({ user, notifications = 0, toggleTheme, theme = 'light', onLogout, onSettings }) => {
  return (
    <header className="flex items-center justify-between mb-6 bg-base-100 p-4 rounded-box shadow">
      {/* Avatar y nombre */}
      <div className="flex items-center gap-4">
        <div className="avatar online">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-lg font-semibold">
            {user.nombre.charAt(0)}
          </div>
        </div>
        <div>
          <div className="text-lg font-semibold">{user.nombre}</div>
          <div className="text-sm opacity-70">{user.email}</div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        {/* Notificaciones */}
        <div className="dropdown dropdown-end">
          <button type="button" className="btn btn-ghost btn-circle" aria-label="Notificaciones">
            <div className="indicator">
              <BellIcon className="h-5 w-5" />
              {notifications > 0 && (
                <span className="badge badge-xs badge-primary indicator-item">{notifications}</span>
              )}
            </div>
          </button>
          <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
            <div className="card-body">
              <span className="font-bold text-lg">{notifications} Notificaciones</span>
              <span className="text-info">Tienes mensajes sin leer</span>
            </div>
          </div>
        </div>

        {/* Toggle tema */}
        <button type="button" className="btn btn-ghost btn-circle" onClick={toggleTheme} aria-label="Cambiar tema">
          {theme === "light" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
        </button>

        {/* Configuración */}
        <button type="button" className="btn btn-ghost btn-circle" onClick={onSettings} aria-label="Configuración">
          <CogIcon className="h-6 w-6" />
        </button>

        {/* Cerrar sesión */}
        <button type="button" className="btn btn-outline btn-sm flex items-center gap-2" onClick={onLogout}>
          <XCircleIcon className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

// DashboardDirectivo integrado
const DashboardDirectivo = () => {
  const directivo = {
    nombre: "Jorge Perez",
    email: "jorge.perez91218@gmail.com",
    fotoUrl: "", 
  };

  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(3);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const handleClick = (tipo) => alert(`Mostrando: ${tipo}`);
  const handleLogout = () => alert("Cerrando sesión...");
  const handleSettings = () => alert("Abrir configuración...");

  return (
    <div
      className={`min-h-screen w-full ${theme === "light" ? "bg-gray-100" : "bg-gray-800"} relative`}
      style={{
        backgroundImage: "url()",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* UserHeader arriba */}
      <div className="absolute top-5 left-5 right-5">
        <UserHeader
          user={directivo}
          notifications={notifications}
          toggleTheme={toggleTheme}
          theme={theme}
          onLogout={handleLogout}
          onSettings={handleSettings}
        />
      </div>

      {/* Menú en el centro */}
      <div className="flex justify-center items-center h-full">
        <nav>
          <ul className="space-y-5 list-none p-0 m-0">
            {[
              "Alumnos 👦👧",
              "Listado de solicitudes de inscripción pendientes 📅",
              "Solicitudes de inscripción aprobadas ✅",
              "Solicitudes de inscripción rechazadas ❌",
            ].map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleClick(item)}
                  className="w-72 px-5 py-3 text-left bg-beige text-black rounded-lg shadow-md transition-transform duration-300 hover:bg-white hover:scale-105"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DashboardDirectivo;
