export const StepsInscription = ({ currentStep, totalSteps }) => {
  const steps = [
    { id: 1, title: 'Datos del Estudiante' },
    { id: 2, title: 'Informacion Academica' },
    { id: 3, title: 'Datos del Tutor' },
    { id: 4, title: 'Documentacion Requerida' }
  ];

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Progreso de Inscripción</h2>
      </div>

      {/* DaisyUI Steps con ✓ para pasos completados */}
      <ul className="steps steps-vertical lg:steps-horizontal">
        {steps.map((step) => (
          <li
            key={step.id}
            className={`step ${currentStep > step.id ? 'step-primary' : currentStep === step.id ? 'step-primary' : ''}`}
          >
            <span>
              {currentStep > step.id ? '✓' : step.id} {step.title}
            </span>
          </li>
        ))}
      </ul>

      {/* Título y descripción del paso actual */}
      <div className="mt-4 ">
        <h3 className="font-medium text-base-content">
          {steps[currentStep - 1]?.title}
        </h3>
        <p className="text-sm text-base-content/60">
          Complete la información requerida para continuar
        </p>
      </div>
    </div>
  );
};

