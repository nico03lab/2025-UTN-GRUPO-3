import { NavLink } from "react-router-dom";


const CardNota = ({ texto, path, descripcion, icon: Icon }) => {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="card bg-base-100 w-full shadow-md hover:shadow-lg transition-all duration-300 border border-base-300 group-hover:border-primary/30 relative z-10">
        <div className="card-body p-8 flex flex-col items-center text-center"> {/* Agregué flex flex-col items-center para centrar todo */}
          {Icon && (
            <div className="flex justify-center mb-6">
              <Icon className="w-11 h-11 text-blue-400  group-hover:scale-110 transition-transform duration-300" />
            </div>
          )}
          <h2 className="card-title !text-center text-blue-400 font-bold mx-auto"> {/* !text-center fuerza el centrado, mx-auto para margen auto */}
            {texto}
          </h2>
          <p className="text-center">{descripcion}</p> {/* Aseguré centrado en p también */}
          <div className="card-actions pt-5 justify-center">
            <NavLink to={path}>
              <button className="btn btn-wide">Ingresar</button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CardNota;
