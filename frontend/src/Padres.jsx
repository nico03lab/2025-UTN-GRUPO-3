import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { BellIcon, CogIcon, MoonIcon, SunIcon, XCircleIcon } from '@heroicons/react/24/outline';

// ✅ Nuevo Header (UserHeader)
function UserHeader({ user, notifications = 0, toggleTheme, theme = 'light', onLogout, onSettings }) {
  return (
    <header className="flex items-center justify-between mb-6 bg-base-100 p-4 rounded-box shadow w-full">
      {/* Avatar y nombre */}
      <div className="flex items-center gap-4">
        <div className="avatar online">
          <div className="w-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-lg font-semibold">
            {user.name.charAt(0)}
          </div>
        </div>
        <div>
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-sm opacity-70">{user.email}</div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <BellIcon className="h-5 w-5" />
            {notifications > 0 && (
              <span className="badge badge-xs badge-primary indicator-item">{notifications}</span>
            )}
          </div>
        </button>

        <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
          {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
        </button>

        <button className="btn btn-ghost btn-circle" onClick={onSettings}>
          <CogIcon className="h-6 w-6" />
        </button>

        <button className="btn btn-outline btn-sm flex items-center gap-2" onClick={onLogout}>
          <XCircleIcon className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

// ✅ Menú principal
const Menu = () => (
  <div className="flex flex-col items-center justify-start mt-20 space-y-6">
    <Link to="/horario" className="w-64 px-6 py-3 bg-blue-100 text-blue-800 rounded-lg shadow-md text-lg font-medium text-center hover:bg-blue-200 transition">
      ⏰ Horario Escolar
    </Link>
    <Link to="/materias" className="w-64 px-6 py-3 bg-blue-100 text-blue-800 rounded-lg shadow-md text-lg font-medium text-center hover:bg-blue-200 transition">
      📚 Ver Materias
    </Link>
  </div>
);

// ✅ Página Horario Escolar
const Horario = () => {
  const horas = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"];
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const materias = [
    ["Matemáticas", "Lengua", "Historia", "Inglés", "Ciencias"],
    ["Educación Física", "Matemáticas", "Lengua", "Arte", "Historia"],
    ["Ciencias", "Inglés", "Matemáticas", "Lengua", "Educación Física"],
    ["Arte", "Historia", "Ciencias", "Matemáticas", "Inglés"],
  ];

  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4">
      <h2 className="text-2xl font-semibold mb-6">⏰ Horario Escolar</h2>
      <table className="table-auto border border-gray-400 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-300 text-gray-700">
            <th className="border border-gray-400 px-4 py-2">Hora</th>
            {dias.map((dia, i) => (
              <th key={i} className="border border-gray-400 px-4 py-2">{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horas.map((hora, i) => (
            <tr key={i} className="even:bg-blue-50">
              <td className="border border-gray-400 px-4 py-2 font-semibold">{hora}</td>
              {materias[i].map((materia, j) => (
                <td key={j} className="border border-gray-400 px-4 py-2 text-center">{materia}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ✅ Página Materias
const Materias = () => {
  const listaMaterias = ["Matemáticas", "Lengua", "Historia", "Inglés", "Ciencias", "Arte", "Educación Física"];
  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4">
      <h2 className="text-2xl font-semibold mb-6">📚 Materias</h2>
      <ul className="list-disc list-inside space-y-2 text-lg">
        {listaMaterias.map((materia, index) => (
          <li key={index} className="px-4 py-2 bg-blue-100 rounded-lg w-64 text-center">{materia}</li>
        ))}
      </ul>
    </div>
  );
};

// ✅ Página principal fusionada
const Home = () => {
  const [theme, setTheme] = useState('light');
  const padre = { name: "Carlos Gómez", email: "carlos.gomez@gmail.com" };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <UserHeader 
        user={padre} 
        notifications={3} 
        theme={theme} 
        toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
        onLogout={() => alert("Cerrar sesión")} 
        onSettings={() => alert("Abrir configuración")} 
      />
      <Menu />
    </div>
  );
};

// ✅ App con Router
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/horario" element={<Horario />} />
        <Route path="/materias" element={<Materias />} />
      </Routes>
    </Router>
  );
}
