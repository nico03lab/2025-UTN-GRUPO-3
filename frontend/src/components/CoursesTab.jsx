import React, { useState } from 'react';

export default function CoursesTab({ cursos, alumnos }) {
  const [selectedCurso, setSelectedCurso] = useState(null);
  
  const alumnosDelCurso = selectedCurso 
    ? alumnos.filter(a => a.IdCurso === selectedCurso)
    : [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Cursos</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de cursos */}
        <div className="lg:col-span-1">
          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-bold mb-3">Cursos</h3>
            <ul className="menu menu-compact w-full">
              {cursos.map(curso => (
                <li key={curso.IdCurso} className={selectedCurso === curso.IdCurso ? 'bordered' : ''}>
                  <a onClick={() => setSelectedCurso(curso.IdCurso)}>
                    {curso.Nombre}
                    <span className="badge badge-sm ml-2">
                      {alumnos.filter(a => a.IdCurso === curso.IdCurso).length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Detalle del curso seleccionado */}
        <div className="lg:col-span-2">
          {selectedCurso ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {cursos.find(c => c.IdCurso === selectedCurso)?.Nombre}
                </h3>
                <button className="btn btn-sm btn-outline">
                  <i className="fas fa-edit mr-1"></i> Editar Curso
                </button>
              </div>
              
              <div className="stats shadow w-full mb-6">
                <div className="stat">
                  <div className="stat-title">Total Alumnos</div>
                  <div className="stat-value">{alumnosDelCurso.length}</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Capacidad</div>
                  <div className="stat-value">30</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Vacantes</div>
                  <div className="stat-value">{30 - alumnosDelCurso.length}</div>
                </div>
              </div>
              
              <h4 className="font-bold mb-3">Alumnos Inscritos</h4>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Alumno</th>
                      <th>DNI</th>
                      <th>Contacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnosDelCurso.map(alumno => (
                      <tr key={alumno.DNIAlumno}>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-8">
                                <span className="text-xs">
                                  {alumno.Nombre.charAt(0)}{alumno.Apellido.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{alumno.Nombre} {alumno.Apellido}</div>
                            </div>
                          </div>
                        </td>
                        <td>{alumno.DNIAlumno}</td>
                        <td>{alumno.Email || alumno.Telefono || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-book-open text-4xl text-base-content/30 mb-4"></i>
              <h3 className="text-xl font-bold">Selecciona un curso</h3>
              <p className="text-base-content/70 mt-2">Elige un curso de la lista para ver sus detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}