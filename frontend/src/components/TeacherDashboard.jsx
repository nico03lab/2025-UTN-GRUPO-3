import React, { useEffect, useState } from 'react';
import AttendanceTab from './AttendanceTab';
import ScheduleTab from './ScheduleTab';
import GradesTab from './GradesTab';
import UserHeader from "../components/UserHeader";
import CourseSidebar from "../components/CourseSidebar";
import StatsPanel from "../components/Statspanel";

export default function TeacherDashboard() {
  // Estados
  const [user] = useState({ 
    name: 'Prof. Martín López', 
    email: 'm.lopez@colegio.edu'
  });
  
  const [cursos] = useState([
    { IdCurso: 1, Nivel: '1º A', Materia: 'Matemática', color: 'primary', alumnos: 28 },
    { IdCurso: 2, Nivel: '2º B', Materia: 'Historia', color: 'secondary', alumnos: 24 },
    { IdCurso: 3, Nivel: '3º C', Materia: 'Física', color: 'accent', alumnos: 26 }
  ]);

  const [selectedCurso, setSelectedCurso] = useState(cursos[0].IdCurso);
  const [tab, setTab] = useState('attendance');
  const [alumnosByCurso, setAlumnosByCurso] = useState({});
  const [attendance, setAttendance] = useState({});
  const [grades, setGrades] = useState({});
  const [theme, setTheme] = useState('light');
  const [notifications] = useState(3);

  // Datos de ejemplo con fotos de perfil
  useEffect(() => {
    setAlumnosByCurso({
      1: [
        { DNI: '20123456', Apellido: 'García', Nombres: 'Lucía', Avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' },
        { DNI: '20345678', Apellido: 'Fernández', Nombres: 'Bruno', Avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' },
        { DNI: '20456789', Apellido: 'Sánchez', Nombres: 'María', Avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' },
        { DNI: '20567890', Apellido: 'Pérez', Nombres: 'Sofía', Avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' },
        { DNI: '20678901', Apellido: 'Torres', Nombres: 'Diego', Avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' }
      ],
      2: [
        { DNI: '20789012', Apellido: 'Romero', Nombres: 'Paula', Avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' },
        { DNI: '20890123', Apellido: 'López', Nombres: 'Mateo', Avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' },
        { DNI: '20901234', Apellido: 'Rossi', Nombres: 'Camila', Avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' }
      ],
      3: [
        { DNI: '21012345', Apellido: 'Gómez', Nombres: 'Juan', Avatar: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' },
        { DNI: '21123456', Apellido: 'Díaz', Nombres: 'Valentina', Avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' },
        { DNI: '21234567', Apellido: 'Martínez', Nombres: 'Thiago', Avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' },
        { DNI: '21345678', Apellido: 'Alvarez', Nombres: 'Emma', Avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80' }
      ]
    });
  }, []);

  useEffect(() => {
    const list = alumnosByCurso[selectedCurso] || [];
    const init = {};
    list.forEach(a => (init[a.DNI] = false));
    setAttendance(init);
  }, [selectedCurso, alumnosByCurso]);

  useEffect(() => {
    const list = alumnosByCurso[selectedCurso] || [];
    const init = {};
    list.forEach(a => (init[a.DNI] = { nota: '', obs: '' }));
    setGrades(init);
  }, [selectedCurso, alumnosByCurso]);

  const toggleAttendance = (dni) => {
    setAttendance(prev => ({ ...prev, [dni]: !prev[dni] }));
  };

  const saveAttendance = () => {
    const payload = {
      curso: selectedCurso,
      fecha: new Date().toISOString().split('T')[0],
      asistencia: Object.entries(attendance).map(([DNI, Presente]) => ({ DNI, Presente: Presente ? 1 : 0 }))
    };
    console.log('Enviar a backend ->', payload);
    // Mostrar toast
    const toast = document.getElementById('toast');
    toast.classList.add('alert-success', 'show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };

  const setGrade = (dni, value) => {
    setGrades(prev => ({ ...prev, [dni]: { ...prev[dni], nota: value } }));
  };

  const setObs = (dni, value) => {
    setGrades(prev => ({ ...prev, [dni]: { ...prev[dni], obs: value } }));
  };

  const saveGrades = () => {
    const payload = { curso: selectedCurso, calificaciones: grades };
    console.log('Enviar calificaciones ->', payload);
    // Mostrar toast
    const toast = document.getElementById('toast');
    toast.classList.add('alert-success', 'show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };

  const horarios = {
    1: [
      { dia: 'Lunes', hora: '08:00 - 09:30', aula: 'A101' },
      { dia: 'Miércoles', hora: '10:00 - 11:30', aula: 'A101' }
    ],
    2: [
      { dia: 'Martes', hora: '09:00 - 10:30', aula: 'B201' },
      { dia: 'Jueves', hora: '11:00 - 12:30', aula: 'B201' }
    ],
    3: [
      { dia: 'Viernes', hora: '13:00 - 14:30', aula: 'C303' }
    ]
  };

  // Estadísticas para la barra lateral
  const stats = {
    totalAlumnos: 78,
    asistenciaPromedio: 92,
    calificacionPromedio: 7.8
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-base-200">
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
            theme={theme}
            toggleTheme={toggleTheme}
            onLogout={() => console.log("Cerrar sesión")}
            onSettings={() => console.log("Abrir configuración")}
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
              {tab === 'attendance' && (
                <AttendanceTab 
                    alumnos={alumnosByCurso[selectedCurso] || []}
                    attendance={attendance}
                    toggleAttendance={toggleAttendance}
                    saveAttendance={saveAttendance}
                    setAttendance={setAttendance}
                />
              )}

              {tab === 'schedule' && (
                <ScheduleTab horarios={horarios[selectedCurso] || []} />
              )}

              {tab === 'grades' && (
                <GradesTab 
                  alumnos={alumnosByCurso[selectedCurso] || []}
                  grades={grades}
                  setGrade={setGrade}
                  setObs={setObs}
                  saveGrades={saveGrades}
                  setGrades={setGrades}
                />
              )}
            </div>

            {/* Footer con información adicional */}
            <div className="mt-6 bg-base-100 p-4 rounded-box shadow text-center text-sm opacity-70">
              Sistema de Gestión Escolar • {new Date().getFullYear()} • Cole App
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}