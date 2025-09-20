const db = require('../db/db');

const createAsistencia = (req, res) => {
  const { curso, fecha, asistencia } = req.body;
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO Asistencias (DNIAlumno, IdCurso, Fecha, Presente)
      VALUES (?, ?, ?, ?)
    `);

    const insertMany = db.transaction((arr) => {
      for (const a of arr) stmt.run(a.DNI, curso, fecha, a.Presente);
    });

    insertMany(asistencia);
    res.json({ message: 'Asistencia guardada ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createAsistencia };
