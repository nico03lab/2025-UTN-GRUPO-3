import React, { useEffect, useState } from 'react';
import { User, Calendar, CheckSquare, FileText, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

// TeacherDashboard.jsx
// Single-file React component (Tailwind CSS) that simulates a professional
// teacher view: mock login header, attendance, schedule and grading.
// Drop this file in src/components/TeacherDashboard.jsx and render it from App.

export default function TeacherDashboard() {
  // --- Mock user (simulado, ya que el login aún no está implementado) ---
  const [user] = useState({ name: 'Prof. Martín López', email: 'm.lopez@colegio.edu' });

  // --- Mock data: cursos que dicta el docente ---
  const [cursos] = useState([
    { IdCurso: 1, Nivel: '1º A', Materia: 'Matemática' },
    { IdCurso: 2, Nivel: '2º B', Materia: 'Historia' },
    { IdCurso: 3, Nivel: '3º C', Materia: 'Física' }
  ]);

  // --- Estado global ---
  const [selectedCurso, setSelectedCurso] = useState(cursos[0].IdCurso);
  const [tab, setTab] = useState('attendance'); // 'attendance' | 'schedule' | 'grades'

  // --- Mock alumnos por curso (normalmente vendría del backend) ---
  const [alumnosByCurso, setAlumnosByCurso] = useState({});
  useEffect(() => {
    // Simula carga inicial de alumnos
    setAlumnosByCurso({
      1: [
        { DNI: '20123456', Apellido: 'García', Nombres: 'Lucía' },
        { DNI: '20345678', Apellido: 'Fernández', Nombres: 'Bruno' },
        { DNI: '20456789', Apellido: 'Sánchez', Nombres: 'María' }
      ],
      2: [
        { DNI: '20567890', Apellido: 'Pérez', Nombres: 'Sofía' },
        { DNI: '20678901', Apellido: 'Torres', Nombres: 'Diego' }
      ],
      3: [
        { DNI: '20789012', Apellido: 'Romero', Nombres: 'Paula' },
        { DNI: '20890123', Apellido: 'López', Nombres: 'Mateo' },
        { DNI: '20901234', Apellido: 'Rossi', Nombres: 'Camila' }
      ]
    });
  }, []);

  // --- Attendance state: objeto {DNI: boolean} ---
  const [attendance, setAttendance] = useState({});

  // Cuando cambia curso seleccionado, inicializar asistencia
  useEffect(() => {
    const list = alumnosByCurso[selectedCurso] || [];
    const init = {};
    list.forEach(a => (init[a.DNI] = false));
    setAttendance(init);
  }, [selectedCurso, alumnosByCurso]);

  const toggleAttendance = (dni) => {
    setAttendance(prev => ({ ...prev, [dni]: !prev[dni] }));
  };

  const saveAttendance = () => {
    // Aquí harías un POST a tu backend. Simulamos con un console.log y animación.
    const payload = {
      curso: selectedCurso,
      fecha: new Date().toISOString().split('T')[0],
      asistencia: Object.entries(attendance).map(([DNI, Presente]) => ({ DNI, Presente: Presente ? 1 : 0 }))
    };
    console.log('Enviar a backend ->', payload);
    alert('Asistencia guardada (simulada) ✅');
  };

  // --- Horario mock ---
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

  // --- Calificaciones state ---
  const [grades, setGrades] = useState({});
  useEffect(() => {
    // Inicializa notas por curso (simulado)
    const list = alumnosByCurso[selectedCurso] || [];
    const init = {};
    list.forEach(a => (init[a.DNI] = { nota: '', obs: '' }));
    setGrades(init);
  }, [selectedCurso, alumnosByCurso]);

  const setGrade = (dni, value) => {
    setGrades(prev => ({ ...prev, [dni]: { ...prev[dni], nota: value } }));
  };
  const setObs = (dni, value) => {
    setGrades(prev => ({ ...prev, [dni]: { ...prev[dni], obs: value } }));
  };

  const saveGrades = () => {
    const payload = { curso: selectedCurso, calificaciones: grades };
    console.log('Enviar calificaciones ->', payload);
    alert('Calificaciones guardadas (simulado) ✅');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold">M</div>
            <div>
              <div className="text-lg font-semibold">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Simulación de sesión</div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-100">
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-3 bg-white rounded-2xl p-4 shadow-sm">
            <div className="mb-4 text-sm text-gray-500">Cursos asignados</div>
            <div className="space-y-2">
              {cursos.map(c => (
                <button
                  key={c.IdCurso}
                  onClick={() => { setSelectedCurso(c.IdCurso); setTab('attendance'); }}
                  className={`w-full text-left px-3 py-2 rounded-lg ${selectedCurso === c.IdCurso ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50'}`}>
                  <div className="text-sm font-medium">{c.Materia} • {c.Nivel}</div>
                  <div className="text-xs text-gray-400">Curso ID: {c.IdCurso}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 text-sm space-y-2">
              <button onClick={() => setTab('attendance')} className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg ${tab === 'attendance' ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                <CheckSquare size={16} /> Pasar Asistencia
              </button>
              <button onClick={() => setTab('schedule')} className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg ${tab === 'schedule' ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                <Calendar size={16} /> Ver Horarios
              </button>
              <button onClick={() => setTab('grades')} className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg ${tab === 'grades' ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                <FileText size={16} /> Calificar Alumnos
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="col-span-9">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm">
              {/* Top: curso seleccionado */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs text-gray-400">Curso seleccionado</div>
                  <div className="text-xl font-semibold">{cursos.find(c => c.IdCurso === selectedCurso)?.Materia} • {cursos.find(c => c.IdCurso === selectedCurso)?.Nivel}</div>
                </div>
                <div className="text-sm text-gray-500">ID: {selectedCurso}</div>
              </div>

              {/* Tabs content */}
              {tab === 'attendance' && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">Pasar asistencia</div>
                    <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
                  </div>

                  <div className="space-y-3">
                    {(alumnosByCurso[selectedCurso] || []).map(a => (
                      <div key={a.DNI} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <div className="font-medium">{a.Apellido}, {a.Nombres}</div>
                          <div className="text-xs text-gray-400">DNI: {a.DNI}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-600">Presente</label>
                          <input type="checkbox" checked={!!attendance[a.DNI]} onChange={() => toggleAttendance(a.DNI)} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={saveAttendance} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Guardar asistencia</button>
                    <button onClick={() => { const init = {}; (alumnosByCurso[selectedCurso] || []).forEach(a => init[a.DNI] = false); setAttendance(init); }} className="px-4 py-2 rounded-md border">Limpiar</button>
                  </div>
                </section>
              )}

              {tab === 'schedule' && (
                <section>
                  <div className="text-sm text-gray-600 mb-4">Horarios asignados</div>
                  <div className="grid grid-cols-2 gap-3">
                    {(horarios[selectedCurso] || []).map((h, idx) => (
                      <div key={idx} className="p-3 rounded-lg border">
                        <div className="font-medium">{h.dia}</div>
                        <div className="text-sm text-gray-600">{h.hora}</div>
                        <div className="text-xs text-gray-400">Aula: {h.aula}</div>
                      </div>
                    ))}
                    {(!horarios[selectedCurso] || horarios[selectedCurso].length === 0) && <div className="col-span-2 text-gray-500">No hay horarios asignados para este curso</div>}
                  </div>
                </section>
              )}

              {tab === 'grades' && (
                <section>
                  <div className="text-sm text-gray-600 mb-4">Calificar alumnos</div>
                  <div className="space-y-3">
                    {(alumnosByCurso[selectedCurso] || []).map(a => (
                      <div key={a.DNI} className="p-3 rounded-lg border flex items-center justify-between gap-4">
                        <div>
                          <div className="font-medium">{a.Apellido}, {a.Nombres}</div>
                          <div className="text-xs text-gray-400">DNI: {a.DNI}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <input type="number" placeholder="Nota" value={grades[a.DNI]?.nota || ''} onChange={e => setGrade(a.DNI, e.target.value)} className="w-24 p-2 border rounded-md" />
                          <input type="text" placeholder="Observaciones" value={grades[a.DNI]?.obs || ''} onChange={e => setObs(a.DNI, e.target.value)} className="p-2 border rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={saveGrades} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Guardar calificaciones</button>
                    <button onClick={() => { const init = {}; (alumnosByCurso[selectedCurso] || []).forEach(a => init[a.DNI] = { nota: '', obs: '' }); setGrades(init); }} className="px-4 py-2 rounded-md border">Limpiar</button>
                  </div>
                </section>
              )}
            </motion.div>

          </main>
        </div>
      </div>
    </div>
  );
}
