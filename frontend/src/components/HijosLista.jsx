// components/HijosLista.jsx
import { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {SelectLocalidad} from './SelectLocalidad';


export const HijosLista = ({ hijos, onUpdateHijo, dniTutor }) => {
  const [editandoId, setEditandoId] = useState(null);
  const [hijoEditado, setHijoEditado] = useState({});

  if (!hijos || hijos.length === 0) {
    return (
      <div className="alert alert-info">
        <span>No hay hijos vinculados a este tutor</span>
      </div>
    );
  }

  const iniciarEdicion = (hijo) => {
    setEditandoId(hijo.DNIAlumno);
    setHijoEditado({ ...hijo, 
      DNITutor: dniTutor
     });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setHijoEditado({});
  };

  const guardarEdicion = () => {
    onUpdateHijo(hijoEditado);
    setEditandoId(null);
    setHijoEditado({});
  };

  const handleChange = (field, value) => {
    setHijoEditado(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      {hijos.map((hijo) => {
        const editando = editandoId === hijo.DNIAlumno;

        return (
          <div 
            key={hijo.DNIAlumno} 
            className="card bg-base-200 shadow-sm"
          >
            <div className="card-body p-4">
              <div className="flex justify-between items-start mb-3">
                <h5 className="font-semibold">
                  {hijo.Apellido} {hijo.Nombres}
                  <span className="text-xs text-base-content/50 ml-2">
                    DNI: {hijo.DNIAlumno}
                  </span>
                  <span className={`ml-2 badge badge-sm ${
                    hijo.Estado === 'Activo' ? 'badge-success' : 'badge-error'
                  }`}>
                    {hijo.Estado}
                  </span>
                </h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Apellido */}
                <div className="form-control">
                  <label className="label label-text text-xs">Apellido</label>
                  {editando ? (
                    <input
                      type="text"
                      className="input input-sm input-bordered"
                      value={hijoEditado.Apellido || ''}
                      onChange={(e) => handleChange('Apellido', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm">{hijo.Apellido}</span>
                  )}
                </div>

                {/* Nombres */}
                <div className="form-control">
                  <label className="label label-text text-xs">Nombres</label>
                  {editando ? (
                    <input
                      type="text"
                      className="input input-sm input-bordered"
                      value={hijoEditado.Nombres || ''}
                      onChange={(e) => handleChange('Nombres', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm">{hijo.Nombres}</span>
                  )}
                </div>

                {/* Fecha Nacimiento */}
                <div className="form-control">
                  <label className="label label-text text-xs">Fecha de Nacimiento</label>
                  {editando ? (
                    <input
                      type="date"
                      className="input input-sm input-bordered"
                      value={hijoEditado.FechaNacimiento?.split('T')[0] || ''}
                      onChange={(e) => handleChange('FechaNacimiento', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm">
                      {new Date(hijo.FechaNacimiento).toLocaleDateString('es-AR')}
                    </span>
                  )}
                </div>

                {/* Teléfono */}
                <div className="form-control">
                  <label className="label label-text text-xs">Teléfono</label>
                  {editando ? (
                    <input
                      type="tel"
                      className="input input-sm input-bordered"
                      value={hijoEditado.Telefono || ''}
                      onChange={(e) => handleChange('Telefono', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm">{hijo.Telefono || '-'}</span>
                  )}
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label label-text text-xs">Email</label>
                  {editando ? (
                    <input
                      type="email"
                      className="input input-sm input-bordered"
                      value={hijoEditado.Email || ''}
                      onChange={(e) => handleChange('Email', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm">{hijo.Email || '-'}</span>
                  )}
                </div>

                {/* Relación */}
                <div className="form-control">
                  <label className="label label-text text-xs">Relación</label>
                  {editando ? (
                    <select
                      className="select select-sm select-bordered"
                      value={hijoEditado.Relacion || ''}
                      onChange={(e) => handleChange('Relacion', e.target.value)}
                    >
                      <option value="Padre">Padre</option>
                      <option value="Madre">Madre</option>
                      <option value="Tutor">Tutor</option>
                      <option value="Abuelo/a">Abuelo/a</option>
                      <option value="Otro">Otro</option>
                    </select>
                  ) : (
                    <span className="text-sm">{hijo.Relacion || '-'}</span>
                  )}
                </div>

                {/* Calle */}
                <div className="form-control">
                  <label className="label label-text text-xs">Calle</label>
                  {editando ? (
                    <input
                      type="text"
                      className="input input-sm input-bordered"
                      value={hijoEditado.Calle || ''}
                      onChange={(e) => handleChange('Calle', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm">{hijo.Calle || '-'}</span>
                  )}
                </div>

                {/* Número */}
                <div className="form-control">
                  <label className="label label-text text-xs">Número</label>
                  {editando ? (
                    <input
                      type="text"
                      className="input input-sm input-bordered"
                      value={hijoEditado.Numero || ''}
                      onChange={(e) => handleChange('Numero', e.target.value)}
                    />
                  ) : (
                    <span className="text-sm">{hijo.Numero || '-'}</span>
                  )}
                </div>

                {/* Localidad (con select si está editando) */}
                <div className="form-control md:col-span-2">
                <label className="label label-text text-xs">Localidad</label>
                {editando ? (
                    <SelectLocalidad
                    name="IdLocalidad"
                    label=""
                    value={hijoEditado.IdLocalidad || ''}
                    onChange={(e) => handleChange('IdLocalidad', e.target.value)}
                    required={false}
                    />
                ) : (
                    <span className="text-sm">{hijo.Localidad}, {hijo.Provincia}</span>
                )}
                </div>
              </div>
              <div className="flex justify-between items-start mb-3">
                <div></div>
                {editando ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={cancelarEdicion}
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={guardarEdicion}
                    >
                      <CheckIcon className="h-4 w-4" />
                      Guardar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => iniciarEdicion(hijo)}
                  >
                    <PencilIcon className="h-4 w-4" />
                    Editar
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HijosLista;