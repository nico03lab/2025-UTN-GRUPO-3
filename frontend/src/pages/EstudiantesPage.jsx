import ScheduleTab from '../components/ScheduleTab';
import UserHeader from "../components/UserHeader";
import { StudentSidebar } from '../components/StudentSidebar';
import { StudentGrade } from '../components/StudentGrade';
import CalendarTab from '../components/CalendarTab';
import { use, useEffect, useState } from "react";
import MailboxTab from '../components/MailBoxTab';
import padreService from '../components/TutorService';
import AbsencesStudentTab from '../components/AbsencesStudentTab';


export const EstudiantesPage = () => {
  const [loading, setLoading] = useState(true); //estado inicial para la carga inicial
  const [userLoaded, setUserLoaded] = useState(false);  // Nuevo estado para verificar si user está cargado
  const [hijosLoaded, setHijosLoaded] = useState(false);  // Estado para hijos, si es necesario


  const PADRE_ID = 25000000; // Hardcodeado por ahora, después viene del login, es el dni
  
  const [user, setUser] = useState({});
  const [estudiantes, setEstudiantes] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [subjectsByStudent, setSubjectsByStudent] = useState([]);
  const [tab, setTab] = useState('schedules');
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [inasistencias, setInasistencias] = useState([]);
  const [faltasPorMateria, setFaltasPorMateria] = useState([]);


  useEffect(()=>{
    cargarTutor();
  }, []);
  const cargarTutor = async()=>{
    try{
      const response = await padreService.getTutor(PADRE_ID);
      setUser({
        name: `${response.data.Nombre} ${response.data.Apellido}`,
        email: response.data.Email
      });
    }catch (err){
      console.error('Error cargando datos del tutor/user');
    }finally{
      setUserLoaded(true);  // Marca como cargado después de intentar cargar
      checkAllLoaded();
    }
  }

   useEffect(() => {
    cargarHijos();
  }, []);

  const cargarHijos = async () => {
    try {
      const response = await padreService.getHijos(PADRE_ID);

      if (Array.isArray(response.data)) {
      // Si response.data es un array, mapea cada elemento para agregar propiedades
        const estudiantesArray = response.data.map(student => ({
        IdEstudiante: student.DNIAlumno,  // Asume que DNIAlumno es el ID
        Nivel: student.Nivel,
        Grado: `${student.Grado}º ${student.Letra}`,  // Asume que Grado y Letra están en student
        Nombre: student.Nombres,
        Apellido: student.Apellido,
        color: 'primary',  
        dni: student.DNIAlumno
      }));
      setEstudiantes(estudiantesArray);  // Ahora es un array
      if (estudiantesArray.length > 0) {
        setSelectedEstudiante(estudiantesArray[0].IdEstudiante);  // Usa el ID del primer estudiante
      };
    } else {
      console.error('response.data no es un array:', response.data);
      setEstudiantes([]);  // Establece a un array vacío si no es un array
    }
    } catch (error) {
      console.error('Error cargando hijos:', error);
    } finally {
      setHijosLoaded(true);  // Marca como cargado
      checkAllLoaded();  // Verifica si todo está cargado
    }
  };

  const checkAllLoaded = () => {
    if (userLoaded && hijosLoaded) {
      setLoading(false);  // Solo establece loading en false cuando todo esté listo
    }
  };
  
  useEffect(()=>{
    if(selectedEstudiante){
      cargarHorarios();
    }
  }, [selectedEstudiante]);

  const cargarHorarios = async () =>{
    try{
      const response = await padreService.getHorarios(selectedEstudiante);

      const horariosArray = response.data.map(h => ({
        dia: `${h.DiaSemana} - ${h.Materia}`,
        hora: `${h.HoraInicio} - ${h.HoraFin}`,
        aula:  `${h.NumAula} - Curso: ${h.IdCurso}`
      }));
      console.log(horariosArray);
      setHorarios(horariosArray);

    }catch (err){
      console.error('Error al cargar los horarios');
    }finally{
      setLoading(false);
    }
  }
  
  useEffect(()=>{
    if (selectedEstudiante){
      cargarInasistencias();
    }
  }, [selectedEstudiante]);


const cargarInasistencias = async () => {
  try {
    const response = await padreService.getInasistencias(selectedEstudiante);
    
    // Array de inasistencias
    const inasistenciasArray = response.data.map(h => ({
      IdCurso: h.IdCurso,
      Materia: h.Materia,
      Fecha: h.Fecha,
      Presente: h.Presente ? 'Presente' : 'Ausente'
    }));
    
    // Contar faltas por materia
    const faltasContadas = response.data.reduce((acc, h) => {
      if (!h.Presente) {
        acc[h.Materia] = (acc[h.Materia] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Convertir a array
    const faltasPorMateriaArray = Object.entries(faltasContadas).map(([materia, faltas]) => ({
      Materia: materia,
      TotalFaltas: faltas
    }));
    setInasistencias(inasistenciasArray);
    setFaltasPorMateria(faltasPorMateriaArray);
    
    
  } catch (error) {
    console.error('Error al cargar inasistencias:', error);
  }finally{
      setLoading(false);
  }
};

  useEffect(()=>{
    if(selectedEstudiante){
      cargarNotas();
    }
  }, [selectedEstudiante]);

  const cargarNotas = async ()=>{
    try {
      const response = await padreService.getNotas(selectedEstudiante);
     
      const notasArray = response.data.map(h => ({
        Materia: h.Materia,
        Docente: `${h.Profesor_nombre} ${h.Profesor_apellido}`,
        NotaTrimestral1: h.NotaTrimestral1,
        NotaTrimestral2: h.NotaTrimestral2,
        NotaTrimestral3: h.NotaTrimestral3,
        NotaFinal: h.NotaFinal,
        Obs: h.Observaciones
      }));
      console.log(notasArray);
      setSubjectsByStudent(notasArray);
    } catch (error) {
      console.error('Error al cargar las notas');
    }
  }
  useEffect(() => {
    const list = subjectsByStudent[selectedEstudiante] || [];
    const init = {};
    list.forEach(a => (init[a.IdMateria] = false));
  }, [selectedEstudiante, subjectsByStudent]);
   
  // Estados y datos de ejemplo
  /*const [user] = useState({ 
    name: 'Laura Perez', 
    email: 'l.perez@gmail.com'
  });*/

  /*const [estudiantes] = useState([
    { IdEstudiante: 1, Nivel: 'Secundaria', Grado: '1º A', Nombre: 'Juan', Apellido: 'Perez', color: 'primary', dni: '1234'},
    { IdEstudiante: 2, Nivel: 'Primaria' ,Grado:'2º B', Nombre: 'Maria', Apellido: 'Perez', color: 'secondary', dni:"5678"},
  ]);*/

  //const [selectedEstudiante, setSelectedEstudiante] = useState(estudiantes[0].IdEstudiante);
  
  /*const horarios = {
    1: [
      { dia: 'Lunes', hora: '08:00 - 09:30', aula: 'A101' },
      { dia: 'Miércoles', hora: '10:00 - 11:30', aula: 'A101' }
    ],
    2: [
      { dia: 'Martes', hora: '09:00 - 10:30', aula: 'B201' },
      { dia: 'Jueves', hora: '11:00 - 12:30', aula: 'B201' }
    ],
  };*/

  
  /*const [subjectsByStudent, setSubjectsByStudent] = useState({});

  useEffect(()=>{
    setSubjectsByStudent({
      1: [
        {IdMateria: "1",Materia: "Historia", Docente: "Lucas Perez", Nota:"10", Obs: "Destacado"},
        {IdMateria: "2",Materia: "Quimica", Docente: "Martin Lopez", Nota:"9", Obs: "Muy Bueno"},
        {IdMateria: "3",Materia: "Biologia", Docente: "Ana Martinez", Nota:"5" },
      ],
      2: [
        {IdMateria: "4",Materia: "Historia", Docente: "Lucas Perez", Nota:"10", Obs: "Destacado"},
        {IdMateria: "5",Materia: "Matematica", Docente: "Martin Lopez", Nota:"10", Obs: "Destacado"},
        {IdMateria: "6",Materia: "Fisica", Docente: "Ana Martinez", Nota:"10",Obs: "Destacado"},
      ]
    })
  }, []); 
*/
 
  
  // Datos de ejemplo para eventos del calendario
  const eventosPorEstudiante = {
    1: [
      {
        id: 1,
        title: 'Examen de Historia',
        start: new Date(new Date().setDate(new Date().getDate() + 1)),
        end: new Date(new Date().setDate(new Date().getDate() + 1)),
        extendedProps: {
          materia: 'Historia',
          tipo: 'examen',
          descripcion: 'Examen parcial del primer trimestre'
        },
        color: '#ef4444'
      },
      {
        id: 2,
        title: 'Entrega de Proyecto - Química',
        start: new Date(new Date().setDate(new Date().getDate() + 3)),
        end: new Date(new Date().setDate(new Date().getDate() + 3)),
        extendedProps: {
          materia: 'Química',
          tipo: 'entrega',
          descripcion: 'Proyecto de laboratorio'
        },
        color: '#3b82f6'
      },
      {
        id: 3,
        title: 'Clase Extra - Biología',
        start: new Date(new Date().setDate(new Date().getDate() + 5)),
        end: new Date(new Date().setDate(new Date().getDate() + 5)),
        extendedProps: {
          materia: 'Biología',
          tipo: 'clase',
          descripcion: 'Clase de repaso'
        },
        color: '#10b981'
      }
    ],
    2: [
      {
        id: 4,
        title: 'Examen de Matemática',
        start: new Date(new Date().setDate(new Date().getDate() + 2)),
        end: new Date(new Date().setDate(new Date().getDate() + 2)),
        extendedProps: {
          materia: 'Matemática',
          tipo: 'examen',
          descripcion: 'Examen de geometría'
        },
        color: '#ef4444'
      },
      {
        id: 5,
        title: 'Olimpíada de Física',
        start: new Date(new Date().setDate(new Date().getDate() + 6)),
        end: new Date(new Date().setDate(new Date().getDate() + 6)),
        extendedProps: {
          materia: 'Física',
          tipo: 'evento',
          descripcion: 'Competencia escolar'
        },
        color: '#8b5cf6'
      },
      {
        id: 6,
        title: 'Reunión de Padres',
        start: new Date(new Date().setDate(new Date().getDate() + 8)),
        end: new Date(new Date().setDate(new Date().getDate() + 8)),
        extendedProps: {
          materia: 'General',
          tipo: 'reunion',
          descripcion: 'Reunión informativa'
        },
        color: '#f59e0b'
      }
    ]
  };
  const [notifications] = useState(4);
  


  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  };

  return (
    <div className='bg-base-200 min-h-screen'>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Renderiza UserHeader solo si userLoaded es true */}
        {userLoaded ? (
          <UserHeader
            user={user}
            notifications={4}  // O el valor que uses
            onLogout={() => console.log("Cerrar sesión")}
            onSettings={() => console.log("Abrir configuración")}
          />
        ) : (
          <div className="bg-base-100 p-4 rounded-box shadow text-center">
            Cargando datos del usuario...
          </div>  // Muestra un mensaje de carga o nada
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
              {tab === 'absences' && (
                <AbsencesStudentTab inasistencias = {inasistencias} faltasMateria = {faltasPorMateria}/>
              )}
              {tab === 'schedule' && (
                <ScheduleTab horarios={horarios} />
              )}
              {tab === 'notes' && (
                <StudentGrade
                  materias={subjectsByStudent}
                />
              )}
              {tab === 'calendar' && (
                <CalendarTab eventos={eventosPorEstudiante[selectedEstudiante] || []} />
              )}

              {tab === 'mailbox' && (
                <MailboxTab/>
              )}
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