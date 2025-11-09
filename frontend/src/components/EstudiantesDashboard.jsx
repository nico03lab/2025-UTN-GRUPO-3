import ScheduleTab from "./ScheduleTab";
import UserHeader from "./UserHeader";
import { StudentSidebar } from "./StudentSidebar";
import { StudentGrade } from "./StudentGrade";
import CalendarTab from "./CalendarTab";
import { useEffect, useState } from "react";
import MailboxTab from "./MailBoxTab";
import padreService from "../services/TutorService";
import AbsencesStudentTab from "./AbsencesStudentTab";
import { useAuth } from "../context/AuthContext";

export const EstudiantesDashboard = () => {
  const { user, ready, logout } = useAuth();

  const [userData, setUserData] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [subjectsByStudent, setSubjectsByStudent] = useState([]);
  const [inasistencias, setInasistencias] = useState([]);
  const [faltasPorMateria, setFaltasPorMateria] = useState([]);
  const [tab, setTab] = useState("schedules");
  const [loading, setLoading] = useState(true);

  // --- Cargar tutor al iniciar sesión ---
  useEffect(() => {
    if (!ready || !user) return;
    console.log("🔐 Usuario autenticado desde AuthContext:", user);
    cargarTutor();
  }, [ready, user]);

  const cargarTutor = async () => {
    try {
      console.log("📡 Cargando datos del tutor:", user.userId);
      const response = await padreService.getTutor(user.userId);
      const tutor = response.data;

      setUserData({
        dni: tutor.DNITutor,
        userId: tutor.IdUsuario,
        name: `${tutor.Nombre} ${tutor.Apellido}`,
        email: tutor.Email,
      });

      console.log("👤 Tutor cargado:", tutor);
    } catch (error) {
      console.error("❌ Error cargando datos del tutor:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Cargar hijos del tutor ---
  useEffect(() => {
    if (userData?.dni) {
      cargarHijos(userData.dni);
    }
  }, [userData?.dni]);

  const cargarHijos = async (dni) => {
    try {
      console.log("📚 Cargando hijos para tutor DNI:", dni);
      const response = await padreService.getHijos(dni);

      if (Array.isArray(response.data)) {
        const estudiantesArray = response.data.map((student) => ({
          IdEstudiante: student.DNIAlumno,
          Nivel: student.Nivel,
          Grado: `${student.Grado}º ${student.Letra}`,
          Nombre: student.Nombres,
          Apellido: student.Apellido,
          color: "primary",
          dni: student.DNIAlumno,
        }));

        setEstudiantes(estudiantesArray);
        if (estudiantesArray.length > 0) {
          setSelectedEstudiante(estudiantesArray[0].IdEstudiante);
        }

        console.log("👨‍👩‍👧 Hijos cargados:", estudiantesArray);
      } else {
        console.error("response.data no es un array:", response.data);
        setEstudiantes([]);
      }
    } catch (error) {
      console.error("❌ Error cargando hijos:", error);
    }
  };

  // --- Cargar horarios del estudiante seleccionado ---
  useEffect(() => {
    if (selectedEstudiante) {
      cargarHorarios(selectedEstudiante);
      cargarNotas(selectedEstudiante);
      cargarInasistencias(selectedEstudiante);
    }
  }, [selectedEstudiante]);

  const cargarHorarios = async (idEstudiante) => {
    try {
      console.log("🕓 Cargando horarios del estudiante:", idEstudiante);
      const response = await padreService.getHorarios(idEstudiante);
      const horariosArray = response.data.map((h) => ({
        IdCurso: h.IdCurso,
        dia: h.DiaSemana,
        hora: `${h.HoraInicio} - ${h.HoraFin}`,
        aula: h.NumAula,
        materia: h.Materia,
      }));
      setHorarios(horariosArray);
    } catch (err) {
      console.error("❌ Error al cargar los horarios:", err);
    }
  };

  const cargarNotas = async (idEstudiante) => {
    try {
      console.log("📋 Cargando notas del estudiante:", idEstudiante);
      const response = await padreService.getNotas(idEstudiante);
      const notasArray = response.data.map((h) => ({
        Materia: h.Materia,
        Docente: `${h.Profesor_nombre} ${h.Profesor_apellido}`,
        NotaTrimestral1: h.NotaTrimestral1,
        NotaTrimestral2: h.NotaTrimestral2,
        NotaTrimestral3: h.NotaTrimestral3,
        NotaFinal: h.NotaFinal,
        Obs: h.Observaciones,
      }));
      setSubjectsByStudent(notasArray);
    } catch (error) {
      console.error("❌ Error al cargar las notas:", error);
    }
  };

  const cargarInasistencias = async (idEstudiante) => {
    try {
      console.log("🚸 Cargando inasistencias del estudiante:", idEstudiante);
      const response = await padreService.getInasistencias(idEstudiante);
      const inasistenciasArray = response.data.map((h) => ({
        IdCurso: h.IdCurso,
        Materia: h.Materia,
        Fecha: h.Fecha,
        Presente: h.Presente ? "Presente" : "Ausente",
      }));

      // Contar faltas por materia
      const faltasContadas = response.data.reduce((acc, h) => {
        if (!h.Presente) {
          acc[h.Materia] = (acc[h.Materia] || 0) + 1;
        }
        return acc;
      }, {});

      const faltasPorMateriaArray = Object.entries(faltasContadas).map(
        ([materia, faltas]) => ({
          Materia: materia,
          TotalFaltas: faltas,
        })
      );

      setInasistencias(inasistenciasArray);
      setFaltasPorMateria(faltasPorMateriaArray);
    } catch (error) {
      console.error("❌ Error al cargar inasistencias:", error);
    }
  };

  // --- Loader inicial ---
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // --- Render principal ---
  return (
    <div className="bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {userData ? (
          <UserHeader
            user={userData}
            onLogout={logout}
            userRole="Tutor"
            fieldsConfig={TutorField}
            apiEndpoint="alumnos/tutor/configuracion"
          />
        ) : (
          <div className="bg-base-100 p-4 rounded-box shadow text-center">
            Cargando datos del usuario...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <StudentSidebar
              estudiantes={estudiantes}
              selectedEstudiante={selectedEstudiante}
              setSelectedEstudiante={setSelectedEstudiante}
              tab={tab}
              setTab={setTab}
            />
          </aside>

          <main className="lg:col-span-3">
            <div className="bg-base-100 p-4 md:p-6 rounded-box shadow">
              {tab === "absences" && (
                <AbsencesStudentTab
                  inasistencias={inasistencias}
                  faltasMateria={faltasPorMateria}
                />
              )}
              {tab === "schedule" && <ScheduleTab horarios={horarios} />}
              {tab === "notes" && <StudentGrade materias={subjectsByStudent} />}
              {tab === "calendar" && (
                <CalendarTab dniAlumno={selectedEstudiante || []} />
              )}
              {tab === "mailbox" && <MailboxTab />}
            </div>
          </main>
        </div>

        <div className="mt-6 bg-base-100 p-4 rounded-box shadow text-center text-sm opacity-70">
          Sistema de Gestión Escolar • {new Date().getFullYear()} • Cole App
        </div>
      </div>
    </div>
  );
};

// --- Configuración de campos del tutor ---
export const TutorField = [
  {
    section: "Datos Personales",
    fields: [
      { name: "DNITutor", label: "DNI", type: "text", required: true, disabled: true },
      { name: "Nombre", label: "Nombre", type: "text", required: true },
      { name: "Apellido", label: "Apellido", type: "text", required: true },
      { name: "Email", label: "Email", type: "email", required: true },
      { name: "TelefonoCel", label: "Teléfono Celular", type: "tel" },
      { name: "TelefonoLinea", label: "Teléfono Línea", type: "tel" },
    ],
  },
  {
    section: "Dirección",
    fields: [
      { name: "Calle", label: "Calle", type: "text" },
      { name: "Numero", label: "Número", type: "text" },
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
      { name: "Pass", label: "Contraseña", type: "passwordProtected", placeholder: "Nueva contraseña" },
    ],
  },
  {
    section: "Información de Hijos",
    fields: [
      { name: "hijos", label: "Hijos matriculados", type: "custom", component: "HijosLista" },
    ],
  },
];
