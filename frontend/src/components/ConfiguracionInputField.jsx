import { HijosLista } from "./HijosLista";
import {SelectLocalidad} from './SelectLocalidad';

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