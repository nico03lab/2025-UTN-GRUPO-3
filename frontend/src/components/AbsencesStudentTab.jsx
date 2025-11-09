import {useState} from "react";

const AbsencesStudentTab = ({ inasistencias, faltasMateria }) => {
    const [expandedMateria, setExpandedMateria] = useState(null);
  // Agrupar inasistencias por materia
  const inasistenciasPorMateria = inasistencias?.reduce((acc, i) => {
    if (i.Presente === 'Ausente') {
      if (!acc[i.Materia]) {
        acc[i.Materia] = [];
      }
      acc[i.Materia].push(i.Fecha);
    }
    return acc;
  }, {});

  const toggleExpand = (materia) => {
    setExpandedMateria(expandedMateria === materia ? null : materia);
  };


  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th className="text-left font-bold text-base text-base-content">Materia</th>
             <th className="text-left font-bold text-base text-base-content">Última Falta</th>
            <th className="text-left font-bold text-base text-base-content">Total Faltas</th>
            <th className="text-left font-bold text-base text-base-content">Ver Todas</th>
          </tr>
        </thead>
        <tbody>
          {faltasMateria && faltasMateria.length > 0 ? (
                faltasMateria.map(item => {
                    const fechas = inasistenciasPorMateria[item.Materia] || [];
                    const ultimaFalta = fechas[0];
                    const isExpanded = expandedMateria === item.Materia;
                    return (
                        <>
                        <tr key={item.Materia}>
                            <td className="font-semibold">{item.Materia}</td>
                            <td>
                            {ultimaFalta && (
                                <span className="badge badge-ghost">
                                {ultimaFalta}
                                </span>
                            )}
                            </td>
                            <td>
                            <span className="badge badge-error font-bold">
                                {item.TotalFaltas}
                            </span>
                            </td>
                            <td>
                            {fechas.length > 1 && (
                                <button 
                                onClick={() => toggleExpand(item.Materia)}
                                className="btn btn-ghost btn-xs"
                                >
                                {isExpanded ? '▲ Ocultar' : `▼ Ver todas (${fechas.length})`}
                                </button>
                            )}
                            </td>
                        </tr>
                        {isExpanded && (
                            <tr key={`${item.Materia}-expanded`}>
                                <td colSpan="4" className="bg-base-200">
                                    <div className="p-4">
                                    <h4 className="font-semibold mb-2">Todas las faltas de {item.Materia}:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {fechas.map((fecha, idx) => (
                                            <span key={idx} className="badge badge-outline">
                                                {fecha}
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </>
                    );
                })
            ) : (
                <tr>
                <td colSpan="4" className="text-center text-base text-gray-500">
                    No hay datos de inasistencias.
                </td>
                </tr>
            )}
        </tbody>
      </table>
    </div>
  );
};

export default AbsencesStudentTab;