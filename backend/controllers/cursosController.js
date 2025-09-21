const db = require('../db/db');

const getCursos = (req, res) => {
  try {
    const cursos = db.prepare('SELECT * FROM Cursos').all();
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getCursoByNivelYTurno = (nivel, turno)=>{
  return db.prepare('SELECT * FROM Cursos WHERE Nivel = ? AND Turno = ?').get(nivel, turno);
}

module.exports = { getCursos, getCursoByNivelYTurno };
