import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import RoleSlider from "../components/RoleSlider";

export default function Login() {
  const { login } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [rol, setRol] = useState("Docente");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(nombreUsuario, pass);
      // Redirigir según tipo
      const tipo = user.Tipo || user.tipo;
      const routes = {
        docente: "/docente",
        padre: "/tutores",
        estudiante: "/alumnos",
        directivo: "/directivos",
      };
      window.location.href = routes[tipo] || "/";
    } catch (err) {
      setError(err?.response?.data?.error || "Error de autenticación");
    }
  };

  const handleInscripciones = () => {
    window.location.href = "/inscripcion";
  }; 

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-base-200">
      {/* Panel Izquierdo (slider) */}
      <div className="flex-1 flex items-center justify-center p-10">
        <RoleSlider selected={rol} setSelected={setRol} />
      </div>

      {/* Panel Derecho (formulario) */}
      <div className="flex-1 flex items-center justify-center p-10 bg-base-100">
        <div className="w-full max-w-sm">
          {/* Logo y título de la app */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">ColeApp 2025</h1>
            <p className="text-gray-600">Sistema de Gestión Educativa</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-center text-gray-800">Ingreso al Sistema</h2>
            {error && <div className="alert alert-error">{error}</div>}

            <input
              type="text"
              className="input input-bordered w-full focus:input-primary"
              placeholder="Usuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
            <input
              type="password"
              className="input input-bordered w-full focus:input-primary"
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />

            <button className="btn btn-primary w-full mt-4 hover:btn-secondary transition-all duration-300">
              Entrar como {rol}
            </button>

            <div className="divider text-xs text-gray-400">o</div>

            {/* Botón de inscripciones */}
            <button
              type="button"
              onClick={handleInscripciones}
              className="btn btn-outline btn-accent w-full hover:btn-accent hover:text-white transition-all duration-300"
            >
              📝 Nuevas Inscripciones
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Seleccioná tu rol en el panel lateral.
            </p>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-400">
              © 2025 ColeApp - Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}