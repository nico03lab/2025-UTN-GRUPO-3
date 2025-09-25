const db = require('../db/db');

const getCursosPorProfe = (req, res) => {
  const { DNIDocente } = req.params;
  try {
    const cursos = db.prepare(`SELECT c.IdCurso FROM Cursos c
                              JOIN CursoMateria cm ON cm.IdCurso = c.IdCurso
                              WHERE cm.DNIDocente = ?;
                              `).all(DNIDocente);
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { getCursosPorProfe };
