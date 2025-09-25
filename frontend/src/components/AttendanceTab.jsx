import { CheckCircleIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

export default function AttendanceTab({ alumnos, attendance, toggleAttendance, saveAttendance, setAttendance }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm opacity-70 flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5" />
          Pasar asistencia del día
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-success badge-sm">
            {Object.values(attendance).filter(Boolean).length} presentes
          </span>
          <span className="badge badge-error badge-sm">
            {Object.values(attendance).length - Object.values(attendance).filter(Boolean).length} ausentes
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.isArray(alumnos) && alumnos.map(a => (
          <div 
            key={a.DNI}
            className={`p-3 rounded-box border flex items-center justify-between ${
              attendance[a.DNI] ? 'bg-success bg-opacity-10 border-success' : 'bg-error bg-opacity-10 border-error'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full">
                  <img src={'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'} alt={`${a.Nombres} ${a.Apellido}`} />
                </div>
              </div>
              <div>
                <div className="font-medium">{a.Apellido}, {a.Nombres}</div>
                <div className="text-xs opacity-70">DNI: {a.DNI}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm">{attendance[a.DNI] ? 'Presente ✅' : 'Ausente ❌'}</label>
              <input 
                type="checkbox" 
                className="toggle toggle-success"
                checked={!!attendance[a.DNI]} 
                onChange={() => toggleAttendance(a.DNI)} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={saveAttendance} className="btn btn-primary">
          <DocumentCheckIcon className="h-5 w-5" />
          Guardar asistencia
        </button>
        <button 
          onClick={() => { 
            const init = {}; 
            alumnos.forEach(a => init[a.DNI] = false); 
            setAttendance(init); 
          }} 
          className="btn btn-outline"
        >
          Limpiar
        </button>
      </div>
    </section>
  );
}
