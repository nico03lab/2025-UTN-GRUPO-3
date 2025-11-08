import ScheduleTab from "../components/ScheduleTab";
import UserHeader from "../components/UserHeader";
import { StudentSidebar } from "../components/StudentSidebar";
import { StudentGrade } from "../components/StudentGrade";
import CalendarTab from "../components/CalendarTab";
import { useEffect, useState } from "react";
import MailboxTab from "../components/MailBoxTab";
import { useAuth } from "../context/AuthContext";
import {padreController } from ("../controllers/tutoresController");

export const TutoresPage = () => {
  // Estados y datos de ejemplo
  const [theme, setTheme] = useState("light");
  const { user, ready, logout } = useAuth();
  const [userData, setUserData] = useState(null);

  const cargarTutor = async () => {
    try {
      const response = await padreController.getTutorCompleto(user.userId);
      const tutorData = response.data;
      console.log(response.data);
      setUserData({
        dni: tutorData.DNITutor,
        userId: tutorData.IdUsuario,
        name: `${tutorData.Nombre} ${tutorData.Apellido}`,
        email: tutorData.Email,
      });
    } catch (err) {
      console.error("Error al cargar tutor:", err);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const [selectedEstudiante, setSelectedEstudiante] = useState(
    estudiantes[0].IdEstudiante
  );
  const [tab, setTab] = useState("schedules");
  const [subjectsByStudent, setSubjectsByStudent] = useState({});

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-4 text-lg">Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <UserHeader
          user={user}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={logout}
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
              {tab === "schedule" && (
                <ScheduleTab horarios={horarios[selectedEstudiante] || []} />
              )}
              {tab === "notes" && (
                <StudentGrade
                  materias={subjectsByStudent[selectedEstudiante] || []}
                />
              )}
              {tab === "calendar" && (
                <CalendarTab
                  eventos={eventosPorEstudiante[selectedEstudiante] || []}
                />
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
