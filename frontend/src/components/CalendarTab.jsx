import { useMemo } from "react";
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

export default function CalendarTab({ eventos = [] }) {
  // Normalizar eventos
  const eventosNormalizados = useMemo(() => {
    return eventos.map((e) => ({
      ...e,
      allDay: e.allDay ?? true,
    }));
  }, [eventos]);

  // Click en evento (alert demo, podés reemplazar con modal)
  const handleEventClick = (clickInfo) => {
    const evento = clickInfo.event;
    alert(
      `📌 ${evento.title}\n` +
        `📘 Materia: ${evento.extendedProps.materia || "-"}\n` +
        `📂 Tipo: ${evento.extendedProps.tipo || "-"}\n` +
        `📝 Descripción: ${evento.extendedProps.descripcion || "-"}\n` +
        `📅 Fecha: ${evento.start.toLocaleDateString("es-ES")}`
    );
  };

  // Render visual de eventos con tooltip Tippy
  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const { materia, tipo, descripcion } = event.extendedProps;

    return (
      <Tippy
        content={
          <div className="p-2 text-sm max-w-xs">
            <h3 className="font-bold text-base mb-1 flex items-center gap-1">
              <Calendar size={16} /> {event.title}
            </h3>
            {materia && (
              <p className="flex items-center gap-1">
                <BookOpen size={14} /> {materia}
              </p>
            )}
            {tipo && (
              <p className="flex items-center gap-1">
                <ClipboardList size={14} /> {tipo}
              </p>
            )}
            {descripcion && (
              <p className="flex items-center gap-1">
                <FileText size={14} /> {descripcion}
              </p>
            )}
            <p className="flex items-center gap-1">
              <Calendar size={14} /> {event.start.toLocaleDateString("es-ES")}
            </p>
          </div>
        }
        placement="top"
        theme="light-border"
        arrow={true}
        animation="shift-away"
      >
        <div className="p-1 truncate cursor-pointer">
          <div className="font-semibold text-xs text-gray-600">
            {eventInfo.timeText}
          </div>
          <div className="font-bold text-sm">{event.title}</div>
          <div className="text-xs opacity-70">{materia}</div>
        </div>
      </Tippy>
    );
  };

  return (
    <div className="calendar-container">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <Calendar className="text-blue-600" size={28} />
        Calendario Académico
      </h2>

      <div className="bg-base-200 p-4 rounded-xl shadow-lg">
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
      </div>

      {/* Leyenda con íconos Lucide */}
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
