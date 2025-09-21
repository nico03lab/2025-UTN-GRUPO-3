import React from "react";
import AsistenciaForm from '../components/AsistenciaForm';
import './AsistenciaPage.css';

export const AsistenciaPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Sistema de Asistencias</h1>
      <AsistenciaForm />
    </div>
  );
};

