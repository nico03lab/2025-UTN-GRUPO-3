import React from 'react';

export default function InscriptionsTab({ inscripciones, onApprove, onReject }) {
  if (inscripciones.length === 0) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-check-circle text-4xl text-success mb-4"></i>
        <h3 className="text-xl font-bold">No hay inscripciones pendientes</h3>
        <p className="text-base-content/70 mt-2">Todas las solicitudes han sido procesadas.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Inscripciones Pendientes</h2>
      
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>DNI</th>
              <th>Curso Solicitado</th>
              <th>Fecha Solicitud</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.map(insc => (
              <tr key={insc.id}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-10">
                        <span>{insc.nombreAlumno.charAt(0)}{insc.apellidoAlumno.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{insc.nombreAlumno} {insc.apellidoAlumno}</div>
                    </div>
                  </div>
                </td>
                <td>{insc.dniAlumno}</td>
                <td>
                  <span className="badge badge-outline">{insc.cursoSolicitado}</span>
                </td>
                <td>{new Date(insc.fechaSolicitud).toLocaleDateString()}</td>
                <td>
                  <div className="flex space-x-2">
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => onApprove(insc.id)}
                    >
                      <i className="fas fa-check mr-1"></i> Aprobar
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => onReject(insc.id)}
                    >
                      <i className="fas fa-times mr-1"></i> Rechazar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}