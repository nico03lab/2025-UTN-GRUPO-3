export const NavigationFooter = ({ currentStep, totalSteps, onPrevious, onNext, onSubmit, onClear }) => {
  return (
    <div className="bg-base-100 rounded-lg shadow-sm p-6 mt-6">
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className="btn btn-outline btn-primary"
        >
          ← Anterior
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClear}
            className="btn btn-ghost"
          >
            Limpiar
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={onNext}
              className="btn btn-primary"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              className="btn btn-success"
            >
              Enviar Inscripción
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
