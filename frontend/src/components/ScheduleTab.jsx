import React from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function ScheduleTab({ horarios }) {
  return (
    <section>
      <div className="text-sm opacity-70 mb-4 flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        Horarios asignados
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(horarios || []).map((h, idx) => (
          <div key={idx} className="p-4 rounded-box bg-primary bg-opacity-10 border border-primary">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-primary">{h.dia}</div>
              <div className="p-1 bg-primary bg-opacity-20 rounded-box">
                <ClockIcon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-sm opacity-70 mb-2">{h.hora}</div>
            <div className="text-xs opacity-50 flex items-center gap-1">
              <MapPinIcon className="h-5 w-5" />
              Aula: {h.aula}
            </div>
          </div>
        ))}
        {(!horarios || horarios.length === 0) && (
          <div className="col-span-3 text-center py-8 opacity-50">
            <CalendarIcon className="h-12 w-12 mx-auto mb-3" />
            No hay horarios asignados para este curso
          </div>
        )}
      </div>
    </section>
  );
}
