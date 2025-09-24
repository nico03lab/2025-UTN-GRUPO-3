import ScheduleTab from '../components/ScheduleTab';
import UserHeader from "../components/UserHeader";
import { StudentSidebar } from '../components/StudentSidebar';
import { StudentGrade } from '../components/StudentGrade';
import { useEffect, useState } from "react";

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

  const [theme, setTheme] = useState('light');
  const [notifications] = useState(4);
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const [selectedEstudiante, setSelectedEstudiante] = useState(estudiantes[0].IdEstudiante);
  const [tab, setTab] = useState('schedules');
  
  const [subjectsByStudent, setSubjectsByStudent] = useState({});
  //datos de ejemplo de materias
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
  }); 
  useEffect(() => {
    const list = subjectsByStudent[selectedEstudiante] || [];
    const init = {};
    list.forEach(a => (init[a.IdMateria] = false));
  }, [selectedEstudiante, subjectsByStudent]);

  return (
    <div className='bg-base-200'>
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
        
        {/* Alumnos-hijos */}
        <aside className="lg:col-span-1">
          <StudentSidebar
            estudiantes={estudiantes}
            selectedEstudiante={selectedEstudiante}
            setSelectedEstudiante={setSelectedEstudiante}
            tab={tab}
            setTab={setTab}
          />
        </aside>

        {/* Main */}
        <main className="lg:col-span-3">
          <div className="bg-base-100 p-4 md:p-6 rounded-box shadow">
            {/* Tabs content */}

            {tab === 'schedule' && (
              <ScheduleTab horarios={horarios[selectedEstudiante] || []} />
            )}
            {tab === 'notes' && (
              <StudentGrade
                materias={subjectsByStudent[selectedEstudiante] || []}
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
  
  )
}
