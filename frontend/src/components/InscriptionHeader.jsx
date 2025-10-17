import ThemeToggle from "./ThemeToggle"

export const InscriptionHeader = () => {
  return (
    <div className="navbar bg-base-100 p-6 rounded-lg shadow-sm mb-6">
        <div className="flex-1">
            <a className="font-bold text-xl">Inscripciones</a>
        </div>
        <ThemeToggle/>
    </div>
  )
}
