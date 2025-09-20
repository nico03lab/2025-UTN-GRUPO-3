const db = require('../db/db');

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

module.exports = { getAlumnos, getAlumnosPorCurso };
