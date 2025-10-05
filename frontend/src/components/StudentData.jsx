import { InputField } from "./InputField";

// Componente Paso 1: Datos del Estudiante
export const DatosEstudiante = ({ formData, handleInputChange }) => {
  const localidadesOptions = [
    { value: 'La Plata', label: 'La Plata' },
    { value: 'Berrisso', label: 'Berisso' },
    { value: 'Ensenada', label: 'Ensenada' },
    { value: 'Gonnet', label: 'Gonnet' },
    { value: 'Ringuelet', label: 'Ringuelet' }
  ];
  const provinciaOptions = [
    { value: 'Buenos Aires', label: 'Buenos Aires' }
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
          label="Teléfono"
          name="telefono"
          type="tel"
          value={formData.telefono}
          onChange={handleInputChange}
          placeholder="1112345678"
        />
      </div>  
        <h3 className="font-medium text-base-content py-4">Direccion</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Calle"
            name="calle"
            value={formData.calle}
            onChange={handleInputChange}
            placeholder="Calle"
            required
          />
          <InputField
            label="Numero"
            name="numero"
            value={formData.numero}
            onChange={handleInputChange}
            placeholder="numero"
          />
          <InputField
            label="Localidad"
            name="localidad"
            value={formData.localidad}
            onChange={handleInputChange}
            placeholder="Seleccionar localidad"
            options={localidadesOptions}
            required
          />
          <InputField
            label="Provincia"
            name="provincia"
            value={formData.provincia}
            onChange={handleInputChange}
            placeholder="Seleccionar provincia"
            options={provinciaOptions}
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
  );
};