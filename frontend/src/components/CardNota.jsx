import { NavLink } from "react-router-dom";

const CardNota = ({texto, path, descripcion}) => {
  return (
    <div className="card bg-base-300 w-full">
        <div className="card-body">
            <h2 className="card-title text-accent font-bold lg:text-2xl">{texto}</h2>
            <p>{descripcion}</p>
            <div className="card-actions justify-end">
                <NavLink to={path}>
                    <button className="btn btn-primary">{texto}</button>
                </NavLink>
            </div>
        </div>
    </div>
  )
}

export default CardNota;
