const db = require('../db/db');
const {getLocalidadByNombre, createLocalidad} = require('./localidadController');


const getAlumnos = (req, res) => {
  try {
    const alumnos = db.prepare('SELECT * FROM Alumnos').all();
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAlumnosPorCurso = (req, res) => {
  const { idCurso } = req.params;
  try {
    const alumnos = db.prepare(`
      SELECT a.DNI, a.Apellido, a.Nombres
      FROM Alumnos a
      JOIN Inscripciones i ON a.DNI = i.DNIAlumno
      WHERE i.IdCurso = ?
    `).all(idCurso);
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAlumnoByDNI = (dni) => {
  return db.prepare('SELECT * FROM Alumnos WHERE DNI = ?').get(dni);
};

//Esto cuando se confirma la inscripcion, es interno
const createAlumno = (datosAlumno) => {
  let idLocalidad;
  const localidadExistente = getLocalidadByNombre(datosAlumno.localidad, datosAlumno.provincia );
  if (localidadExistente){
    idLocalidad = localidadExistente.IdLocalidad;
  }else {
    idLocalidad = createLocalidad(datosAlumno.localidad, datosAlumno.provincia);
  }
  const fechaAlta = new Date().toISOString().replace("T", " ").split(".")[0]; // YYYY-MM-DD HH:mm:ss
  const estado = "Confirmado";
  const stmt = db.prepare('INSERT INTO Alumnos (DNI, Apellido, Nombres, Calle, Numero, IdLocalidad, Telefono, Email, Estado, FechaAlta) VALUES (?,?,?,?,?,?,?,?,?,?)');
  stmt.run(datosAlumno.dni, datosAlumno.apellido, datosAlumno.nombre, datosAlumno.calle, datosAlumno.numero, idLocalidad, datosAlumno.telefono, datosAlumno.email, estado, fechaAlta);
}


module.exports = { getAlumnos, getAlumnosPorCurso , getAlumnoByDNI, createAlumno};
