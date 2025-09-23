import { InputField } from "./InputField";
import { InscriptionHeader } from "./InscriptionHeader";
import { StepsInscription } from "./StepsInscription";
import { NavigationFooter } from "./NavidationField";
import { FileUpload} from "./FileUpload";
import { useState } from "react";
import { toast } from "react-toastify";


export const InscripcionForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const initialFormData = {
    nombreEstudiante: '',
    apellidoEstudiante: '',
    dni: '',
    fechaNacimiento: '',
    genero: '',
    direccion: '',
    telefono: '',
    email: '',
    cursoSolicitado: '',
    nivelEducativo: '',
    turnoSolicitado: '',
    nombreTutor: '',
    apellidoTutor: '',
    dniTutor: '',
    relacionTutor: '',
    telefonoTutor: '',
    emailTutor: '',
    certificadoNacimiento: false,
    certificadoEstudios: false,
    fotocopia_dni: false,
    certificadoMedico: false
  };
   const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const handleSubmit = () => {
    console.log('Datos del formulario:', formData);
    toast.success('¡Inscripción enviada exitosamente!');
  };

//limpiar form
  const handleClear = () => {
    setFormData(initialFormData);
    setCurrentStep(1); // Reinicia al primer paso
    setIsOpen(false);  // Cierra el modal
  };


  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DatosEstudiante formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <InformacionAcademica formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <DatosTutor formData={formData} handleInputChange={handleInputChange} />;
      case 4:
        return <DocumentacionRequerida formData={formData} handleInputChange={handleInputChange} />;
      default:
        return <DatosEstudiante formData={formData} handleInputChange={handleInputChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-4xl mx-auto p-4">
        <InscriptionHeader currentStep={currentStep} totalSteps={totalSteps} />
        <StepsInscription currentStep={currentStep} totalSteps={totalSteps} />
        
        {renderCurrentStep()}
        

        {/* Modal de DaisyUI */}
        {isOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">¿Estás seguro?</h3>
              <p className="py-4">
                Esto limpiará todo el formulario y volverás al primer paso.
              </p>
              <div className="modal-action">
                <button className="btn" onClick={() => setIsOpen(false)}>Cancelar</button>
                <button className="btn btn-error" onClick={handleClear}>Limpiar</button>
              </div>
            </div>
          </div>
        )};

        <NavigationFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={prevStep}
          onNext={nextStep}
          onSubmit={handleSubmit}
          onClear={() => setIsOpen(true)}
        />
      </div>
    </div>
  );
};

// Componente Paso 1: Datos del Estudiante
const DatosEstudiante = ({ formData, handleInputChange }) => {
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
// Componente Paso 2: Información Académica
const InformacionAcademica = ({ formData, handleInputChange }) => {
  const nivelOptions = [
    { value: 'inicial', label: 'Inicial' },
    { value: 'primaria', label: 'Primaria' },
    { value: 'secundaria', label: 'Secundaria' }
  ];
  const turnoOptions = [
    { value: 'Mañana', label: 'Mañana' },
    { value: 'Tarde', label: 'Tarde' }
  ];

  const cursoOptions = [
    { value: '1ro', label: '1° Año' },
    { value: '2do', label: '2° Año' },
    { value: '3ro', label: '3° Año' },
    { value: '4to', label: '4° Año' },
    { value: '5to', label: '5° Año' },
    { value: '6to', label: '6° Año' }
  ];

  return (
    <div className="bg-base-100 rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Nivel Educativo"
          name="nivelEducativo"
          value={formData.nivelEducativo}
          onChange={handleInputChange}
          placeholder="Seleccionar nivel"
          options={nivelOptions}
          required
        />
        
        <InputField
          label="Curso Solicitado"
          name="cursoSolicitado"
          value={formData.cursoSolicitado}
          onChange={handleInputChange}
          placeholder="Seleccionar curso"
          options={cursoOptions}
          required
        />
        <InputField
          label="Turno Solicitado"
          name="turnoSolicitado"
          value={formData.turnoSolicitado}
          onChange={handleInputChange}
          placeholder="Seleccionar turno"
          options={turnoOptions}
          required
        />
      </div>
    </div>
  );
};
// Componente Paso 3: Datos del Tutor
const DatosTutor = ({ formData, handleInputChange }) => {
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
// Componente Paso 4: Documentación
const DocumentacionRequerida = ({ formData, handleInputChange }) => {
  const documentos = [
    { name: 'certificadoNacimiento', label: 'Certificado de Nacimiento' },
    { name: 'certificadoEstudios', label: 'Certificado de Estudios' },
    { name: 'fotocopia_dni', label: 'Fotocopia DNI (estudiante y tutor)' },
    { name: 'certificadoMedico', label: 'Certificado Médico' }
  ];

  return (
    <div className="bg-base-100 rounded-lg shadow-sm p-6">
      <div className="space-y-4">
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Marque los documentos que presenta con la solicitud de inscripción</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentos.map(doc => (
            <div key={doc.name} className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  name={doc.name}
                  checked={formData[doc.name]}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">{doc.label}</span>
              </label>
            </div>
          ))}
        </div>
        <FileUpload></FileUpload>
      </div>
    </div>
  );
};