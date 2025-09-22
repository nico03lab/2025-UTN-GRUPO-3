import React from 'react';
import { AcademicCapIcon, DocumentCheckIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

export default function GradesTab({ alumnos, grades, setGrade, setObs, saveGrades, setGrades }) {
  return (
    <section>
      <div className="text-sm opacity-70 mb-4 flex items-center gap-2">
        <AcademicCapIcon className="h-5 w-5" />
        Calificar alumnos
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Nota</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map(a => (
              <tr key={a.DNI}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src={a.Avatar} alt={`${a.Nombres} ${a.Apellido}`} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{a.Apellido}, {a.Nombres}</div>
                      <div className="text-sm opacity-50">DNI: {a.DNI}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <input 
                    type="number" 
                    placeholder="0-10" 
                    min="0" max="10" step="0.5"
                    value={grades[a.DNI]?.nota || ''} 
                    onChange={e => setGrade(a.DNI, e.target.value)} 
                    className="input input-bordered w-20"
                  />
                  {grades[a.DNI]?.nota >= 7 && (
                    <div className="text-success text-xs mt-1 flex items-center gap-1">
                      <CheckBadgeIcon className="h-4 w-4" />
                      Buen desempeño
                    </div>
                  )}
                </td>
                <td>
                  <input 
                    type="text" 
                    placeholder="Observaciones" 
                    value={grades[a.DNI]?.obs || ''} 
                    onChange={e => setObs(a.DNI, e.target.value)} 
                    className="input input-bordered w-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={saveGrades} className="btn btn-success">
          <DocumentCheckIcon className="h-5 w-5" />
          Guardar calificaciones
        </button>
        <button 
          onClick={() => { 
            const init = {}; 
            alumnos.forEach(a => init[a.DNI] = { nota: '', obs: '' }); 
            setGrades(init); 
          }} 
          className="btn btn-outline"
        >
          Limpiar
        </button>
      </div>
    </section>
  );
}
