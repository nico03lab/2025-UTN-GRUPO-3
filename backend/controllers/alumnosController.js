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

const updateStateAlumno = (req, res) => {
  const { dni } = req.params;
  const { estado } = req.body;

  try {
    db.prepare("UPDATE Alumnos SET Estado = ? WHERE DNIAlumno = ?").run(estado, dni);
    res.json({ message: `✅ Estado actualizado a "${estado}"` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCursoAlumno = (req, res) => {
  const { dni } = req.params;
  const { idCurso } = req.body;

  console.log("📥 PUT /api/alumnos/:dni/curso");
  console.log("dni:", dni);
  console.log("idCurso:", idCurso);

  try {
    const result = db
      .prepare("UPDATE Alumnos SET IdCurso = ?, Estado = ? WHERE DNIAlumno = ?")
      .run(idCurso, "activo", dni);

    console.log("✅ Resultado DB:", result);
    res.json({ message: `Alumno ${dni} asignado al curso ${idCurso}` });
  } catch (err) {
    console.error("❌ Error SQL:", err.message);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getAlumnos, getAlumnosPorCurso , getAlumnoByDNI, createAlumno, updateStateAlumno, updateCursoAlumno};
