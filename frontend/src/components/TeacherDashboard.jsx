import React, { useEffect, useState } from "react";
import AttendanceTab from "./AttendanceTab";
import ScheduleTab from "./ScheduleTab";
import GradesTab from "./GradesTab";
import UserHeader from "../components/UserHeader";
import CourseSidebar from "../components/CourseSidebar";
import StatsPanel from "../components/Statspanel";
import axios from "axios";

import docenteService from "../ServiceApi.jsx/DocenteService";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false); // Estado para controlar si el user está cargado

  const API_BASE_URL = "http://localhost:3002/api";

  const [viewMode, setViewMode] = useState("cards");
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [tab, setTab] = useState("attendance");
  const [alumnosByCurso, setAlumnosByCurso] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [grades, setGrades] = useState({});
  const [notifications] = useState(3);

  const idUsuario = "doc-001"; //asumiendo que se parte de un user


  const cargarDocente = async () => {
    try {
      const response = await docenteService.getDocente(idUsuario); 
      setUser({
        dni: response.data.DNIDocente, 
        userId: response.data.IdUsuario,
        name: `${response.data.Nombre} ${response.data.Apellido}`,
        email: response.data.Email,
      });
      console.log(' User cargado:', user);
    } catch (error) {
      console.error("Error cargando datos del docente/user");
    } finally {
      setUserLoaded(true); // Marca como cargado después de intentar cargar
      checkAllLoaded(); 
    }
  };

  // useEffect para cargar el user al montar el componente
  useEffect(() => {
    cargarDocente();
  }, []);

  // Función opcional para verificar si todo está cargado (puedes expandirla si tienes más fetches)
  const checkAllLoaded = () => {
    if (userLoaded) {
      console.log("Todos los datos iniciales cargados");
    }
  };

  useEffect(() => {
    if (!userLoaded || !user?.dni) return; // Espera a que user esté cargado el user
    axios
      .get(`${API_BASE_URL}/cursos/${user.dni}`)
      .then((res) => {
        console.log("✅ Cursos obtenidos:", res.data);
        setCursos(res.data);
        if (res.data.length > 0) {
          setSelectedCurso(res.data[0].IdCurso);
        }
      })
      .catch((err) => console.error(" Error al obtener cursos:", err));
  }, [userLoaded, user?.dni]); // Dependencias actualizadas

  const toggleAttendance = (dniAlumno) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [dniAlumno]: !prevAttendance[dniAlumno],
    }));
  };

  useEffect(() => {
    if (!userLoaded || !selectedCurso) return; // Espera a que user esté cargado
    axios
      .get(`${API_BASE_URL}/alumnos/${selectedCurso}`)
      .then((res) => {
        const initAttendance = {};
        res.data.forEach((a) => (initAttendance[a.DNIAlumno] = false));
        setAttendance(initAttendance);
        setAlumnosByCurso(res.data);
      })
      .catch((err) => console.error(err));
  }, [userLoaded, selectedCurso]); // Dependencias actualizadas

  const [horarios, setHorarios] = useState({});

  // Modifica este useEffect para depender de userLoaded y user.dni
  useEffect(() => {
    if (!userLoaded || !user?.dni) return; // Espera a que user esté cargado
    axios
      .get(`${API_BASE_URL}/docentes/horarios/${user.dni}`)
      .then((res) => {
        console.log("✅ Horarios del docente:", res.data);

        const horariosPorCurso = {};
        res.data.forEach((item) => {
          const idCurso = item.IdCurso;
          if (!horariosPorCurso[idCurso]) horariosPorCurso[idCurso] = [];
          horariosPorCurso[idCurso].push({
            IdCurso: item.IdCurso,
            dia: item.DiaSemana,
            hora: `${item.HoraInicio} - ${item.HoraFin}`,
            aula: item.NumAula,
            materia: item.Materia,
          });
        });

        setHorarios(horariosPorCurso);
      })
      .catch((err) => console.error("❌ Error al obtener horarios:", err));
  }, [userLoaded, user?.dni]); 

  // Falta implementación backend con tabla Asistencias
  const saveAttendance = () => {
    const payload = {
      curso: selectedCurso,
      fecha: new Date().toISOString().split("T")[0],
      asistencia: Object.entries(attendance).map(([DNI, Presente]) => ({
        DNI,
        Presente: Presente ? 1 : 0,
      })),
    };
    console.log("Enviar a backend ->", payload);
    // Mostrar toast
    const toast = document.getElementById("toast");
    toast.classList.add("alert-success", "show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  };

  // Implementar backend con tabla Boletines
  const setGrade = (dni, value) => {
    setGrades((prev) => ({ ...prev, [dni]: { ...prev[dni], nota: value } }));
  };

  const setObs = (dni, value) => {
    setGrades((prev) => ({ ...prev, [dni]: { ...prev[dni], obs: value } }));
  };

  const saveGrades = () => {
    const payload = { curso: selectedCurso, calificaciones: grades };
    console.log("Enviar calificaciones ->", payload);
    // Mostrar toast
    const toast = document.getElementById("toast");
    toast.classList.add("alert-success", "show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  };

  // Estadísticas para la barra lateral
  const stats = {
    totalAlumnos: 78,
    asistenciaPromedio: 92,
    calificacionPromedio: 7.8,
  };

  // Si user no está cargado, muestra un loading (opcional, pero recomendado)
  if (!userLoaded) {
    return <div className="min-h-screen bg-base-200 flex items-center justify-center">Cargando datos del docente...</div>;
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Toast de notificación */}
      <div id="toast" className="toast toast-top toast-end hidden">
        <div className="alert alert-info">
          <span>Operación realizada con éxito.</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <UserHeader
          user={user}
          notifications={notifications}
          onLogout={() => console.log("Cerrar sesión")}
          userRole="Docente"
          fieldsConfig={DocenteField}
          apiEndpoint="docentes/configuracion"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <CourseSidebar
              cursos={cursos}
              selectedCurso={selectedCurso}
              setSelectedCurso={setSelectedCurso}
              tab={tab}
              setTab={setTab}
            />

            <StatsPanel stats={stats} />
          </aside>

          {/* Main */}
          <main className="lg:col-span-3">
            <div className="bg-base-100 p-4 md:p-6 rounded-box shadow">
              {/* Tabs content */}
              {tab === "attendance" && (
                <AttendanceTab
                  alumnos={alumnosByCurso}
                  attendance={attendance}
                  toggleAttendance={toggleAttendance}
                  saveAttendance={saveAttendance}
                  setAttendance={setAttendance}
                />
              )}

              {tab === "schedule" && (
                <div>
                  {/* Selector de vista */}
                  <div className="flex justify-end mb-3 gap-2">
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`btn btn-xs ${
                        viewMode === "cards" ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      Tarjetas (curso actual)
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`btn btn-xs ${
                        viewMode === "list" ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      Lista (todos los cursos)
                    </button>
                  </div>

                  <ScheduleTab
                    horarios={
                      viewMode === "cards"
                        ? horarios[selectedCurso] || []
                        : Object.values(horarios).flat()
                    }
                    viewMode={viewMode}
                  />
                </div>
              )}

              {tab === "grades" && (
                <GradesTab
                  alumnos={alumnosByCurso}
                  grades={grades}
                  setGrade={setGrade}
                  setObs={setObs}
                  saveGrades={saveGrades}
                  setGrades={setGrades}
                />
              )}
            </div>
          </main>
        </div>
        {/* Footer con información adicional */}
        <div className="mt-6 bg-base-100 p-4 rounded-box shadow text-center text-sm opacity-70">
          Sistema de Gestión Escolar • {new Date().getFullYear()} • Cole App
        </div>
      </div>
    </div>
  );
}

// Para la modificación
export const DocenteField = [
  {
    section: "Datos Personales",
    fields: [
      { name: "DNIDocente", label: "DNI", type: "text", required: true, placeholder: "Ej: 12345678", disabled: true },
      { name: "Nombre", label: "Nombre", type: "text", required: true, placeholder: "Ej: Juan" },
      { name: "Apellido", label: "Apellido", type: "text", required: true, placeholder: "Ej: Pérez" },
      { name: "Email", label: "Email", type: "email", required: true, placeholder: "tutor@email.com" },
      { name: "TelefonoCel", label: "Teléfono Celular", type: "tel", placeholder: "221-1234567" },
      { name: "TelefonoLinea", label: "Teléfono Linea", type: "tel", placeholder: "42456789" }
    ]
  },
  {
    section: "Dirección",
    fields: [
      { 
        name: "Calle", 
        label: "Calle", 
        type: "text", 
        placeholder: "Ej: Calle 50" 
      },
      { 
        name: "Numero", 
        label: "Número", 
        type: "text", 
        placeholder: "Ej: 123" 
      },
      { 
        name: "IdLocalidad", 
        label: "Provincia y Localidad", 
        type: "localidad", // Tipo especial
        className: "md:col-span-2" // Ocupa 2 columnas
      },
    ]
  },
  {
    section: "Usuario",
    fields: [
      { name: "NombreUsuario", label: "Usuario", type: "text", placeholder: "Ej: juanPerez" },
      { name: "Pass", label: "Contraseña", type: "text", placeholder: "Ej: doc-001" },
    ]
  }
];