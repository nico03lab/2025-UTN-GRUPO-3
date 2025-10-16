import React, { useState } from 'react';

export default function ReportsTab({ onGenerateReport, cursos }) {
  const [reportType, setReportType] = useState('asistencia');
  const [filters, setFilters] = useState({
    curso: '',
    fechaDesde: '',
    fechaHasta: '',
    nivel: '',
    formato: 'pdf',
    detalle: 'completo'
  });
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    { 
      id: 'asistencia', 
      name: 'Reporte de Asistencia', 
      icon: 'fa-clipboard-check',
      description: 'Asistencia por curso, alumno o período específico'
    },
    { 
      id: 'calificaciones', 
      name: 'Reporte de Calificaciones', 
      icon: 'fa-chart-line',
      description: 'Promedios, boletines y rendimiento académico'
    },
    { 
      id: 'alumnos', 
      name: 'Listado de Alumnos', 
      icon: 'fa-users',
      description: 'Datos completos de alumnos por curso o nivel'
    },
    { 
      id: 'cursos', 
      name: 'Estadísticas de Cursos', 
      icon: 'fa-book',
      description: 'Capacidad, vacantes y datos de cada curso'
    },
    { 
      id: 'personal', 
      name: 'Datos del Personal', 
      icon: 'fa-user-tie',
      description: 'Información de docentes y personal administrativo'
    },
    { 
      id: 'financiero', 
      name: 'Reporte Financiero', 
      icon: 'fa-dollar-sign',
      description: 'Cuotas, pagos y estado financiero'
    },
    { 
      id: 'disciplina', 
      name: 'Incidentes Disciplinarios', 
      icon: 'fa-exclamation-triangle',
      description: 'Registro de sanciones y observaciones de conducta'
    },
    { 
      id: 'egresados', 
      name: 'Reporte de Egresados', 
      icon: 'fa-graduation-cap',
      description: 'Alumnos egresados por promoción'
    }
  ];

  const niveles = [
    'Inicial', 'Primario 1°', 'Primario 2°', 'Primario 3°', 
    'Primario 4°', 'Primario 5°', 'Primario 6°', 
    'Secundario 1°', 'Secundario 2°', 'Secundario 3°', 
    'Secundario 4°', 'Secundario 5°', 'Secundario 6°'
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!reportType) return;
    
    setGenerating(true);
    try {
      await onGenerateReport(reportType, filters);
    } catch (error) {
      console.error('Error generando reporte:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getReportPreview = () => {
    const type = reportTypes.find(t => t.id === reportType);
    if (!type) return null;

    const previews = {
      asistencia: {
        title: "Reporte de Asistencia",
        columns: ["Alumno", "Curso", "Presente", "Ausente", "% Asistencia"],
        sampleData: [
          ["María González", "4°A", "45", "2", "95.7%"],
          ["Carlos López", "4°A", "43", "4", "91.5%"],
          ["Ana Martínez", "4°A", "46", "1", "97.9%"]
        ]
      },
      calificaciones: {
        title: "Reporte de Calificaciones",
        columns: ["Alumno", "Matemática", "Lengua", "Ciencias", "Promedio"],
        sampleData: [
          ["María González", "8.5", "9.0", "8.0", "8.5"],
          ["Carlos López", "7.0", "8.5", "7.5", "7.7"],
          ["Ana Martínez", "9.5", "9.0", "9.5", "9.3"]
        ]
      },
      alumnos: {
        title: "Listado de Alumnos",
        columns: ["DNI", "Apellido y Nombre", "Curso", "Contacto"],
        sampleData: [
          ["45123456", "González, María", "4°A", "mgonzalez@email.com"],
          ["45234567", "López, Carlos", "4°A", "clopez@email.com"],
          ["45345678", "Martínez, Ana", "4°A", "amartinez@email.com"]
        ]
      },
      cursos: {
        title: "Estadísticas de Cursos",
        columns: ["Curso", "Alumnos", "Capacidad", "Vacantes", "Asistencia Prom."],
        sampleData: [
          ["4°A", "28", "30", "2", "95.2%"],
          ["4°B", "30", "30", "0", "93.8%"],
          ["5°A", "25", "30", "5", "96.1%"]
        ]
      }
    };

    return previews[reportType] || {
      title: type.name,
      columns: ["Campo 1", "Campo 2", "Campo 3"],
      sampleData: [["Dato 1", "Dato 2", "Dato 3"]]
    };
  };

  const isFormValid = reportType && filters.formato;

  const selectedReport = reportTypes.find(t => t.id === reportType);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Generación de Reportes</h2>
        <div className="text-sm opacity-70">
          <i className="fas fa-info-circle mr-1"></i>
          Los reportes se generan en tiempo real con los datos actuales
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Selección de Tipo de Reporte */}
        <div className="lg:col-span-1">
          <div className="bg-base-200 p-4 rounded-lg sticky top-4">
            <h3 className="font-bold mb-4 text-lg">Tipos de Reporte</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {reportTypes.map(type => (
                <div
                  key={type.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all border ${
                    reportType === type.id 
                      ? 'bg-primary text-primary-content border-primary shadow' 
                      : 'bg-base-100 border-base-300 hover:bg-base-300'
                  }`}
                  onClick={() => setReportType(type.id)}
                >
                  <div className="flex items-start">
                    <i className={`fas ${type.icon} mr-3 mt-1`}></i>
                    <div className="flex-1">
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs opacity-80 mt-1">
                        {type.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configuración y Vista Previa */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Configuración del Reporte */}
            <div className="bg-base-100 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <i className={`fas ${selectedReport?.icon} mr-2`}></i>
                Configuración - {selectedReport?.name}
              </h3>
              
              <div className="space-y-4">
                {/* Filtros básicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Formato</span>
                    </label>
                    <select 
                      className="select select-bordered"
                      value={filters.formato}
                      onChange={(e) => handleFilterChange('formato', e.target.value)}
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="excel">Excel (.xlsx)</option>
                      <option value="csv">CSV (.csv)</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Nivel de Detalle</span>
                    </label>
                    <select 
                      className="select select-bordered"
                      value={filters.detalle}
                      onChange={(e) => handleFilterChange('detalle', e.target.value)}
                    >
                      <option value="resumido">Resumido</option>
                      <option value="completo">Completo</option>
                      <option value="detallado">Altamente Detallado</option>
                    </select>
                  </div>
                </div>

                {/* Filtros específicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Curso Específico</span>
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
                      <span className="label-text font-semibold">Nivel</span>
                    </label>
                    <select 
                      className="select select-bordered"
                      value={filters.nivel}
                      onChange={(e) => handleFilterChange('nivel', e.target.value)}
                    >
                      <option value="">Todos los niveles</option>
                      {niveles.map(nivel => (
                        <option key={nivel} value={nivel}>
                          {nivel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rango de fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Fecha Desde</span>
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
                      <span className="label-text font-semibold">Fecha Hasta</span>
                    </label>
                    <input 
                      type="date" 
                      className="input input-bordered"
                      value={filters.fechaHasta}
                      onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                    />
                  </div>
                </div>

                {/* Opciones adicionales */}
                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Opciones Adicionales</h4>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="checkbox checkbox-sm mr-3" />
                      <span className="label-text">Incluir datos de contacto</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="checkbox checkbox-sm mr-3" defaultChecked />
                      <span className="label-text">Incluir estadísticas</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="checkbox checkbox-sm mr-3" />
                      <span className="label-text">Incluir gráficos comparativos</span>
                    </label>
                  </div>
                </div>

                {/* Botón de Generación */}
                <div className="form-control pt-4">
                  <button 
                    className={`btn btn-primary w-full ${generating ? 'loading' : ''}`}
                    onClick={handleGenerate}
                    disabled={!isFormValid || generating}
                  >
                    {generating ? (
                      'Generando Reporte...'
                    ) : (
                      <>
                        <i className="fas fa-download mr-2"></i>
                        Generar Reporte ({filters.formato.toUpperCase()})
                      </>
                    )}
                  </button>
                  
                  {!isFormValid && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        <i className="fas fa-exclamation-circle mr-1"></i>
                        Selecciona al menos el tipo y formato del reporte
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Vista Previa del Reporte */}
            <div className="bg-base-100 p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <i className="fas fa-eye mr-2"></i>
                Vista Previa
              </h3>
              
              <div className="bg-base-200 rounded-lg p-4">
                {selectedReport && (
                  <div>
                    <div className="text-center mb-4 p-4 bg-base-100 rounded">
                      <i className="fas fa-file-alt text-4xl text-primary mb-3"></i>
                      <h4 className="font-bold text-lg">{selectedReport.name}</h4>
                      <p className="text-sm opacity-70 mt-1">{selectedReport.description}</p>
                    </div>

                    <div className="bg-base-100 rounded p-4">
                      <h5 className="font-semibold mb-3">Estructura del Reporte:</h5>
                      
                      {getReportPreview() && (
                        <div className="overflow-x-auto">
                          <table className="table table-xs table-zebra w-full">
                            <thead>
                              <tr>
                                {getReportPreview().columns.map((col, index) => (
                                  <th key={index} className="bg-base-300">{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {getReportPreview().sampleData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      
                      <div className="mt-4 text-xs opacity-70">
                        <div className="flex flex-wrap gap-4">
                          <span><strong>Formato:</strong> {filters.formato.toUpperCase()}</span>
                          {filters.curso && (
                            <span><strong>Curso:</strong> {cursos.find(c => c.IdCurso === filters.curso)?.Nombre}</span>
                          )}
                          {filters.fechaDesde && (
                            <span><strong>Desde:</strong> {filters.fechaDesde}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!selectedReport && (
                  <div className="text-center py-8 text-base-content/50">
                    <i className="fas fa-chart-bar text-4xl mb-3"></i>
                    <p>Selecciona un tipo de reporte para ver la vista previa</p>
                  </div>
                )}
              </div>

              {/* Información de Exportación */}
              <div className="mt-4 bg-info/10 p-3 rounded border border-info">
                <div className="flex items-start">
                  <i className="fas fa-info-circle text-info mt-1 mr-2"></i>
                  <div className="text-sm">
                    <strong>Tipos de exportación disponibles:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• <strong>PDF:</strong> Ideal para impresión y documentación formal</li>
                      <li>• <strong>Excel:</strong> Para análisis y procesamiento de datos</li>
                      <li>• <strong>CSV:</strong> Para importación en otros sistemas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reportes Rápidos */}
          <div className="mt-6 bg-base-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Reportes Rápidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                className="btn btn-outline justify-start"
                onClick={() => {
                  setReportType('asistencia');
                  setFilters({...filters, fechaDesde: new Date().toISOString().split('T')[0].substring(0, 8) + '01'});
                }}
              >
                <i className="fas fa-calendar-day mr-2"></i>
                Asistencia del Mes
              </button>
              
              <button 
                className="btn btn-outline justify-start"
                onClick={() => {
                  setReportType('calificaciones');
                  setFilters({...filters, detalle: 'resumido'});
                }}
              >
                <i className="fas fa-chart-pie mr-2"></i>
                Promedios Generales
              </button>
              
              <button 
                className="btn btn-outline justify-start"
                onClick={() => {
                  setReportType('alumnos');
                  setFilters({...filters, formato: 'excel'});
                }}
              >
                <i className="fas fa-file-excel mr-2"></i>
                Lista Completa (Excel)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}