import React, { useEffect, useState } from 'react';
import AttendanceTab from './AttendanceTab';
import ScheduleTab from './ScheduleTab';
import GradesTab from './GradesTab';
import UserHeader from "../components/UserHeader";
import CourseSidebar from "../components/CourseSidebar";
import StatsPanel from "../components/Statspanel";
import axios from 'axios';

export default function TeacherDashboard() {
  // Estados
  const [user] = useState({ 
    dni: '30111222',
    id: 'doc-001',
    name: 'Prof. Martín López', 
    email: 'm.lopez@colegio.edu'
  });
  
  const [cursos, setCursos] = useState([]);

useEffect(() => {
  axios.get(`http://localhost:3002/api/cursos/${user.dni}`)
    .then(res => setCursos(res.data))
    .catch(err => console.error(err));
}, [user.dni]);

const [selectedCurso, setSelectedCurso] = useState(null);

useEffect(() => {
  if (cursos.length > 0 && !selectedCurso) {
    setSelectedCurso(cursos[0].IdCurso);
  }
}, [cursos, selectedCurso]);


  const [tab, setTab] = useState('attendance');
  const [alumnosByCurso, setAlumnosByCurso] = useState({});
  const [attendance, setAttendance] = useState({});
  const [grades, setGrades] = useState({});
  const [theme, setTheme] = useState('light');
  const [notifications] = useState(3);

  // Obtener alumnos del curso seleccionado
  useEffect(() => {
    if (selectedCurso) {
      axios.get(`http://localhost:3002/api/alumnos/${selectedCurso}`)
        .then(res => {
          setAlumnosByCurso(res.data);
          const initAttendance = {};
          res.data.forEach(a => initAttendance[a.DNI] = false);
          setAttendance(initAttendance);
        })
        .catch(err => console.error(err));
    } else {
      setAlumnosByCurso([]);
      setAttendance({});
    }
  }, [selectedCurso]);

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
                    alumnos={alumnosByCurso}
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
                  alumnos={alumnosByCurso}
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