import { BellIcon, CogIcon, MoonIcon, SunIcon, XCircleIcon} from '@heroicons/react/24/outline';

export default function UserHeader({ user, notifications = 0, toggleTheme, theme = 'light', onLogout, onSettings}) {
    return (
        <header className="flex items-center justify-between mb-6 bg-base-100 p-4 rounded-box shadow">
            {/* Avatar y nombre */}
            <div className="flex items-center gap-4">
                <div className="avatar online">
                <div className="w-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-lg font-semibold">
                    {user.name.charAt(0)}
                </div>
                </div>
                <div>
                <div className="text-lg font-semibold">{user.name}</div>
                <div className="text-sm opacity-70">{user.email}</div>
                </div>
            </div>

            {/* Acciones: notificaciones, tema, configuración, cerrar sesión */}
            <div className="flex items-center gap-2">
                {/* Notificaciones */}
                <div className="dropdown dropdown-end">
                    <button 
                        type="button" 
                        className="btn btn-ghost btn-circle"
                        aria-label="Notificaciones"
                    >
                        <div className="indicator">
                            <BellIcon className="h-5 w-5" />
                            {notifications > 0 && (
                                <span className="badge badge-xs badge-primary indicator-item">{notifications}</span>
                            )}
                        </div>
                    </button>

                    <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
                        <div className="card-body">
                            <span className="font-bold text-lg">{notifications} Notificaciones</span>
                            <span className="text-info">Tienes mensajes sin leer</span>
                        </div>
                    </div>
                </div>

                {/* Toggle tema */}
                <button 
                type="button" 
                className="btn btn-ghost btn-circle" 
                onClick={toggleTheme} 
                aria-label="Cambiar tema"
                >
                    {theme === 'light' ? (
                        <MoonIcon className="h-5 w-5" />
                    ) : (
                        <SunIcon className="h-5 w-5" />
                    )}
                </button>

                {/* Configuración */}
                <button 
                type="button" 
                className="btn btn-ghost btn-circle" 
                onClick={onSettings} 
                aria-label="Configuración"
                >
                    <CogIcon className="h-6 w-6" />
                </button>

                {/* Cerrar sesión */}
                <button 
                type="button" 
                className="btn btn-outline btn-sm flex items-center gap-2"
                onClick={onLogout}
                >
                    <XCircleIcon className="h-4 w-4" />
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}
