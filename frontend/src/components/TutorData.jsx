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
        
        <InputField
          label="Teléfono"
          name="telefonoTutor"
          type="tel"
          value={formData.telefonoTutor}
          onChange={handleInputChange}
          placeholder="11-1234-5678"
          required
        />
        
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
    </div>
  );
};