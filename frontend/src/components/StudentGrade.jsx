import {BookCheck } from 'lucide-react'

export const StudentGrade = ({materias = []}) => {
  //console.log('Materias recibidas en StudentGrade:', materias);

  if (!Array.isArray(materias)) {
    return <div className="text-center py-8 text-gray-500">No hay datos disponibles.</div>;
  }

  const getNotaClass = (nota) => {
    const numNota = parseInt(nota, 10);
    const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-full font-bold text-base border transition-colors min-w-[3rem]';
    if (numNota >= 6) return `${baseClasses} badge badge-success text-lg`;
    if (numNota >= 5) return `${baseClasses} badge badge-warning text-lg`;
    return `${baseClasses} badge badge-error text-lg`;
  };

  return (
    <section>
      <div className="text-sm opacity-70 mb-4bflex items-center gap-2">
        <BookCheck className="h-5 w-5" />
        <span className='font-medium'>Notas del estudiante</span>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="table table-lg table-fixed w-full">
          <thead className='bg-base-200/50'>
            <tr>
              <th className="text-left font-bold text-base text-base-content">Materia</th>
              <th className="text-center font-bold text-base text-base-content">Nota 1° Trimestre</th>
              <th className="text-center font-bold text-base text-base-content">Nota 2° Trimestre</th>
              <th className="text-center font-bold text-base text-base-content">Nota 3° Trimestre</th>
              <th className="text-center font-bold text-base text-base-content">Nota Final</th>
              <th className="text-left font-bold text-base text-base-content">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {materias.map(a => (
              <tr key={a.IdMateria} className="hover:bg-base-200/50 transition-colors">
                <td className="py-4">
                  <div className="flex flex-col gap-1">
                    <div>
                      <div className="font-bold text-opacity-90">{a.Materia}</div>
                      <div className="text-sm text-opacity-70">Profesor/a: {a.Docente}</div>
                    </div>
                  </div>
                </td >
                <td className="py-3 text-center">
                  <div className={getNotaClass(a.NotaTrimestral1)}>{a.NotaTrimestral1}</div>
                </td>
                <td className="py-3 text-center">
                  <div className={getNotaClass(a.NotaTrimestral2)}>{a.NotaTrimestral2}</div>
                </td>
                <td className="py-3 text-center">
                  <div className={getNotaClass(a.NotaTrimestral3)}>{a.NotaTrimestral3}</div>
                </td>
                <td className="py-3 text-center">
                  <div className={getNotaClass(a.NotaFinal)}>{a.NotaFinal}</div>
                </td>
                <td className="py-4">
                  <div className="text-sm text-opacity-90 max-w-xs">
                    {a.Obs || 'Sin observaciones'} {/* Fallback para undefined */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
