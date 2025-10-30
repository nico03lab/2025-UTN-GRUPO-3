// components/SelectLocalidad.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export const SelectLocalidad = ({ 
  value, 
  onChange, 
  name, 
  label, 
  required = false,
  disabled = false 
}) => {
  const API_BASE_URL = "http://localhost:3002/api/localidades";
  
  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState(value || "");
  const [cargando, setCargando] = useState(true);

  // Cargar provincias al montar
  useEffect(() => {
    cargarProvincias();
  }, []);

  // Cargar localidades cuando cambia la provincia
  useEffect(() => {
    if (provinciaSeleccionada) {
      cargarLocalidades(provinciaSeleccionada);
    }
  }, [provinciaSeleccionada]);

  // Si ya hay un valor inicial, cargar su provincia
  useEffect(() => {
    if (value) {
      cargarProvinciaDeLocalidad(value);
    }
  }, [value]);

  const cargarProvincias = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/provincias`);
      setProvincias(response.data);
    } catch (error) {
      console.error('Error cargando provincias:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarLocalidades = async (provincia) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${provincia}`);
      setLocalidades(response.data);
    } catch (error) {
      console.error('Error cargando localidades:', error);
    }
  };

  const cargarProvinciaDeLocalidad = async (idLocalidad) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/info/${idLocalidad}`);
      setProvinciaSeleccionada(response.data.Provincia);
      setLocalidadSeleccionada(idLocalidad);
    } catch (error) {
      console.error('Error obteniendo provincia:', error);
    }
  };

  const handleProvinciaChange = (e) => {
    const provincia = e.target.value;
    setProvinciaSeleccionada(provincia);
    setLocalidadSeleccionada(""); // Reset localidad
    setLocalidades([]); // Limpiar localidades
  };

  const handleLocalidadChange = (e) => {
    const idLocalidad = e.target.value;
    setLocalidadSeleccionada(idLocalidad);
    
    // Notificar al componente padre
    onChange({
      target: {
        name: name,
        value: idLocalidad
      }
    });
  };

  if (disabled) {
    // Mostrar como texto si está deshabilitado
    return (
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={value || ''}
          disabled
        />
      </div>
    );
  }

  return (
    <div className="form-control w-full space-y-3">
      <label className="label">
        <span className="label-text font-medium">
          {label} {required && <span className="text-error">*</span>}
        </span>
      </label>

      {/* Select Provincia */}
      <select
        className="select select-bordered w-full"
        value={provinciaSeleccionada}
        onChange={handleProvinciaChange}
        required={required}
        disabled={cargando}
      >
        <option value="">Seleccione una provincia</option>
        {provincias.map((prov) => (
          <option key={prov} value={prov}>
            {prov}
          </option>
        ))}
      </select>

      {/* Select Localidad */}
      <select
        className="select select-bordered w-full"
        value={localidadSeleccionada}
        onChange={handleLocalidadChange}
        required={required}
        disabled={!provinciaSeleccionada || cargando}
      >
        <option value="">
          {provinciaSeleccionada ? 'Seleccione una localidad' : 'Primero seleccione una provincia'}
        </option>
        {localidades.map((loc) => (
          <option key={loc.IdLocalidad} value={loc.IdLocalidad}>
            {loc.Nombre}
          </option>
        ))}
      </select>

      {cargando && (
        <div className="flex items-center gap-2 text-sm opacity-70">
          <span className="loading loading-spinner loading-xs"></span>
          Cargando...
        </div>
      )}
    </div>
  );
};

export default SelectLocalidad;