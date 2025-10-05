import { InputField } from "./InputField";

// Componente Paso 3: Datos del Tutor
export const DatosTutor = ({ formData, handleInputChange }) => {
  const relacionOptions = [
    { value: 'padre', label: 'Padre' },
    { value: 'madre', label: 'Madre' },
    { value: 'abuelo', label: 'Abuelo/a' },
    { value: 'tutor', label: 'Tutor Legal' },
    { value: 'otro', label: 'Otro' }
  ];
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
          label="Nombre del Tutor"
          name="nombreTutor"
          value={formData.nombreTutor}
          onChange={handleInputChange}
          placeholder="Nombre del tutor"
          required
        />
        
        <InputField
          label="Apellido del Tutor"
          name="apellidoTutor"
          value={formData.apellidoTutor}
          onChange={handleInputChange}
          placeholder="Apellido del tutor"
          required
        />
        
        <InputField
          label="DNI del Tutor"
          name="dniTutor"
          value={formData.dniTutor}
          onChange={handleInputChange}
          placeholder="12345678"
          required
        />
        
        <InputField
          label="Relación"
          name="relacionTutor"
          value={formData.relacionTutor}
          onChange={handleInputChange}
          placeholder="Seleccionar relación"
          options={relacionOptions}
          required
        />
      </div> 
        <h3 className="font-medium text-base-content py-4">Direccion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Calle"
              name="calleTutor"
              value={formData.calleTutor}
              onChange={handleInputChange}
              placeholder="Calle"
              required
            />
            <InputField
              label="Numero"
              name="numeroTutor"
              value={formData.numeroTutor}
              onChange={handleInputChange}
              placeholder="numero"
            />
            <InputField
              label="Localidad"
              name="localidadTutor"
              value={formData.localidadTutor}
              onChange={handleInputChange}
              placeholder="Seleccionar localidad"
              options={localidadesOptions}
              required
            />
            <InputField
              label="Provincia"
              name="provinciaTutor"
              value={formData.provinciaTutor}
              onChange={handleInputChange}
              placeholder="Seleccionar provincia"
              options={provinciaOptions}
              required
            />
            
          <InputField
            label="Teléfono"
            name="telefonoCelTutor"
            type="tel"
            value={formData.telefonoCelTutor}
            onChange={handleInputChange}
            placeholder="1112345678"
            required
          />
          <InputField
            label="Teléfono Fijo"
            name="telefonoLineaTutor"
            type="tel"
            value={formData.telefonoLineaTutor}
            onChange={handleInputChange}
            placeholder="12345678"
          />
        </div>  
        <InputField
          label="Email"
          name="emailTutor"
          type="email"
          value={formData.emailTutor}
          onChange={handleInputChange}
          placeholder="tutor@email.com"
          required
        />
    </div>
  );
};