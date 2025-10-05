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
    calle: '',
    numero: '',
    localidad: '',
    provincia: '',
    telefono: '',
    email: '',
    cursoSolicitado: '',
    nivelEducativo: '',
    turnoSolicitado: '',
    especialidadSolicitado: '',
    nombreTutor: '',
    apellidoTutor: '',
    dniTutor: '',
    calleTutor:'',
    numeroTutor:'',
    localidadTutor: '',
    provinciaTutor:'',
    telefonoCelTutor: '',
    telefonoLineaTutor:'',
    emailTutor: '',
    relacionTutor: '',
    certificadoNacimiento: false,
    certificadoEstudios: false,
    fotocopia_dni: false,
    certificadoMedico: false,
    archivos: {
      certificadoNacimiento: null,
      certificadoEstudios: null,
      fotocopia_dni: null,
      certificadoMedico: null
    }
  };
   const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
  setFormData(prev => {
    const newData = {
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    };
    
    // Limpiar especialidad si cambia el nivel y NO es secundaria
    if (name === 'nivelEducativo' && value !== 'Secundaria') {
      newData.especialidadSolicitado = '';
    }
    
    return newData;
  });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  const handleSubmit = async () => {
    //console.log('Datos del formulario:', formData);
    try {
      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      const datosJSON = {
        alumno: {
          dni: formData.dni,
          nombre:formData.nombreEstudiante,
          apellido: formData.apellidoEstudiante,
          calle: formData.calle,
          numero: formData.numero,
          localidad: formData.localidad,
          provincia: formData.provincia,
          telefono: formData.telefono,
          email: formData.email,
          fechaNacimiento: formData.fechaNacimiento
        },
        tutor: {
          dni: formData.dniTutor,
          nombre: formData.nombreTutor,
          apellido: formData.apellidoTutor,
          calle: formData.calleTutor,
          numero: formData.numeroTutor,
          localidad: formData.localidadTutor,
          provincia: formData.provinciaTutor,
          telefonoCel: formData.telefonoCelTutor,
          telefonoLinea: formData.telefonoLinea,
          email: formData.emailTutor
        },
        curso: {
          nivel: formData.nivelEducativo,
          grado: formData.cursoSolicitado,
          turno: formData.turnoSolicitado,
          especialidad: formData.nivelEducativo === 'Secundario' 
          ? formData.especialidadSolicitado 
          : null
        },
        relacion:formData.relacionTutor
      };

      formDataToSend.append('data', JSON.stringify(datosJSON));
      const tiposDocumento = ['certificadoNacimiento', 'certificadoEstudios', 'fotocopia_dni', 'certificadoMedico'];
      tiposDocumento.forEach(tipo => {
        // Solo agregar si el checkbox está marcado Y hay un archivo
        if (formData[tipo] && formData.archivos[tipo]) {
          formDataToSend.append(tipo, formData.archivos[tipo]);
        }
      });
       // Debug: Ver qué se está enviando
      console.log('Enviando datos...');
      console.log('Archivos marcados:', {
        certificadoNacimiento: formData.certificadoNacimiento,
        certificadoEstudios: formData.certificadoEstudios,
        fotocopia_dni: formData.fotocopia_dni,
        certificadoMedico: formData.certificadoMedico
      });

      console.log('Archivos subidos:', formData.archivos);
      //hacemos peticion al back
      const response = await fetch('http://localhost:3002/api/inscripcion', {
        method: 'POST',
        body: formDataToSend
      });
      const resultado = await response.json();
      if (response.ok){
        toast.success('¡Inscripción enviada exitosamente!');
        console.log('Inscripción creada con ID:', resultado.id);
        handleClear();
      }else{
        // Manejar errores del backend
        toast.error(resultado.error || 'Error al enviar la inscripción');
        console.error('Error del servidor:', resultado);
      }
    } catch(error){
      console.error('Error al enviar inscripción:', error);
      toast.error('Error de conexión. Por favor, intenta nuevamente.');
    }
  };

  //limpiar form
  const handleClear = () => {
    setFormData(initialFormData);
    setCurrentStep(1); // Reinicia al primer paso
    setIsOpen(false);  // Cierra el modal
  };

  const handleFileChange = (name, file) => {
    setFormData((prev) => ({
      ...prev,
      archivos: {
        ...prev.archivos,
        [name]: file,
      },
    }));
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
        return <DocumentacionRequerida formData={formData} handleInputChange={handleInputChange}  handleFileChange={handleFileChange} />;
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
        )}

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


