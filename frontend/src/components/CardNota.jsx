import { NavLink } from "react-router-dom";

const CardNota = ({texto, path}) => {
  return (
    <div className="card bg-base-300 w-full">
        <div className="card-body">
            <h2 className="card-title text-accent font-bold lg:text-2xl">{texto}</h2>
            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
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
