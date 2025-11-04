import ScheduleTab from "./ScheduleTab";
import UserHeader from "./UserHeader";
import { StudentSidebar } from "./StudentSidebar";
import { StudentGrade } from "./StudentGrade";
import CalendarTab from "./CalendarTab";
import { useEffect, useState } from "react";
import MailboxTab from "./MailBoxTab";
import padreService from "../services/TutorService";
import AbsencesStudentTab from "./AbsencesStudentTab";

export const EstudiantesDashboard = () => {
  const [loading, setLoading] = useState(true); //estado inicial para la carga inicial
  const [userLoaded, setUserLoaded] = useState(false); // Nuevo estado para verificar si user está cargado
  const [hijosLoaded, setHijosLoaded] = useState(false); // Estado para hijos, si es necesario

  const idUsuario = "tut-001"; // Hardcodeado por ahora, después viene del login, es el dni

  const [user, setUser] = useState({});
  const [estudiantes, setEstudiantes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [subjectsByStudent, setSubjectsByStudent] = useState([]);
  const [tab, setTab] = useState("schedules");
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [inasistencias, setInasistencias] = useState([]);
  const [faltasPorMateria, setFaltasPorMateria] = useState([]);

  useEffect(() => {
    cargarTutor();
  }, []);
  const cargarTutor = async () => {
    try {
      const response = await padreService.getTutor(idUsuario);
      setUser({
        name: `${response.data.Nombre} ${response.data.Apellido}`,
        email: response.data.Email,
        userId: response.data.IdUsuario,
        dni: response.data.DNITutor
      });
      console.log('👤 User cargado:', user);
    } catch (error) {
      console.error("Error cargando datos del tutor/user");
    } finally {
      setUserLoaded(true); // Marca como cargado después de intentar cargar
      checkAllLoaded();
    }
  };

  useEffect(() => {
    if (userLoaded && user.dni) {
      console.log('Cargando hijos para DNI:', user.dni);
      cargarHijos();
    }
  }, [userLoaded, user.dni]);

  const cargarHijos = async () => {
    try {
      console.log(user);
      console.log("Dni del user; ", user.dni);
      const response = await padreService.getHijos(user.dni);

      if (Array.isArray(response.data)) {
        // Si response.data es un array, mapea cada elemento para agregar propiedades
        const estudiantesArray = response.data.map((student) => ({
          IdEstudiante: student.DNIAlumno, // Asume que DNIAlumno es el ID
          Nivel: student.Nivel,
          Grado: `${student.Grado}º ${student.Letra}`, // Asume que Grado y Letra están en student
          Nombre: student.Nombres,
          Apellido: student.Apellido,
          color: "primary",
          dni: student.DNIAlumno,
        }));
        setEstudiantes(estudiantesArray); // Ahora es un array
        if (estudiantesArray.length > 0) {
          setSelectedEstudiante(estudiantesArray[0].IdEstudiante); // Usa el ID del primer estudiante
        }
      } else {
        console.error("response.data no es un array:", response.data);
        setEstudiantes([]); // Establece a un array vacío si no es un array
      }
    } catch (error) {
      console.error("Error cargando hijos:", error);
    } finally {
      setHijosLoaded(true); // Marca como cargado
      checkAllLoaded(); // Verifica si todo está cargado
    }
  };

  const checkAllLoaded = () => {
    if (userLoaded && hijosLoaded) {
      setLoading(false); // Solo establece loading en false cuando todo esté listo
    }
  };

  useEffect(() => {
    if (selectedEstudiante) {
      cargarHorarios();
    }
  }, [selectedEstudiante]);

  const cargarHorarios = async () => {
    try {
      const response = await padreService.getHorarios(selectedEstudiante);

      const horariosArray = response.data.map((h) => ({
        IdCurso: h.IdCurso,
        dia: h.DiaSemana,
        hora: `${h.HoraInicio} - ${h.HoraFin}`,
        aula: h.NumAula,
        materia: h.Materia
      }));
      console.log(horariosArray);
      setHorarios(horariosArray);
    } catch (err) {
      console.error("Error al cargar los horarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEstudiante) {
      cargarInasistencias();
    }
  }, [selectedEstudiante]);

  const cargarInasistencias = async () => {
    try {
      const response = await padreService.getInasistencias(selectedEstudiante);

      // Array de inasistencias
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

      // Convertir a array
      const faltasPorMateriaArray = Object.entries(faltasContadas).map(
        ([materia, faltas]) => ({
          Materia: materia,
          TotalFaltas: faltas,
        })
      );
      setInasistencias(inasistenciasArray);
      setFaltasPorMateria(faltasPorMateriaArray);
    } catch (error) {
      console.error("Error al cargar inasistencias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEstudiante) {
      cargarNotas();
    }
  }, [selectedEstudiante]);

  const cargarNotas = async () => {
    try {
      const response = await padreService.getNotas(selectedEstudiante);

      const notasArray = response.data.map((h) => ({
        Materia: h.Materia,
        Docente: `${h.Profesor_nombre} ${h.Profesor_apellido}`,
        NotaTrimestral1: h.NotaTrimestral1,
        NotaTrimestral2: h.NotaTrimestral2,
        NotaTrimestral3: h.NotaTrimestral3,
        NotaFinal: h.NotaFinal,
        Obs: h.Observaciones,
      }));
      console.log(notasArray);
      setSubjectsByStudent(notasArray);
    } catch (error) {
      console.error("Error al cargar las notas");
    }
  };
  useEffect(() => {
    const list = subjectsByStudent[selectedEstudiante] || [];
    const init = {};
    list.forEach((a) => (init[a.IdMateria] = false));
  }, [selectedEstudiante, subjectsByStudent]);

  // Datos de ejemplo para eventos del calendario
  const eventosPorEstudiante = {
    1: [
      {
        id: 1,
        title: "Examen de Historia",
        start: new Date(new Date().setDate(new Date().getDate() + 1)),
        end: new Date(new Date().setDate(new Date().getDate() + 1)),
        extendedProps: {
          materia: "Historia",
          tipo: "examen",
          descripcion: "Examen parcial del primer trimestre",
        },
        color: "#ef4444",
      },
      {
        id: 2,
        title: "Entrega de Proyecto - Química",
        start: new Date(new Date().setDate(new Date().getDate() + 3)),
        end: new Date(new Date().setDate(new Date().getDate() + 3)),
        extendedProps: {
          materia: "Química",
          tipo: "entrega",
          descripcion: "Proyecto de laboratorio",
        },
        color: "#3b82f6",
      },
      {
        id: 3,
        title: "Clase Extra - Biología",
        start: new Date(new Date().setDate(new Date().getDate() + 5)),
        end: new Date(new Date().setDate(new Date().getDate() + 5)),
        extendedProps: {
          materia: "Biología",
          tipo: "clase",
          descripcion: "Clase de repaso",
        },
        color: "#10b981",
      },
    ],
    2: [
      {
        id: 4,
        title: "Examen de Matemática",
        start: new Date(new Date().setDate(new Date().getDate() + 2)),
        end: new Date(new Date().setDate(new Date().getDate() + 2)),
        extendedProps: {
          materia: "Matemática",
          tipo: "examen",
          descripcion: "Examen de geometría",
        },
        color: "#ef4444",
      },
      {
        id: 5,
        title: "Olimpíada de Física",
        start: new Date(new Date().setDate(new Date().getDate() + 6)),
        end: new Date(new Date().setDate(new Date().getDate() + 6)),
        extendedProps: {
          materia: "Física",
          tipo: "evento",
          descripcion: "Competencia escolar",
        },
        color: "#8b5cf6",
      },
      {
        id: 6,
        title: "Reunión de Padres",
        start: new Date(new Date().setDate(new Date().getDate() + 8)),
        end: new Date(new Date().setDate(new Date().getDate() + 8)),
        extendedProps: {
          materia: "General",
          tipo: "reunion",
          descripcion: "Reunión informativa",
        },
        color: "#f59e0b",
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Renderiza UserHeader solo si userLoaded es true */}
        {userLoaded ? (
          <UserHeader
            user={user}
            onLogout={() => console.log("Cerrar sesión")}
            //props para configuracion
            userRole = "Tutor"
            fieldsConfig={TutorField}
            apiEndpoint="alumnos/tutor/configuracion"
          />
        ) : (
          <div className="bg-base-100 p-4 rounded-box shadow text-center">
            Cargando datos del usuario...
          </div> // Muestra un mensaje de carga o nada
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
export const TutorField = [
  {
    section: "Datos Personales",
    fields: [
      { name: "DNITutor", label: "DNI", type: "text", required: true, placeholder: "Ej: 12345678", disabled: true },
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
  },
  {
    section: "Información de Hijos",
    fields: [
      { name: "hijos", label: "Hijos matriculados", type: "custom", component: "HijosLista" },
    ]
  }
];
