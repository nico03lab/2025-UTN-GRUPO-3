const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db/db');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Ruta de test
app.get('/', (req, res) => {
  res.send('Backend conectado y funcionando ✅');
});

app.get('/cursos', (req, res) => {
  try {
    const cursos = db.prepare('SELECT * FROM Cursos').all();
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/alumnos-por-curso/:idCurso', (req, res) => {
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
});

app.post('/asistencias', (req, res) => {
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
});

// Obtener todos los alumnos
app.get('/alumnos', (req, res) => {
  try {
    const alumnos = db.prepare('SELECT * FROM Alumnos').all();
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un alumno de prueba
app.post('/alumnos', (req, res) => {
  try {
    const { DNI, Apellido, Nombres } = req.body;
    db.prepare('INSERT INTO Alumnos (DNI, Apellido, Nombres) VALUES (?, ?, ?)')
      .run(DNI, Apellido, Nombres);
    res.json({ message: 'Alumno creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
