import React from "react";
import { UserGroupIcon, CheckBadgeIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function StatsPanel({ stats }) {
  return (
    <div className="mt-6 bg-base-100 rounded-box p-4 shadow">
      <div className="mb-3 text-sm font-medium opacity-70">Estadísticas</div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 rounded-box bg-primary bg-opacity-20">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5 text-primary" />
            <span className="text-sm">Total alumnos</span>
          </div>
          <span className="font-semibold text-primary">{stats.totalAlumnos}</span>
        </div>
        
        <div className="flex items-center justify-between p-2 rounded-box bg-success bg-opacity-20">
          <div className="flex items-center gap-2">
            <CheckBadgeIcon className="h-5 w-5 text-success" />
            <span className="text-sm">Asistencia promedio</span>
          </div>
          <span className="font-semibold text-success">{stats.asistenciaPromedio}%</span>
        </div>
        
        <div className="flex items-center justify-between p-2 rounded-box bg-warning bg-opacity-20">
          <div className="flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-warning" />
            <span className="text-sm">Calificación promedio</span>
          </div>
          <span className="font-semibold text-warning">{stats.calificacionPromedio}</span>
        </div>
      </div>
    </div>
  );
}
