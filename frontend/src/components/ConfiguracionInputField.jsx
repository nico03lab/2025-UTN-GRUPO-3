import { HijosLista } from "./HijosLista";
import {SelectLocalidad} from './SelectLocalidad';
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';

export const ConfigInputField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  options = [],
  className = "",
  component,
  customData,
  onUpdateHijo,
  dniTutor
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordModified, setPasswordModified] = useState(false);
  
  // Componente custom para hijos
  if (type === "custom") {
    return (
      <div className={`form-control w-full ${className}`}>
        <label className="label">
          <span className="label-text font-semibold">{label}</span>
        </label>
        {component === "HijosLista" && (
          <HijosLista 
            hijos={customData} 
            onUpdateHijo={onUpdateHijo}
            dniTutor={dniTutor}
          />
        )}
      </div>
    );
  }

  // Select de Localidad especial
  if (type === "localidad") {
    return (
      <SelectLocalidad
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
    );
  }

  // ⬅️ NUEVO: Password protegido con toggle
  if (type === "passwordProtected") {
    const displayValue = !passwordModified && value ? '••••••••' : value || '';
    
    return (
      <div className={`form-control w-full ${className}`}>
        <label className="label">
          <span className="label-text font-medium">
            {label} {required && <span className="text-error">*</span>}
          </span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name={name}
            className="input input-bordered w-full pr-10"
            value={displayValue}
            onChange={(e) => {
              setPasswordModified(true);
              onChange(e);
            }}
            onFocus={() => {
              if (!passwordModified && value) {
                // Limpiar al hacer focus si es la primera vez
                onChange({ target: { name, value: '' } });
                setPasswordModified(true);
              }
            }}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {!passwordModified && value && (
          <label className="label">
            <span className="label-text-alt text-base-content/50">
              Click para modificar la contraseña
            </span>
          </label>
        )}
      </div>
    );
  }

  // Select Normal
  if (type === "select") {
    return (
      <div className={`form-control w-full ${className}`}>
        <label className="label">
          <span className="label-text font-medium">
            {label} {required && <span className="text-error">*</span>}
          </span>
        </label>
        <select
          name={name}
          className="select select-bordered w-full"
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        >
          <option value="">Seleccione...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Textarea
  if (type === "textarea") {
    return (
      <div className={`form-control w-full ${className}`}>
        <label className="label">
          <span className="label-text font-medium">
            {label} {required && <span className="text-error">*</span>}
          </span>
        </label>
        <textarea
          name={name}
          className="textarea textarea-bordered"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={3}
        />
      </div>
    );
  }

  // Input normal
  return (
    <div className={`form-control w-full ${className}`}>
      <label className="label">
        <span className="label-text font-medium">
          {label} {required && <span className="text-error">*</span>}
        </span>
      </label>
      <input
        type={type}
        name={name}
        className="input input-bordered w-full"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );
  
}