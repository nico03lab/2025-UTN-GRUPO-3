import React, { useEffect, useState } from "react";
import axios from "axios";

// Componentes comunes
import UserHeader from "../components/UserHeader";
import StatsPanel from "../components/Statspanel";
import Solicitudes from "../pages/solicitudes";
import directivoService from "../services/DirectivoService";
import { useAuth } from "../context/AuthContext";

// Tabs
import InscriptionsTab from "../components/InscriptionTab";
import TransferTab from "../components/StudentTransferTab";
import AdminCourseSidebar from "../components/AdminCourseSidebar";
import AdminCourseList from "../components/AdminCourseList";
import AdminAttendanceTab from "./AdminAttendanceTab";
import ReportsTab from "../components/ReportsTab";
import AlumnosManage from "./AlumnosManage";
import DocentesManage from "./DocentesManage";
import { Notebook, Users, SquareUserRound, FileUser } from "lucide-react";

export default function DirectivoDashboard() {
  const { user, ready, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const API_BASE_URL = "http://localhost:3002/api";

  // ✅ Cargar directivo solo cuando el usuario esté disponible y autenticado
  useEffect(() => {
    if (!ready) return; // Esperar a que AuthContext se inicialice
    if (!user?.userId) {
      console.warn("⚠️ No hay userId disponible aún");
      return;
    }

    const cargarDirectivo = async () => {
      try {
        const dir = await directivoService.getDirectivo(user.userId);
        const data = dir?.data || dir;

        if (!data) {
          console.warn("⚠️ No se recibieron datos del directivo");
          return;
        }

        setUserData({
          dni: data.DNIDirectivo,
          name: `${data.Nombre} ${data.Apellido}`,
          email: data.Email,
          userId: data.IdUsuario,
        });

      } catch (err) {
        console.error("❌ Error cargando datos del directivo:", err);
      } finally {
        setUserLoaded(true);
      }
    };

    cargarDirectivo();
  }, [ready, user?.userId]);

  // ==============================
  // 📊 Estados globales
  // ==============================
  const [notifications] = useState(5);
  const [tab, setTab] = useState("");

  // ==============================
  // 📚 Datos
  // ==============================
  const [mainTab, setMainTab] = useState("cursos");
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [filters, setFilters] = useState({
    nivel: "",
    turno: "",
    grado: "",
  });

  // ==============================
  // 📡 CARGA DE CURSOS
  // ==============================
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/cursos`) 
      .then((res) => {
        setCursos(res.data);
      })
      .catch((err) => console.error("❌ Error al obtener cursos:", err));
  }, []);

  // ==============================
  // ⚙️ ACCIONES CRUD
  // ==============================
  const approveInscription = (id) => {
    axios
      .put(`${API_BASE_URL}/inscripciones/${id}/aprobar`)
      .then(() => {
        setInscripciones((prev) => prev.filter((i) => i.id !== id));
        showToast("Inscripción aprobada correctamente", "success");
      })
      .catch(() => showToast("Error al aprobar inscripción", "error"));
  };

  // ==============================
  // 💬 UTILIDADES
  // ==============================
  const showToast = (msg, type = "info") => {
    const toast = document.getElementById("toast");
    const msgEl = document.getElementById("toast-message");
    toast.className = `toast toast-top toast-end alert alert-${type}`;
    msgEl.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  };

  const updateFilter = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  const stats = {
    totalAlumnos: alumnos.length,
    totalCursos: cursos.length,
    inscripcionesPendientes: inscripciones.length,
    asistenciaPromedio: 94.5,
    promedioGeneral: 8.2,
  };

  // ==============================
  // 🧩 RENDER
  // ==============================
  if (!ready) return <div>Cargando autenticación...</div>;
  if (!userLoaded) return <div>Cargando datos del directivo...</div>;

  return (
    <div className="min-h-screen bg-base-200">
      <div id="toast" className="toast toast-top toast-end hidden">
        <div className="alert">
          <span id="toast-message">Operación realizada con éxito.</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <UserHeader
          user={userData}
          onLogout={logout}
          userRole="Directivo"
          fieldsConfig={DirectivoField}
          apiEndpoint="directivos/configuracion"
        />

        {/* Tabs principales */}
        <div
          role="tablist"
          className="tabs tabs-boxed my-6 flex-col sm:flex-row gap-2"
        >
          <button
            role="tab"
            className={`tab text-sm font-semibold flex-1 ${
              mainTab === "cursos"
                ? "bg-primary text-primary-content"
                : "hover:bg-base-300"
            }`}
            onClick={() => setMainTab("cursos")}
          >
            <Notebook size={15} className="mr-1" />
            <span className="hidden sm:inline">Gestión de </span>Cursos
          </button>
          <button
            role="tab"
            className={`tab text-sm font-semibold flex-1 ${
              mainTab === "alumnos"
                ? "bg-primary text-primary-content"
                : "hover:bg-base-300"
            }`}
            onClick={() => setMainTab("alumnos")}
          >
            <Users size={15} className="mr-1" />
            <span className="hidden sm:inline">Gestión de </span>Alumnos
          </button>
          <button
            role="tab"
            className={`tab text-sm font-semibold flex-1 ${
              mainTab === "docentes"
                ? "bg-primary text-primary-content"
                : "hover:bg-base-300"
            }`}
            onClick={() => setMainTab("docentes")}
          >
            <SquareUserRound size={15} className="mr-1" />
            <span className="hidden sm:inline">Gestión de </span>Docentes
          </button>
          <button
            role="tab"
            className={`tab text-sm font-semibold flex-1 ${
              mainTab === "inscripciones"
                ? "bg-primary text-primary-content"
                : "hover:bg-base-300"
            }`}
            onClick={() => setMainTab("inscripciones")}
          >
            <FileUser size={15} className="mr-1" />
            <span className="hidden sm:inline">Gestión de </span>Inscripciones
          </button>
        </div>

        {/* Contenido por pestaña */}
        {mainTab === "cursos" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <AdminCourseSidebar
                cursos={cursos}
                selectedCurso={selectedCurso}
                setSelectedCurso={setSelectedCurso}
                tab={tab}
                setTab={setTab}
                filters={filters}
                setFilters={setFilters}
              />
              <StatsPanel stats={stats} />
            </aside>

            <main className="lg:col-span-3 flex flex-col gap-4">
              <AdminCourseList
                cursos={cursos}
                filtros={filters}
                selectedCurso={selectedCurso}
                setSelectedCurso={setSelectedCurso}
              />

              <div className="bg-base-100 p-4 md:p-6 rounded-box shadow min-h-[300px]">
                {tab === "solicitudes" && <Solicitudes />}
                {tab === "attendance" && selectedCurso && (
                  <AdminAttendanceTab
                    asistencias={asistencias}
                    curso={selectedCurso}
                    onFilterChange={updateFilter}
                  />
                )}
                {tab === "reports" && <ReportsTab />}
              </div>
            </main>
          </div>
        )}

        {mainTab === "alumnos" && (
          <div className="bg-base-100 p-4 rounded-box shadow">
            <AlumnosManage />
          </div>
        )}

        {mainTab === "docentes" && (
          <div className="bg-base-100 p-4 rounded-box shadow">
            <DocentesManage />
          </div>
        )}

        {mainTab === "inscripciones" && (
          <div className="bg-base-100 rounded-box shadow">
            <Solicitudes />
          </div>
        )}

        <div className="mt-6 bg-base-100 p-4 rounded-box shadow text-center text-sm opacity-70">
          Sistema de Gestión Escolar • {new Date().getFullYear()} • Cole App
        </div>
      </div>
    </div>
  );
}

// Config de campos
export const DirectivoField = [
  {
    section: "Datos Personales",
    fields: [
      {
        name: "DNIDirectivo",
        label: "DNI",
        type: "text",
        required: true,
        placeholder: "Ej: 12345678",
        disabled: true,
      },
      { name: "Cargo", label: "Cargo", type: "text", placeholder: "Ej: Director" },
      { name: "Nombre", label: "Nombre", type: "text", placeholder: "Ej: Juan" },
      { name: "Apellido", label: "Apellido", type: "text", placeholder: "Ej: Pérez" },
      { name: "Email", label: "Email", type: "email", placeholder: "tutor@email.com" },
      { name: "TelefonoCel", label: "Teléfono Celular", type: "tel" },
      { name: "TelefonoLinea", label: "Teléfono Línea", type: "tel" },
    ],
  },
  {
    section: "Dirección",
    fields: [
      { name: "Calle", label: "Calle", type: "text", placeholder: "Ej: Calle 50" },
      { name: "Numero", label: "Número", type: "text", placeholder: "Ej: 123" },
      {
        name: "IdLocalidad",
        label: "Provincia y Localidad",
        type: "localidad",
        className: "md:col-span-2",
      },
    ],
  },
  {
    section: "Usuario",
    fields: [
      { name: "NombreUsuario", label: "Usuario", type: "text" },
      { name: "Pass", label: "Contraseña", type: "text" },
    ],
  },
];
