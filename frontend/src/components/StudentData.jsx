import { InputField } from "./InputField";

// Componente Paso 1: Datos del Estudiante
export const DatosEstudiante = ({ formData, handleInputChange }) => {
  const generoOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'otro', label: 'Otro' }
  ];

  return (
    <div className="bg-base-100 rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Nombre"
          name="nombreEstudiante"
          value={formData.nombreEstudiante}
          onChange={handleInputChange}
          placeholder="Ingrese el nombre"
          required
        />
        
        <InputField
          label="Apellido"
          name="apellidoEstudiante"
          value={formData.apellidoEstudiante}
          onChange={handleInputChange}
          placeholder="Ingrese el apellido"
          required
        />
        
        <InputField
          label="DNI"
          name="dni"
          value={formData.dni}
          onChange={handleInputChange}
          placeholder="12345678"
          required
        />
        
        <InputField
          label="Fecha de Nacimiento"
          name="fechaNacimiento"
          type="date"
          value={formData.fechaNacimiento}
          onChange={handleInputChange}
          required
        />
        
        <InputField
          label="Género"
          name="genero"
          value={formData.genero}
          onChange={handleInputChange}
          placeholder="Seleccionar género"
          options={generoOptions}
          required
        />
        
        <InputField
          label="Teléfono"
          name="telefono"
          type="tel"
          value={formData.telefono}
          onChange={handleInputChange}
          placeholder="11-1234-5678"
        />
        
        <div className="md:col-span-2">
          <InputField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            placeholder="Calle, número, ciudad, provincia"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="estudiante@email.com"
          />
        </div>
      </div>
    </div>
  );
};