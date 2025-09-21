import React, { useEffect, useState } from 'react';

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
  const [notifications, setNotifications] = useState(3);

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
        {/* Header */}
        <header className="flex items-center justify-between mb-6 bg-base-100 p-4 rounded-box shadow">
          <div className="flex items-center gap-4">
            <div className="avatar online">
              <div className="w-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-lg font-semibold">
                {user.name.charAt(0)}
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold">{user.name}</div>
              <div className="text-sm opacity-70">{user.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm opacity-70 hidden md:block">Sistema Docente</div>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifications > 0 && (
                    <span className="badge badge-xs badge-primary indicator-item">{notifications}</span>
                  )}
                </div>
              </div>
              <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
                <div className="card-body">
                  <span className="font-bold text-lg">{notifications} Notificaciones</span>
                  <span className="text-info">Tienes mensajes sin leer</span>
                </div>
              </div>
            </div>
            <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>

            </button>

            <button className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor">
                            <path strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M11.983 13.953a2.97 2.97 0 100-5.94 2.97 2.97 0 000 5.94zM20.354 9.354a1 1 0 00-.707-1.707l-1.517-.088a7.963 7.963 0 00-.694-1.693l.898-1.318a1 1 0 00-1.309-1.456l-1.349.677a7.96 7.96 0 00-1.8-1.04l-.26-1.473A1 1 0 0012 1h0a1 1 0 00-.985.82l-.26 1.473a7.96 7.96 0 00-1.8 1.04l-1.349-.677a1 1 0 00-1.309 1.456l.898 1.318c-.3.545-.536 1.112-.694 1.693l-1.517.088a1 1 0 00-.707 1.707l1.085 1.085c-.068.557-.068 1.117 0 1.674l-1.085 1.085a1 1 0 00.707 1.707l1.517.088c.158.581.394 1.148.694 1.693l-.898 1.318a1 1 0 001.309 1.456l1.349-.677c.545.3 1.112.536 1.8 1.04l.26 1.473A1 1 0 0012 23h0a1 1 0 00.985-.82l.26-1.473c.688-.504 1.255-.74 1.8-1.04l1.349.677a1 1 0 001.309-1.456l-.898-1.318c.3-.545.536-1.112.694-1.693l1.517-.088a1 1 0 00.707-1.707l-1.085-1.085c.068-.557.068-1.117 0-1.674l1.085-1.085z" />
                        </svg>
            </button>

            <button className="btn btn-outline btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-base-100 rounded-box p-4 shadow">
              <div className="text-sm opacity-70 mb-4">Cursos asignados</div>
              <div className="space-y-2">
                {cursos.map(c => (
                  <button
                    key={c.IdCurso}
                    onClick={() => { setSelectedCurso(c.IdCurso); setTab('attendance'); }}
                    className={`w-full text-left p-3 rounded-box flex items-center gap-3 ${selectedCurso === c.IdCurso ? 
                      `bg-${c.color} text-${c.color}-content` : 
                      'hover:bg-base-200'}`}
                  >
                    <div className={`bg-${c.color} bg-opacity-20 p-2 rounded-box`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{c.Materia} • {c.Nivel}</div>
                      <div className="text-xs opacity-70">{c.alumnos} alumnos</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t pt-4 opacity-70 text-sm space-y-2">
                <button 
                  onClick={() => setTab('attendance')} 
                  className={`flex items-center gap-3 w-full p-2 rounded-box ${tab === 'attendance' ? 
                    'bg-primary text-primary-content' : 
                    'hover:bg-base-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Pasar Asistencia
                </button>
                
                <button 
                  onClick={() => setTab('schedule')} 
                  className={`flex items-center gap-3 w-full p-2 rounded-box ${tab === 'schedule' ? 
                    'bg-secondary text-secondary-content' : 
                    'hover:bg-base-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Ver Horarios
                </button>
                
                <button 
                  onClick={() => setTab('grades')} 
                  className={`flex items-center gap-3 w-full p-2 rounded-box ${tab === 'grades' ? 
                    'bg-accent text-accent-content' : 
                    'hover:bg-base-200'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
                  </svg>
                  Calificar Alumnos
                </button>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="mt-6 bg-base-100 rounded-box p-4 shadow">
              <div className="mb-3 text-sm font-medium opacity-70">Estadísticas</div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-box bg-primary bg-opacity-20">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm">Total alumnos</span>
                  </div>
                  <span className="font-semibold text-primary">{stats.totalAlumnos}</span>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-box bg-success bg-opacity-20">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Asistencia promedio</span>
                  </div>
                  <span className="font-semibold text-success">{stats.asistenciaPromedio}%</span>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-box bg-warning bg-opacity-20">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    <span className="text-sm">Calificación promedio</span>
                  </div>
                  <span className="font-semibold text-warning">{stats.calificacionPromedio}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="lg:col-span-3">
            <div className="bg-base-100 p-4 md:p-6 rounded-box shadow">
              {/* Top: curso seleccionado */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs opacity-70">Curso seleccionado</div>
                  <div className="text-xl font-semibold flex items-center gap-2">
                    {cursos.find(c => c.IdCurso === selectedCurso)?.Materia} • {cursos.find(c => c.IdCurso === selectedCurso)?.Nivel}
                    <span className="badge badge-primary badge-sm">
                      {alumnosByCurso[selectedCurso]?.length || 0} alumnos
                    </span>
                  </div>
                </div>
                <div className="text-sm opacity-70 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* Tabs content */}
              {tab === 'attendance' && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm opacity-70 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Pasar asistencia del día
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge badge-success badge-sm">
                        {Object.values(attendance).filter(Boolean).length} presentes
                      </span>
                      <span className="badge badge-error badge-sm">
                        {Object.values(attendance).length - Object.values(attendance).filter(Boolean).length} ausentes
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(alumnosByCurso[selectedCurso] || []).map(a => (
                      <div 
                        key={a.DNI}
                        className={`p-3 rounded-box border flex items-center justify-between ${
                          attendance[a.DNI] ? 'bg-success bg-opacity-10 border-success' : 'bg-error bg-opacity-10 border-error'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 rounded-full">
                              <img src={a.Avatar} alt={`${a.Nombres} ${a.Apellido}`} />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{a.Apellido}, {a.Nombres}</div>
                            <div className="text-xs opacity-70">DNI: {a.DNI}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-sm">{attendance[a.DNI] ? 'Presente ✅' : 'Ausente ❌'}</label>
                          <input 
                            type="checkbox" 
                            className="toggle toggle-success"
                            checked={!!attendance[a.DNI]} 
                            onChange={() => toggleAttendance(a.DNI)} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button 
                      onClick={saveAttendance} 
                      className="btn btn-primary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar asistencia
                    </button>
                    <button 
                      onClick={() => { 
                        const init = {}; 
                        (alumnosByCurso[selectedCurso] || []).forEach(a => init[a.DNI] = false); 
                        setAttendance(init); 
                      }} 
                      className="btn btn-outline"
                    >
                      Limpiar
                    </button>
                  </div>
                </section>
              )}

              {tab === 'schedule' && (
                <section>
                  <div className="text-sm opacity-70 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Horarios asignados
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(horarios[selectedCurso] || []).map((h, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-box bg-primary bg-opacity-10 border border-primary"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-primary">{h.dia}</div>
                          <div className="p-1 bg-primary bg-opacity-20 rounded-box">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-sm opacity-70 mb-2">{h.hora}</div>
                        <div className="text-xs opacity-50 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Aula: {h.aula}
                        </div>
                      </div>
                    ))}
                    {(!horarios[selectedCurso] || horarios[selectedCurso].length === 0) && (
                      <div className="col-span-3 text-center py-8 opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        No hay horarios asignados para este curso
                      </div>
                    )}
                  </div>
                </section>
              )}

              {tab === 'grades' && (
                <section>
                  <div className="text-sm opacity-70 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
                    </svg>
                    Calificar alumnos
                  </div>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Alumno</th>
                          <th>Nota</th>
                          <th>Observaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(alumnosByCurso[selectedCurso] || []).map(a => (
                          <tr key={a.DNI}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="avatar">
                                  <div className="w-12 rounded-full">
                                    <img src={a.Avatar} alt={`${a.Nombres} ${a.Apellido}`} />
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold">{a.Apellido}, {a.Nombres}</div>
                                  <div className="text-sm opacity-50">DNI: {a.DNI}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <input 
                                type="number" 
                                placeholder="0-10" 
                                min="0" 
                                max="10"
                                step="0.5"
                                value={grades[a.DNI]?.nota || ''} 
                                onChange={e => setGrade(a.DNI, e.target.value)} 
                                className="input input-bordered w-20"
                              />
                              {grades[a.DNI]?.nota >= 7 && (
                                <div className="text-success text-xs mt-1 flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                  Buen desempeño
                                </div>
                              )}
                            </td>
                            <td>
                              <input 
                                type="text" 
                                placeholder="Observaciones" 
                                value={grades[a.DNI]?.obs || ''} 
                                onChange={e => setObs(a.DNI, e.target.value)} 
                                className="input input-bordered w-full"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button 
                      onClick={saveGrades} 
                      className="btn btn-success"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Guardar calificaciones
                    </button>
                    <button 
                      onClick={() => { 
                        const init = {}; 
                        (alumnosByCurso[selectedCurso] || []).forEach(a => init[a.DNI] = { nota: '', obs: '' }); 
                        setGrades(init); 
                      }} 
                      className="btn btn-outline"
                    >
                      Limpiar
                    </button>
                  </div>
                </section>
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