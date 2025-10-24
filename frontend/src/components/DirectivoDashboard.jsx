import React, { useEffect, useState } from "react";
import axios from "axios";

// 🧩 Componentes comunes
import UserHeader from "../components/UserHeader";
import StatsPanel from "../components/Statspanel";
import Solicitudes from "../pages/solicitudes";

// 🧩 Tabs (cada uno modular)
import InscriptionsTab from "../components/InscriptionTab";
import TransferTab from "../components/StudentTransferTab";
import AdminCourseSidebar from "../components/AdminCourseSidebar";
import AdminCourseList from "../components/AdminCourseList"
import AdminAttendanceTab from "./AdminAttendanceTab";
import ReportsTab from "../components/ReportsTab";
import AlumnosManage from "./AlumnosManage";
import DocentesManage from "./DocentesManage";
import { Notebook, Users, SquareUserRound, FileUser } from 'lucide-react';

export default function DirectivoDashboard() {
  const [user] = useState({
    dni: "20111222",
    id: "admin-001",
    name: "Lic. Ana García",
    email: "a.garcia@colegio.edu",
    role: "Directora",
  });

  const API_BASE_URL = "http://localhost:3002/api";

  // 📊 Estados globales
  const [notifications] = useState(5);
  const [tab, setTab] = useState("");

  // 📚 Datos
    // Tabs principales: Cursos / Alumnos / Docentes / Inscripciones
  const [mainTab, setMainTab] = useState("cursos");
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosByCurso, setAlumnosByCurso] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [asistencias, setAsistencias] = useState([]);

  // 🎯 Filtros
  const [filters, setFilters] = useState({
    nivel: "",
    turno: "",
    grado: "",
  });


  // ==============================
  // 📡 CARGA DE DATOS
  // ==============================

  useEffect(() => {
    axios.get(`${API_BASE_URL}/cursos`)
      .then(res => {
        console.log("✅ Cursos obtenidos:", res.data);
        setCursos(res.data);
      })
      .catch(err => console.error("❌ Error al obtener cursos:", err));
  }, []);
/*
  useEffect(() => {
      if (selectedCurso) {
        axios.get(`${API_BASE_URL}/alumnos/${selectedCurso}`)
          .then(res => {
            const initAttendance = {};
            res.data.forEach(a => initAttendance[a.DNIAlumno] = false);
            setAttendance(initAttendance);
            setAlumnosByCurso(res.data);
          })
          .catch(err => console.error(err));
      } else {
        setAlumnosByCurso([]);
        setAttendance({});
      }
    }, [selectedCurso]);
*/
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
  return (
    <div className="min-h-screen bg-base-200">
      {/* Toast temporal (si lo usas) */}
      <div id="toast" className="toast toast-top toast-end hidden">
        <div className="alert">
          <span id="toast-message">Operación realizada con éxito.</span>
        </div>
      </div>

      {/* Header general */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <UserHeader
          user={user}
          notifications={notifications}
        />

        {/* ====================== */}
        {/* 🧭 Pestañas principales */}
        {/* ====================== */}
        <div role="tablist" className="tabs tabs-boxed my-6 flex-col sm:flex-row gap-2">
          <button
            role="tab"
            className={`tab text-sm font-semibold flex-1 ${
              mainTab === "cursos" 
                ? "bg-primary text-primary-content" 
                : "hover:bg-base-300"
            }`}
            onClick={() => setMainTab("cursos")}
          >
            <Notebook size={15} className="mr-1"/> 
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
            <Users size={15} className="mr-1"/> 
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
            <SquareUserRound size={15} className="mr-1"/> 
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
            <FileUser size={15} className="mr-1"/> 
            <span className="hidden sm:inline">Gestión de </span>Inscripciones
          </button>
        </div>

        {/* ====================== */}
        {/* Contenido por pestaña */}
        {/* ====================== */}

        {mainTab === "cursos" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
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

            {/* Main */}
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
            <AlumnosManage/>
          </div>
        )}

        {mainTab === "docentes" && (
          <div className="bg-base-100 p-4 rounded-box shadow">
            <DocentesManage/>
          </div>
        )}

        {mainTab === "inscripciones" && (
          <div className="bg-base-100 rounded-box shadow">
            <Solicitudes/>
          </div>
        )}
        <div className="mt-6 bg-base-100 p-4 rounded-box shadow text-center text-sm opacity-70">
          Sistema de Gestión Escolar • {new Date().getFullYear()} • Cole App
        </div>
      </div> 
    </div>
  );
}