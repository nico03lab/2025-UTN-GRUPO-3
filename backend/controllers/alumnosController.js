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
      SELECT DNIAlumno, Apellido, Nombres
      FROM Alumnos
      WHERE IdCurso = ?
    `).all(idCurso);
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAlumnoByDNI = (dni) => {
  return db.prepare('SELECT * FROM Alumnos WHERE DNIAlumno = ?').get(dni);
};

//Esto cuando se realiza la inscripcion, falta confirmarlo, es interno
const createAlumno = (datosAlumno) => {
  let idLocalidad;
  const localidadExistente = getLocalidadByNombre(datosAlumno.localidad, datosAlumno.provincia );
  if (localidadExistente){
    idLocalidad = localidadExistente.IdLocalidad;
  }else {
    idLocalidad = createLocalidad(datosAlumno.localidad, datosAlumno.provincia);
  }
  const fechaAlta = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const estado = "Inscripcion en tramite";
  const stmt = db.prepare('INSERT INTO Alumnos (DNIAlumno, Apellido, Nombres, Calle, Numero, IdLocalidad, Telefono, Email, Estado, FechaNacimiento, FechaAlta) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  stmt.run(datosAlumno.dni, datosAlumno.apellido, datosAlumno.nombre, datosAlumno.calle, datosAlumno.numero, idLocalidad, datosAlumno.telefono, datosAlumno.email, estado, datosAlumno.fechaNacimiento, fechaAlta);
}


module.exports = { getAlumnos, getAlumnosPorCurso , getAlumnoByDNI, createAlumno};
