import React, { useState } from 'react';

export default function ReportsTab({ onGenerateReport, cursos }) {
  const [reportType, setReportType] = useState('asistencia');
  const [filters, setFilters] = useState({
    curso: '',
    fechaDesde: '',
    fechaHasta: '',
    formato: 'pdf'
  });

  const reportTypes = [
    { id: 'asistencia', name: 'Reporte de Asistencia', icon: 'fa-clipboard-check' },
    { id: 'calificaciones', name: 'Reporte de Calificaciones', icon: 'fa-chart-line' },
    { id: 'alumnos', name: 'Listado de Alumnos', icon: 'fa-users' },
    { id: 'cursos', name: 'Estadísticas de Cursos', icon: 'fa-book' },
    { id: 'personal', name: 'Datos del Personal', icon: 'fa-user-tie' },
    { id: 'financiero', name: 'Reporte Financiero', icon: 'fa-dollar-sign' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    onGenerateReport(reportType, filters);
  };

  const isFormValid = reportType && filters.formato;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Generación de Reportes</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selección de Tipo de Reporte */}
        <div className="lg:col-span-1">
          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-bold mb-4">Tipo de Reporte</h3>
            <div className="space-y-2">
              {reportTypes.map(type => (
                <div
                  key={type.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    reportType === type.id 
                      ? 'bg-primary text-primary-content shadow' 
                      : 'bg-base-100 hover:bg-base-300'
                  }`}
                  onClick={() => setReportType(type.id)}
                >
                  <div className="flex items-center">
                    <i className={`fas ${type.icon} mr-3`}></i>
                    <span className="font-medium">{type.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configuración del Reporte */}
        <div className="lg:col-span-2">
          <div className="bg-base-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Configuración del Reporte</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Filtros comunes */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Curso</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={filters.curso}
                  onChange={(e) => handleFilterChange('curso', e.target.value)}
                >
                  <option value="">Todos los cursos</option>
                  {cursos.map(curso => (
                    <option key={curso.IdCurso} value={curso.IdCurso}>
                      {curso.Nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Formato</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={filters.formato}
                  onChange={(e) => handleFilterChange('formato', e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fecha Desde</span>
                </label>
                <input 
                  type="date" 
                  className="input input-bordered"
                  value={filters.fechaDesde}
                  onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fecha Hasta</span>
                </label>
                <input 
                  type="date" 
                  className="input input-bordered"
                  value={filters.fechaHasta}
                  onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                />
              </div>
            </div>

            {/* Botón de Generación */}
            <div className="form-control">
              <button 
                className={`btn btn-primary w-full ${!isFormValid ? 'btn-disabled' : ''}`}
                onClick={handleGenerate}
                disabled={!isFormValid}
              >
                <i className="fas fa-download mr-2"></i>
                Generar Reporte
              </button>
            </div>
          </div>

          {/* Vista Previa del Reporte */}
          <div className="mt-6 bg-base-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Vista Previa</h3>
            <div className="bg-base-200 p-4 rounded text-center">
              <i className="fas fa-file-alt text-4xl text-base-content/30 mb-3"></i>
              <p className="text-base-content/70">
                El reporte se generará con los parámetros seleccionados
              </p>
              <div className="mt-3 text-sm opacity-50">
                Tipo: {reportTypes.find(t => t.id === reportType)?.name}
                {filters.curso && ` | Curso: ${cursos.find(c => c.IdCurso === filters.curso)?.Nombre}`}
                {filters.formato && ` | Formato: ${filters.formato.toUpperCase()}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}