import { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";

import {
  Calendar,
  BookOpen,
  GraduationCap,
  FileText,
  Users,
  ClipboardList,
} from "lucide-react";

// Leyenda reutilizable
function LegendItem({ color, icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 bg-base-100 px-3 py-1 rounded-full shadow-sm">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <Icon size={16} className="text-gray-700" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

// Componente principal
export default function CalendarTab({ dniAlumno, idCurso }) {  // Agrega idCurso como prop opcional
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar eventos desde backend (elige endpoint según el prop)
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        let url;
        if (idCurso) {
          // Para directivos: eventos del curso
          url = `http://localhost:3002/api/eventos/cursos/${idCurso}`;
        } else if (dniAlumno) {
          // Para estudiantes: eventos del alumno
          url = `http://localhost:3002/api/eventos/alumnos/${dniAlumno}`;
        } else {
          throw new Error("Debe proporcionar dniAlumno o idCurso");
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener eventos");
        const data = await res.json();

        // Transformar los campos al formato esperado por FullCalendar
        const eventosTransformados = data.map((ev) => ({
          id: ev.IdEvento,
          title: ev.Titulo,
          start: ev.FechaInicio,
          end: ev.FechaFin,
          descripcion: ev.Descripcion,
          tipo: ev.Tipo,
          alcance: ev.Alcance,
          creador: ev.IdUsuarioCreador,
          allDay: true,
        }));

        setEventos(eventosTransformados);
      } catch (err) {
        console.error("Error cargando eventos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (dniAlumno || idCurso) {
      fetchEventos();
    }
  }, [dniAlumno, idCurso]);  // Dependencias actualizadas

  // El resto del código permanece igual...
  const eventosNormalizados = useMemo(() => {
    return eventos.map((e) => ({
      ...e,
      allDay: e.allDay ?? true,
      backgroundColor:
        e.tipo === "Examen"
          ? "#ef4444" // rojo
          : e.tipo === "Reunión"
          ? "#facc15" // amarillo
          : e.tipo === "Entrega"
          ? "#3b82f6" // azul
          : e.tipo === "Clase"
          ? "#22c55e" // verde
          : "#a855f7", // violeta por defecto
    }));
  }, [eventos]);

  const handleEventClick = (clickInfo) => {
    const e = clickInfo.event.extendedProps;
    const msg = [
      `📌 ${clickInfo.event.title}`,
      e.tipo && `📂 Tipo: ${e.tipo}`,
      e.descripcion && `📝 Descripción: ${e.descripcion}`,
      e.alcance && `🎯 Alcance: ${e.alcance}`,
      e.creador && `👤 Creador: ${e.creador}`,
      `📅 Fecha: ${clickInfo.event.start.toLocaleDateString("es-ES")}`,
    ]
      .filter(Boolean)
      .join("\n");

    alert(msg);
  };

  const renderEventContent = (eventInfo) => {
    const e = eventInfo.event.extendedProps;
    const mostrarMateria = e.tipo === "Examen" || e.tipo === "Clase";

    return (
      <Tippy
        content={
          <div className="p-2 text-sm max-w-xs">
            <h3 className="font-bold text-base mb-1 flex items-center gap-1">
              <Calendar size={16} /> {eventInfo.event.title}
            </h3>
            {mostrarMateria && (
              <p className="flex items-center gap-1">
                <BookOpen size={14} /> Materia relacionada
              </p>
            )}
            {e.tipo && (
              <p className="flex items-center gap-1">
                <ClipboardList size={14} /> {e.tipo}
              </p>
            )}
            {e.descripcion && (
              <p className="flex items-center gap-1">
                <FileText size={14} /> {e.descripcion}
              </p>
            )}
            <p className="flex items-center gap-1">
              <Calendar size={14} />{" "}
              {eventInfo.event.start.toLocaleDateString("es-ES")}
            </p>
          </div>
        }
        placement="top"
        theme="light-border"
        arrow={true}
        animation="shift-away"
        
      >
        <div className="p-1 truncate cursor-pointer">
          <div className="font-bold text-sm">{eventInfo.event.title}</div>
          {mostrarMateria && (
            <div className="text-xs opacity-70">Materia relacionada</div>
          )}
        </div>
      </Tippy>
    );
  };

  return (
    <div className="calendar-container">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <Calendar className="text-blue-600" size={28} />
        Calendario Académico {idCurso ? "(Curso)" : "(Alumno)"}
      </h2>

      <div className="bg-base-200 p-4 rounded-xl shadow-lg">
        {loading ? (
          <p className="text-center text-gray-500">Cargando eventos...</p>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              list: "Lista",
            }}
            locale={esLocale}
            height="auto"
            events={eventosNormalizados}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            nowIndicator={true}
            dayMaxEvents={3}
            expandRows={true}
            stickyHeaderDates={true}
          />
        )}
      </div>

      {/* Leyenda con íconos */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <LegendItem color="bg-red-500" icon={GraduationCap} text="Exámenes" />
        <LegendItem color="bg-blue-500" icon={FileText} text="Entregas" />
        <LegendItem color="bg-green-500" icon={BookOpen} text="Clases" />
        <LegendItem color="bg-purple-500" icon={Calendar} text="Eventos" />
        <LegendItem color="bg-yellow-500" icon={Users} text="Reuniones" />
      </div>
    </div>
  );
}