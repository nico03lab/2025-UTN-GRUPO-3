
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  BookOpenIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import domToImage from 'dom-to-image'; // En lugar de html2canvas
import { useRef } from 'react';
import { toast } from "react-toastify";


export default function ScheduleTab({ horarios, viewMode = "cards" }) {
  const horarioRef = useRef(null); // Referencia al elemento a descarga
  if (!horarios || horarios.length === 0) {
    return (
      <div className="text-center py-10 opacity-60">
        <CalendarIcon className="h-10 w-10 mx-auto mb-2" />
        No hay horarios asignados
      </div>
    );
  }

  const ordenDias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

  // Obtener dinámicamente todas las horas únicas de los horarios
  const horasEscolares = [...new Set(horarios.map(h => h.hora?.trim()))]
    .filter(Boolean) // Eliminar valores vacíos
    .sort(); // Ordenar cronológicamente
  // Agrupar por día de semana
  const horariosPorDia = horarios.reduce((acc, h) => {
    const dia = h.dia?.trim() || "";
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(h);
    return acc;
  }, {});

  // Crear matriz de horarios [hora][dia]
  const matrizHorarios = {};
  
  horarios.forEach(h => {
    const hora = h.hora?.trim() || "";
    const dia = h.dia?.trim() || "";
    
    if (hora && dia) {
      if (!matrizHorarios[hora]) {
        matrizHorarios[hora] = {};
      }
      
      matrizHorarios[hora][dia] = h;
    }
  });

  // Colores por materia
  const coloresPorMateria = {
    "Matemática": "bg-blue-100 border-blue-300 text-blue-900",
    "Geografia": "bg-pink-100 border-pink-300 text-pink-900",
    "Informatica": "bg-green-100 border-green-300 text-green-900",
    "Historia": "bg-purple-100 border-purple-300 text-purple-900",
    "Geografía": "bg-yellow-100 border-yellow-300 text-yellow-900",
    "Inglés": "bg-orange-100 border-orange-300 text-orange-900",
    "Lengua y literatura": "bg-red-100 border-red-300 text-red-900",
    "Educación Física": "bg-indigo-100 border-indigo-300 text-indigo-900",
    "Biologia": "bg-teal-100 border-teal-400 text-teal-900",
    "Derecho": "bg-lime-100 border-lime-400 text-lime-900",
    "Quimica": "bg-amber-100 border-amber-400 text-amber-900",
    "Fisica": "bg-cyan-100 border-cyan-400 text-cyan-900",
    "Economia": "bg-slate-100 border-slate-400 text-slate-900"
  };
  
  const getColorMateria = (materia) => {
    return coloresPorMateria[materia] || "bg-gray-100 border-gray-300 text-gray-900";
  };

  // Función para descargar como imagen
  const descargarHorario = async () => {
    console.log("Iniciando descarga...");
  console.log("📦 Referencia:", horarioRef.current);
    if (!horarioRef.current) {
    toast.error("No se encontró el elemento del horario");
    return;
  }

    try {
      const imgData = await domToImage.toPng(horarioRef.current, {
        quality: 1, // Mejor calidad (0-1)
        bgcolor: '#ffffff', // Fondo blanco
      });

      const link = document.createElement('a');
      link.download = `horario-${new Date().toISOString().split('T')[0]}.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Horario descargado exitosamente');
    } catch (error) {
      console.error("Error completo:", error);
      toast.error('Error al descargar el horario');
    }
  };

  return (
    <section className="space-y-4">
      <div className="text-sm opacity-70 mb-4 flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        {viewMode === "cards" ? "Horario Escolar" : "Todos los horarios del docente"}

      </div>
      
      {viewMode === "cards" ? (
        <div className="overflow-x-auto shadow-lg ">
          <div className="flex justify-end">
            {/* Botón de descarga */}
              <button 
                onClick={descargarHorario}
                className="btn btn-outline btn-info"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Descargar Horario
              </button>
          </div>
          <div ref={horarioRef} className=" p-4 rounded-box">

          <table className="table table-zebra w-full border-collapse">
            <thead>
              <tr className="bg-blue-500 text-primary-content">
                <th className="w-32 text-center sticky left-0 bg-blue-500  z-10">
                  <ClockIcon className="h-5 w-5 mx-auto mb-1" />
                  Horario
                </th>
                {ordenDias.map((dia) => (
                  <th key={dia} className="text-center min-w-40">
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horasEscolares.map((hora, idx) => (
                <tr key={hora} className={idx % 2 === 0 ? "bg-base-100" : "bg-base-200"}>
                  <td className="text-center font-semibold text-xs sticky left-0 bg-base-100 border-r-2 border-base-300">
                    <div className="flex flex-col items-center">
                      <ClockIcon className="h-4 w-4 mb-1 opacity-50" />
                      {hora}
                    </div>
                  </td>
                  
                  {ordenDias.map((dia) => {
                    const clase = matrizHorarios[hora]?.[dia];
                    
                    return (
                      <td
                        key={`${hora}-${dia}`}
                        className="p-1 border border-base-300"
                      >
                        {clase ? (
                          <div
                            className={`p-2 rounded-lg border-2 h-full min-h-20 flex flex-col justify-center ${getColorMateria(
                              clase.materia
                            )}`}
                          >
                            <div className="font-semibold text-sm mb-1 flex items-center gap-1">
                              <BookOpenIcon className="h-4 w-4" />
                              {clase.materia}
                            </div>
                            <div className="text-xs opacity-70 flex items-center gap-1">
                              <MapPinIcon className="h-3 w-3" />
                              Aula {clase.aula}
                            </div>
                            {clase.IdCurso && (
                              <div className="text-xs opacity-60 mt-1">
                                {clase.IdCurso}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-20 flex items-center justify-center opacity-20">
                            —
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          
          {/* Leyenda de colores */}
          <div className="bg-base-200 rounded-box p-4 mt-4">
            <h4 className="font-semibold text-sm mb-2 opacity-70">Materias del horario:</h4>
            <div className="flex flex-wrap gap-2">
              {[...new Set(horarios.map(h => h.materia))].map((materia) => (
                <div
                  key={materia}
                  className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getColorMateria(
                    materia
                  )}`}
                >
                  {materia}
                </div>
              ))}
            </div>
          </div>
        </div>
        
      ) : (
        <div className="space-y-5">
          {ordenDias.map((dia) => {
            const items = horariosPorDia[dia];
            if (!items) return null;

            return (
              <div key={dia} className="bg-base-200 rounded-box p-4 shadow">
                <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {dia}
                </h3>
                <ul className="divide-y divide-base-300">
                  {items.map((h, i) => (
                    <li
                      key={i}
                      className="py-2 flex justify-between items-center text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {h.materia} • {h.IdCurso}
                        </span>
                        <span className="opacity-70 flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          Aula {h.aula}
                        </span>
                      </div>
                      <div className="text-right opacity-80">{h.hora}</div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
