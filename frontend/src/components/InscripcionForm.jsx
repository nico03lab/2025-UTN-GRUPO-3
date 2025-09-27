import { InscriptionHeader } from "./InscriptionHeader";
import { StepsInscription } from "./StepsInscription";
import { NavigationFooter } from "./NavidationField";
import { DatosTutor } from "./TutorData";
import { DatosEstudiante } from "./StudentData";
import { InformacionAcademica } from "./AcademicInformation";
import { DocumentacionRequerida } from "./RequiredDocumentation";
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
        

        {/* Modal de DaisyUI para limpiar form*/}
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


