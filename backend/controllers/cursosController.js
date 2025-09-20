const db = require('../db/db');

const getCursos = (req, res) => {
  try {
    const cursos = db.prepare('SELECT * FROM Cursos').all();
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCursos };
