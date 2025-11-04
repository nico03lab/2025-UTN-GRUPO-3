import { UserCheck, GraduationCap, Users, UserLock } from "lucide-react";

const roles = [
  { name: "Docente", icon: <UserCheck size={40} /> },
  { name: "Estudiante", icon: <GraduationCap size={40} /> },
  { name: "Padre", icon: <Users size={40} /> },
  { name: "Directivo", icon: <UserLock size={40} /> },
];

export default function RoleSlider({ selected, setSelected }) {
  return (
    <div className="w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4 text-center">Seleccionar Rol</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {roles.map((role) => {
          const active = selected === role.name;
          return (
            <button
              key={role.name}
              onClick={() => setSelected(role.name)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition-all
                ${active ? "bg-primary text-white scale-105" : "bg-base-100 hover:bg-base-200"}`}
            >
              {role.icon}
              <span className="mt-2 text-sm font-medium">{role.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
