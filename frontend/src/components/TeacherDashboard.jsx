import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AttendanceTab from "./AttendanceTab";
import ScheduleTab from "./ScheduleTab";
import GradesTab from "./GradesTab";
import UserHeader from "../components/UserHeader";
import CourseSidebar from "../components/CourseSidebar";
import StatsPanel from "../components/Statspanel";
import axios from "../services/axios";
import docenteService from "../services/DocenteService";
import {showToast} from "../utils/toast"

export default function TeacherDashboard() {
  const { user, ready, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [viewMode, setViewMode] = useState("cards");
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [tab, setTab] = useState("attendance");
  const [alumnosByCurso, setAlumnosByCurso] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [grades, setGrades] = useState({});
  const [horarios, setHorarios] = useState({});
  const [notifications] = useState(3);

  const API_BASE_URL = "http://localhost:3002/api";

  // Cargar docente cuando el usuario esté listo
  useEffect(() => {
    if (!ready || !user) return;

    const cargarDocente = async () => {
      try {
        const response = await docenteService.getDocente(user.userId);
        setUserData({
          dni: response.data.DNIDocente,
          userId: response.data.IdUsuario,
          name: `${response.data.Nombre} ${response.data.Apellido}`,
          email: response.data.Email,
        });
      } catch (err) {
        console.error("Error al cargar docente:", err);
      }
    };
    
    cargarDocente();
    
  }, [ready, user]);

  // Cargar cursos del docente
  useEffect(() => {
    if (!userData?.dni) return;
    axios
      .get(`${API_BASE_URL}/cursos/${userData.dni}`)
      .then((res) => {
        setCursos(res.data);
        if (res.data.length > 0) setSelectedCurso(res.data[0].IdCurso);
      })
      .catch((err) => console.error("Error al obtener cursos:", err));
  }, [userData?.dni]);

  // Cargar alumnos del curso seleccionado
  useEffect(() => {
    if (!selectedCurso) return;
    axios
      .get(`${API_BASE_URL}/alumnos/${selectedCurso}`)
      .then((res) => {
        const initAttendance = {};
        res.data.forEach((a) => (initAttendance[a.DNIAlumno] = false));
        setAttendance(initAttendance);
        setAlumnosByCurso(res.data);
      })
      .catch((err) => console.error(err));
  }, [selectedCurso]);

  // Cargar horarios del docente
  useEffect(() => {
    if (!userData?.dni) return;
    axios
      .get(`${API_BASE_URL}/docentes/horarios/${userData.dni}`)
      .then((res) => {
        const horariosPorCurso = {};
        res.data.forEach((item) => {
          const idCurso = item.IdCurso;
          if (!horariosPorCurso[idCurso]) horariosPorCurso[idCurso] = [];
          horariosPorCurso[idCurso].push({
            IdCurso: item.IdCurso,
            dia: item.DiaSemana,
            hora: `${item.HoraInicio} - ${item.HoraFin}`,
            aula: item.NumAula,
            idMateria: item.IdMateria,
            materia: item.NombreMateria,
          });
        });
        setHorarios(horariosPorCurso);
      })
      .catch((err) => console.error("Error al obtener horarios:", err));
  }, [userData?.dni]);

  // Lógica de asistencia y calificaciones
  const toggleAttendance = (dniAlumno) =>
    setAttendance((prev) => ({
      ...prev,
      [dniAlumno]: !prev[dniAlumno],
    }));

  const saveAttendance = () => {
    const payload = {
      curso: selectedCurso,
      fecha: new Date().toISOString().split("T")[0],
      idMateria: horarios[selectedCurso]?.[0]?.idMateria,
      asistencia: Object.entries(attendance).map(([DNI, Presente]) => ({
        DNI,
        Presente: Presente ? 1 : 0,
      })),
    };
    axios.post(`${API_BASE_URL}/asistencias`,payload)
      .then(res  => {
        console.log(res.data);
        showToast("✅ Asistencia guardada correctamente"); 
      })
      .catch(err => showToast("❌ Error al guardar asistencia", "error"));

  };

  const setGrade = (dni, value) =>
    setGrades((prev) => ({ ...prev, [dni]: { ...prev[dni], nota: value } }));

  const setObs = (dni, value) =>
    setGrades((prev) => ({ ...prev, [dni]: { ...prev[dni], obs: value } }));

  const saveGrades = () => {
    const payload = { curso: selectedCurso, calificaciones: grades };
    console.log("Enviar calificaciones ->", payload);
  };

  // Estadísticas para la barra lateral
  const stats = {
    totalAlumnos: 78,
    asistenciaPromedio: 92,
    calificacionPromedio: 7.8,
  };

  // Render condicional
  if (!ready) return <div>Cargando autenticación...</div>;
  if (!userData) return <div>Cargando datos del docente...</div>;

  return (
    <div className="min-h-screen bg-base-200">
      
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <UserHeader
          user={userData}
          notifications={notifications}
          onLogout={logout}
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
      {
        name: "DNIDocente",
        label: "DNI",
        type: "text",
        required: true,
        placeholder: "Ej: 12345678",
        disabled: true,
      },
      {
        name: "Nombre",
        label: "Nombre",
        type: "text",
        required: true,
        placeholder: "Ej: Juan",
      },
      {
        name: "Apellido",
        label: "Apellido",
        type: "text",
        required: true,
        placeholder: "Ej: Pérez",
      },
      {
        name: "Email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "tutor@email.com",
      },
      {
        name: "TelefonoCel",
        label: "Teléfono Celular",
        type: "tel",
        placeholder: "221-1234567",
      },
      {
        name: "TelefonoLinea",
        label: "Teléfono Linea",
        type: "tel",
        placeholder: "42456789",
      },
    ],
  },
  {
    section: "Dirección",
    fields: [
      {
        name: "Calle",
        label: "Calle",
        type: "text",
        placeholder: "Ej: Calle 50",
      },
      {
        name: "Numero",
        label: "Número",
        type: "text",
        placeholder: "Ej: 123",
      },
      {
        name: "IdLocalidad",
        label: "Provincia y Localidad",
        type: "localidad", // Tipo especial
        className: "md:col-span-2", // Ocupa 2 columnas
      },
    ],
  },
  {
    section: "Usuario",
    fields: [
      {
        name: "NombreUsuario",
        label: "Usuario",
        type: "text",
        placeholder: "Ej: juanPerez",
      },
      {
        name: "Pass",
        label: "Contraseña",
        type: "text",
        placeholder: "Ej: doc-001",
      },
    ],
  },
];
