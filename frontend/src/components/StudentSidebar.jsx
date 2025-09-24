import { CalendarClock, UserRoundCheck ,CircleUser, BookCheck } from 'lucide-react'

export const StudentSidebar = ({ estudiantes, selectedEstudiante, setSelectedEstudiante, tab, setTab }) => {
  return (
    <div className="bg-base-100 rounded-box p-4 shadow">
      <div className="text-sm opacity-70 mb-4">Estudiantes</div>
      <div className="space-y-2">
        {estudiantes.map(c => (
          <button
            key={c.IdEstudiante}
            onClick={() => { setSelectedEstudiante(c.IdEstudiante); }}
            className={`w-full text-left p-3 rounded-box flex items-center gap-3 ${selectedEstudiante === c.IdEstudiante ? 
              `bg-${c.color} text-${c.color}-content` : 
              'hover:bg-base-200'}`}
          >
            <div className={`bg-${c.color} bg-opacity-20 p-2 rounded-box`}>
              <CircleUser className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium">{c.Nombre} {c.Apellido} • {c.Grado} {c.Nivel}</div>
              <div className="text-xs opacity-70">DNI: {c.dni}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 opacity-70 text-sm space-y-2">
        <button  //esta parte falta implementar
          onClick={() => setTab('attendence')} 
          className={`flex items-center gap-3 w-full p-2 rounded-box ${tab === 'attendence' ? 
            'bg-primary bg-opacity-70 text-accent-content' : 
            'hover:bg-base-200'}`}
        >
          <UserRoundCheck  className="h-5 w-5" />
          Ver Asistencias y Faltas
        </button>
        <button 
          onClick={() => setTab('schedule')} 
          className={`flex items-center gap-3 w-full p-2 rounded-box ${tab === 'schedule' ? 
            'bg-secondary text-secondary-content' : 
            'hover:bg-base-200'}`}
        >
          <CalendarClock className="h-5 w-5" />
          Ver Horarios
        </button>
        
        <button 
          onClick={() => setTab('notes')} 
          className={`flex items-center gap-3 w-full p-2 rounded-box ${tab === 'notes' ? 
            'bg-accent text-accent-content' : 
            'hover:bg-base-200'}`}
        >
          <BookCheck className="h-5 w-5" />
          Ver Notas
        </button>
      </div>
    </div>
  )
}
