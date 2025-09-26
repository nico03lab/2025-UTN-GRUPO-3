import { FileUpload} from "./FileUpload";


// Componente Paso 4: Documentación
export const DocumentacionRequerida = ({ formData, handleInputChange }) => {
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