import React from "react";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  BookOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default function ScheduleTab({ horarios, viewMode = "cards" }) {
  if (!horarios || horarios.length === 0) {
    return (
      <div className="text-center py-10 opacity-60">
        <CalendarIcon className="h-10 w-10 mx-auto mb-2" />
        No hay horarios asignados
      </div>
    );
  }

  // Agrupar por día de semana
  const horariosPorDia = horarios.reduce((acc, h) => {
    const dia = h.dia.trim();
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(h);
    return acc;
  }, {});

  const ordenDias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

  return (
    <section>
      <div className="text-sm opacity-70 mb-4 flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        {viewMode === "cards" ? "Horarios del curso seleccionado" : "Todos los horarios del docente"}
      </div>

      {viewMode === "cards" ? (
        // Vista en tarjetas (curso seleccionado)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {horarios.map((h, idx) => (
            <div
              key={idx}
              className="p-4 rounded-box bg-primary bg-opacity-10 border border-primary"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-primary">{h.dia}</div>
                <div className="p-1 bg-primary bg-opacity-20 rounded-box">
                  <ClockIcon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="text-sm opacity-70 mb-1">{h.hora}</div>
              <div className="text-xs opacity-70 flex items-center gap-1 mb-1">
                <BookOpenIcon className="h-4 w-4" />
                {h.materia}
              </div>
              <div className="text-xs opacity-50 flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                Aula {h.aula}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vista lista agrupada por día
        <div className="space-y-5">
          {ordenDias.map((dia) => {
            const items = horariosPorDia[dia];
            if (!items) return null;

            return (
              <div key={dia} className="bg-base-200 rounded-box p-4 shadow">
                <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {dia}
                </h3>
                <ul className="divide-y divide-base-300">
                  {items.map((h, i) => (
                    <li
                      key={i}
                      className="py-2 flex justify-between items-center text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {h.materia} • {h.IdCurso}
                        </span>
                        <span className="opacity-70 flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          Aula {h.aula}
                        </span>
                      </div>
                      <div className="text-right opacity-80">{h.hora}</div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
