import ScheduleTab from '../components/ScheduleTab';
import UserHeader from "../components/UserHeader";
import { StudentSidebar } from '../components/StudentSidebar';
import { StudentGrade } from '../components/StudentGrade';
import CalendarTab from '../components/CalendarTab';
import { useEffect, useState } from "react";
import MailboxTab from '../components/MailBoxTab';

export const EstudiantesPage = () => {
  // Estados y datos de ejemplo
  const [user] = useState({ 
    name: 'Laura Perez', 
    email: 'l.perez@gmail.com'
  });
  const [estudiantes] = useState([
    { IdEstudiante: 1, Nivel: 'Secundaria', Grado: '1º A', Nombre: 'Juan', Apellido: 'Perez', color: 'primary', dni: '1234'},
    { IdEstudiante: 2, Nivel: 'Primaria' ,Grado:'2º B', Nombre: 'Maria', Apellido: 'Perez', color: 'secondary', dni:"5678"},
  ]);
  
  const horarios = {
    1: [
      { dia: 'Lunes', hora: '08:00 - 09:30', aula: 'A101' },
      { dia: 'Miércoles', hora: '10:00 - 11:30', aula: 'A101' }
    ],
    2: [
      { dia: 'Martes', hora: '09:00 - 10:30', aula: 'B201' },
      { dia: 'Jueves', hora: '11:00 - 12:30', aula: 'B201' }
    ],
  };

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

  const [theme, setTheme] = useState('light');
  const [notifications] = useState(4);
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const [selectedEstudiante, setSelectedEstudiante] = useState(estudiantes[0].IdEstudiante);
  const [tab, setTab] = useState('schedules');
  
  const [subjectsByStudent, setSubjectsByStudent] = useState({});

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

  useEffect(() => {
    const list = subjectsByStudent[selectedEstudiante] || [];
    const init = {};
    list.forEach(a => (init[a.IdMateria] = false));
  }, [selectedEstudiante, subjectsByStudent]);

  return (
    <div className='bg-base-200 min-h-screen'>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <UserHeader
          user={user}
          notifications={notifications}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={() => console.log("Cerrar sesión")}
          onSettings={() => console.log("Abrir configuración")}
        />
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

              {tab === 'schedule' && (
                <ScheduleTab horarios={horarios[selectedEstudiante] || []} />
              )}
              {tab === 'notes' && (
                <StudentGrade
                  materias={subjectsByStudent[selectedEstudiante] || []}
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