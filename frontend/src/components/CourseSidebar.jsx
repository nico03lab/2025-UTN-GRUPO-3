import { BookOpenIcon, CheckCircleIcon, CalendarIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

export default function CourseSidebar({ cursos, selectedCurso, setSelectedCurso, tab, setTab }) {

  return (
    <div className="bg-base-100 rounded-box p-4 shadow">
      <div className="text-sm opacity-70 mb-4">Cursos asignados</div>
      <div className="space-y-2">
        {Array.isArray(cursos) && cursos.map((c, index) => {
          return (
<button
  key={c.IdCurso}
  onClick={() => { setSelectedCurso(c.IdCurso); setTab('attendance'); }}
  className={`w-full text-left p-3 rounded-box flex items-center gap-3 relative overflow-hidden 
             transition-all duration-200 transform active:scale-95
             ${selectedCurso === c.IdCurso 
               ? 'bg-emerald-800 text-white shadow-md' 
               : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
>
                <div className="relative flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-box">
                    <BookOpenIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{c.Grado}°{c.Letra} {c.Nivel}</div>
                    <div className="text-xs opacity-70">7 alumnos</div>
                  </div>
                </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-t pt-4 opacity-70 text-sm space-y-2">
        <button 
          onClick={() => setTab('attendance')} 
          className={`flex items-center gap-3 w-full p-2 rounded-box ${tab === 'attendance' ? 
            'bg-primary text-primary-content' : 
            'hover:bg-base-200'}`}
        >
          <CheckCircleIcon className="h-5 w-5" />
          Pasar Asistencia
        </button>
        
        <button 
          onClick={() => setTab('schedule')} 
          className={`flex items-center gap-3 w-full p-2 rounded-box ${tab === 'schedule' ? 
            'bg-secondary text-secondary-content' : 
            'hover:bg-base-200'}`}
        >
          <CalendarIcon className="h-5 w-5" />
          Ver Horarios
        </button>
        
        <button 
          onClick={() => setTab('grades')} 
          className={`flex items-center gap-3 w-full p-2 rounded-box ${tab === 'grades' ? 
            'bg-accent text-accent-content' : 
            'hover:bg-base-200'}`}
        >
          <AcademicCapIcon className="h-5 w-5" />
          Calificar Alumnos
        </button>
      </div>
    </div>
  );
}
