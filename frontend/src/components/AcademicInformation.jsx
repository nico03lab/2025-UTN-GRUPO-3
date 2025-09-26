import { InputField } from "./InputField";
 
 // Componente Paso 2: Información Académica
export const InformacionAcademica = ({ formData, handleInputChange }) => {
  const nivelOptions = [
    { value: 'inicial', label: 'Inicial' },
    { value: 'primaria', label: 'Primaria' },
    { value: 'secundaria', label: 'Secundaria' }
  ];
  const turnoOptions = [
    { value: 'Mañana', label: 'Mañana' },
    { value: 'Tarde', label: 'Tarde' }
  ];

  // Función para obtener opciones de curso dinámicas basado en nivel
  const getCursoOptions = (nivel) => {
    switch (nivel) {
      case 'inicial':
        return [
          { value: 'sala3', label: 'Sala de 3' },
          { value: 'sala4', label: 'Sala de 4' },
          { value: 'sala5', label: 'Sala de 5' }
        ];
      case 'primaria':
        return [
          { value: '1ro', label: '1° Grado' },
          { value: '2do', label: '2° Grado' },
          { value: '3ro', label: '3° Grado' },
          { value: '4to', label: '4° Grado' },
          { value: '5to', label: '5° Grado' },
          { value: '6to', label: '6° Grado' },
          { value: '7mo', label: '7° Grado' } // Agregado para primaria
        ];
        case 'secundaria':
        return [
          { value: '1ro', label: '1° Año' },
          { value: '2do', label: '2° Año' },
          { value: '3ro', label: '3° Año' },
          { value: '4to', label: '4° Año' },
          { value: '5to', label: '5° Año' } // Hasta 5to para secundaria
        ];
      default:
        return []; // Opciones vacías si no hay nivel seleccionado
    }
  };
   const cursoOptions = getCursoOptions(formData.nivelEducativo); // Computa dinámicamente


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
        {/* Opcional: Mensaje si no hay opciones de curso */}
        {!formData.nivelEducativo && (
            <p className="text-sm text-gray-500 mt-2">Selecciona un nivel para ver los cursos disponibles.</p>
        )}
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