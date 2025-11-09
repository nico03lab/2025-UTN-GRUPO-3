import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserHeader from "../components/UserHeader";
import { StudentSidebar } from "../components/StudentSidebar";
import ScheduleTab from "../components/ScheduleTab";
import CalendarTab from "../components/CalendarTab";
import { StudentGrade } from "../components/StudentGrade";
import MailboxTab from "../components/MailBoxTab";
import AbsencesStudentTab from "../components/AbsencesStudentTab";
import alumnoService from "../services/AlumnoService";

export const AlumnosPage = () => {
  const { user, ready, logout } = useAuth();

  const [userData, setUserData] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [inasistencias, setInasistencias] = useState([]);
  const [faltasPorMateria, setFaltasPorMateria] = useState([]);
  const [tab, setTab] = useState("schedule");
  const [loading, setLoading] = useState(true);

  // --- Cargar alumno al iniciar sesión ---
  useEffect(() => {
    if (!ready || !user) return;
    console.log("Usuario autenticado desde AuthContext:", user);
    cargarAlumno();
  }, [ready, user]);

  const cargarAlumno = async () => {
    try {
      const response = await alumnoService.getAlumno(user.userId);
      const alumno = response.data.data || response.data;  // Si está anidado, usa response.data.data
      console.log("Alumno extraído:", alumno);
      
      setUserData({
        dni: alumno.DNIAlumno,
        userId: alumno.IdUsuario,
        name: `${alumno.Nombres} ${alumno.Apellido}`,
        email: alumno.Email,
        curso: `${alumno.Nivel} ${alumno.Grado}º ${alumno.Letra}`,
        idCurso: alumno.IdCurso,
      });

    } catch (error) {
      console.error("Error cargando datos del alumno:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // --- Cargar datos del alumno ---
  useEffect(() => {
    if (userData?.dni) {
      cargarHorarios(userData.dni);
      cargarNotas(userData.dni);
      cargarInasistencias(userData.dni);
    }
  }, [userData?.dni]);

  const cargarHorarios = async (dniAlumno) => {
    try {
      console.log("Cargando horarios del alumno:", dniAlumno);
      const response = await alumnoService.getHorarios(dniAlumno);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Error al cargar horarios");
      }
      
      const horariosArray = response.data.data.map((h) => ({
        IdCurso: h.IdCurso,
        dia: h.DiaSemana,
        hora: `${h.HoraInicio} - ${h.HoraFin}`,
        aula: h.NumAula,
        materia: h.Materia,
      }));
      setHorarios(horariosArray);
    } catch (err) {
      console.error("Error al cargar los horarios:", err);
    }
  };

  const cargarNotas = async (dniAlumno) => {
    try {
      console.log("📋 Cargando notas del alumno:", dniAlumno);
      const response = await alumnoService.getNotas(dniAlumno);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Error al cargar notas");
      }
      
      const notasArray = response.data.data.map((h) => ({
        Materia: h.Materia,
        Docente: `${h.Profesor_nombre} ${h.Profesor_apellido}`,
        NotaTrimestral1: h.NotaTrimestral1,
        NotaTrimestral2: h.NotaTrimestral2,
        NotaTrimestral3: h.NotaTrimestral3,
        NotaFinal: h.NotaFinal,
        Obs: h.Observaciones,
      }));
      setMaterias(notasArray);
    } catch (error) {
      console.error("❌ Error al cargar las notas:", error);
    }
  };
  

  const cargarInasistencias = async (dniAlumno) => {
    try {
      console.log("🚸 Cargando inasistencias del alumno:", dniAlumno);
      const response = await alumnoService.getInasistencias(dniAlumno);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Error al cargar inasistencias");
      }
      
      const inasistenciasArray = response.data.data.map((h) => ({
        IdCurso: h.IdCurso,
        Materia: h.Materia,
        Fecha: h.Fecha,
        Presente: h.Presente ? "Presente" : "Ausente",
      }));

      // Contar faltas por materia
      const faltasContadas = response.data.data.reduce((acc, h) => {
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
            userRole="Alumno"
            fieldsConfig={AlumnoField}
            apiEndpoint="alumnos/configuracion/user"
          />
        ) : (
          <div className="bg-base-100 p-4 rounded-box shadow text-center">
            Cargando datos del usuario...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SIDEBAR - Para alumno, solo muestra su info */}
          <aside className="lg:col-span-1">
            <StudentSidebar
              estudiantes={userData ? [{
                IdEstudiante: userData.dni,
                Nombre: userData.name.split(' ')[0] || userData.name,  // Primera parte del nombre (e.g., "María")
                Apellido: userData.name.split(' ')[1] || "",  // Segunda parte (e.g., "González")
                Grado: userData.curso.split(' ')[1] + ' ' + userData.curso.split(' ')[2] || userData.curso,  // "1º A"
                Nivel: userData.curso.split(' ')[0] || "",  // "Secundario"
                color: "primary",
                dni: userData.dni
              }] : []}
              selectedEstudiante={userData?.dni}
              setSelectedEstudiante={() => {}} // El alumno no puede cambiar
              tab={tab}
              setTab={setTab}
            />
          </aside>

          {/* MAIN */}
          <main className="lg:col-span-3">
            <div className="bg-base-100 p-4 md:p-6 rounded-box shadow">
              {tab === "schedule" && <ScheduleTab horarios={horarios} />}

              {tab === "notes" && <StudentGrade materias={materias} />}

              {tab === "absences" && (
                <AbsencesStudentTab
                  inasistencias={inasistencias}
                  faltasMateria={faltasPorMateria}
                />
              )}

              {tab === "calendar" && (
                <CalendarTab dniAlumno={userData?.dni || ""} />
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

// --- Configuración de campos del alumno ---
export const AlumnoField = [
  {
    section: "Datos Personales",
    fields: [
      { 
        name: "DNIAlumno", 
        label: "DNI", 
        type: "text", 
        required: true, 
        disabled: true 
      },
      { 
        name: "Nombres", 
        label: "Nombres", 
        type: "text", 
        required: true 
      },
      { 
        name: "Apellido", 
        label: "Apellido", 
        type: "text", 
        required: true 
      },
      { 
        name: "Email", 
        label: "Email", 
        type: "email" 
      },
      { 
        name: "Telefono", 
        label: "Teléfono", 
        type: "tel" 
      },
      { 
        name: "FechaNacimiento", 
        label: "Fecha de Nacimiento", 
        type: "date",
        disabled: true 
      },
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
      { 
        name: "NombreUsuario", 
        label: "Usuario", 
        type: "text",
      },
      { 
        name: "Pass", 
        label: "Contraseña", 
        type: "passwordProtected", 
        placeholder: "Nueva contraseña" 
      },
    ],
  },
];