import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { StudentSidebar } from "../components/StudentSidebar";
import ScheduleTab from "../components/ScheduleTab";
import CalendarTab from "../components/CalendarTab";
import { StudentGrade } from "../components/StudentGrade";
import MailboxTab from "../components/MailBoxTab";

export const AlumnosPage = () => {
  // Datos simulados — luego se reemplazarán con llamadas backend
  const [user] = useState({
    name: "Juan Perez",
    email: "juan.perez@colegio.edu",
    idUsuario: 101,
    dni: "12345678",
  });

  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const [notifications] = useState(3);

  // TAB seleccionado
  const [tab, setTab] = useState("schedule");

  // Horario del alumno
  const [horario, setHorario] = useState([]);
  // Calificaciones
  const [materias, setMaterias] = useState([]);
  // Eventos del calendario
  const [eventos, setEventos] = useState([]);
  // Asistencias
  const [asistencias, setAsistencias] = useState([]);
  // Notificaciones
  const [notificaciones, setNotificaciones] = useState([]);

  // Simulación de fetchs (futuros endpoints)
  useEffect(() => {
    // 🔹 Horario
    setHorario([
      { dia: "Lunes", hora: "08:00 - 09:30", materia: "Matemática", aula: "A101" },
      { dia: "Martes", hora: "10:00 - 11:30", materia: "Historia", aula: "B202" },
      { dia: "Miércoles", hora: "08:00 - 09:30", materia: "Inglés", aula: "A102" },
    ]);

    // 🔹 Calificaciones
    setMaterias([
      { IdMateria: 1, Materia: "Matemática", Docente: "Martín López", Nota: "8", Obs: "Buen desempeño" },
      { IdMateria: 2, Materia: "Historia", Docente: "Laura Gómez", Nota: "10", Obs: "Excelente" },
      { IdMateria: 3, Materia: "Inglés", Docente: "Ana Torres", Nota: "9", Obs: "Muy bueno" },
    ]);

    // 🔹 Eventos (proximamente desde backend /api/eventos/alumno/:id)
    setEventos([
      {
        id: 1,
        title: "Entrega de Proyecto de Matemática",
        start: new Date(),
        end: new Date(),
        extendedProps: {
          materia: "Matemática",
          tipo: "entrega",
          descripcion: "Proyecto final de geometría",
        },
        color: "#3b82f6",
      },
      {
        id: 2,
        title: "Examen de Historia",
        start: new Date(new Date().setDate(new Date().getDate() + 2)),
        end: new Date(new Date().setDate(new Date().getDate() + 2)),
        extendedProps: {
          materia: "Historia",
          tipo: "examen",
          descripcion: "Parcial del segundo trimestre",
        },
        color: "#ef4444",
      },
    ]);

    // 🔹 Asistencias (presente/ausente)
    setAsistencias([
      { fecha: "2025-10-10", materia: "Historia", estado: "Presente" },
      { fecha: "2025-10-11", materia: "Matemática", estado: "Ausente" },
      { fecha: "2025-10-12", materia: "Inglés", estado: "Presente" },
    ]);

    // 🔹 Notificaciones
    setNotificaciones([
      { id: 1, mensaje: "Recordatorio: entrega de proyecto el lunes", fecha: "2025-10-11", tipo: "Aviso" },
      { id: 2, mensaje: "Se publica nueva nota en Matemática", fecha: "2025-10-10", tipo: "Nota" },
      { id: 3, mensaje: "Reunión general el viernes", fecha: "2025-10-09", tipo: "Evento" },
    ]);
  }, []);

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* HEADER */}
        <UserHeader
          user={user}
          notifications={notifications}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={() => console.log("Cerrar sesión")}
          onSettings={() => console.log("Abrir configuración")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <StudentSidebar
              estudiantes={[{ ...user, Nombre: user.name, Grado: "4°A" }]}
              selectedEstudiante={user.idUsuario}
              setSelectedEstudiante={() => {}}
              tab={tab}
              setTab={setTab}
            />
          </aside>

          {/* MAIN */}
          <main className="lg:col-span-3">
            <div className="bg-base-100 p-4 md:p-6 rounded-box shadow">
              {tab === "schedule" && <ScheduleTab horarios={horario} />}

              {tab === "notes" && <StudentGrade materias={materias} />}

              {tab === "attendance" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Asistencias</h2>
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Materia</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asistencias.map((a, i) => (
                        <tr key={i}>
                          <td>{a.fecha}</td>
                          <td>{a.materia}</td>
                          <td
                            className={
                              a.estado === "Presente"
                                ? "text-green-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            {a.estado}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === "calendar" && <CalendarTab eventos={eventos} />}

              {tab === "mailbox" && <MailboxTab />}

              {tab === "notifications" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
                  <ul className="space-y-3">
                    {notificaciones.map((n) => (
                      <li
                        key={n.id}
                        className="p-3 rounded-lg bg-base-200 shadow-sm flex justify-between"
                      >
                        <div>
                          <p className="font-semibold">{n.tipo}</p>
                          <p>{n.mensaje}</p>
                        </div>
                        <span className="text-xs opacity-60">{n.fecha}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
