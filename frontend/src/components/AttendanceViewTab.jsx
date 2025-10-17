import React from 'react';

export default function AttendanceViewTab({ asistencias, cursos, filters, onFilterChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Consulta de Asistencias</h2>
      
      {/* Filtros */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <h3 className="font-bold mb-3">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">
              <span className="label-text">Curso</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={filters.curso}
              onChange={(e) => onFilterChange('curso', e.target.value)}
            >
              <option value="">Todos los cursos</option>
              {cursos.map(curso => (
                <option key={curso.IdCurso} value={curso.IdCurso}>
                  {curso.Nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">Fecha Desde</span>
            </label>
            <input 
              type="date" 
              className="input input-bordered w-full"
              value={filters.fechaDesde}
              onChange={(e) => onFilterChange('fechaDesde', e.target.value)}
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text">Fecha Hasta</span>
            </label>
            <input 
              type="date" 
              className="input input-bordered w-full"
              value={filters.fechaHasta}
              onChange={(e) => onFilterChange('fechaHasta', e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <button className="btn btn-primary w-full">
              <i className="fas fa-filter mr-2"></i> Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
      
      {/* Resultados */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Curso</th>
              <th>Alumno</th>
              <th>Estado</th>
              <th>Justificación</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.length > 0 ? (
              asistencias.map(asist => (
                <tr key={asist.id}>
                  <td>{new Date(asist.fecha).toLocaleDateString()}</td>
                  <td>
                    <span className="badge badge-outline">{asist.cursoNombre}</span>
                  </td>
                  <td>{asist.alumnoNombre} {asist.alumnoApellido}</td>
                  <td>
                    <span className={`badge ${asist.presente ? 'badge-success' : 'badge-error'}`}>
                      {asist.presente ? 'Presente' : 'Ausente'}
                    </span>
                  </td>
                  <td>{asist.justificacion || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No hay datos de asistencia para los filtros seleccionados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}