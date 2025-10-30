const db = require('../db/db');

const getCursosPorProfe = (req, res) => {
  const { DNIDocente } = req.params;
  try {
    const cursos = db.prepare(`SELECT c.IdCurso, c.Nivel, c.Letra, c.Grado FROM Cursos c
                              JOIN CursoMateria cm ON cm.IdCurso = c.IdCurso
                              WHERE cm.DNIDocente = ?;
                              `).all(DNIDocente);
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCursoByNivelYTurno = (nivel, grado, turno, especialidad)=>{
  const esp = db.prepare('SELECT * FROM Especialidades WHERE Nombre=?').get(especialidad);
  if (!esp) {
    throw new Error(`Especialidad no encontrada: ${especialidad}`);
  }
  return db.prepare('SELECT * FROM Cursos WHERE Nivel = ? AND Grado= ? AND Turno=? AND IdEspecialidad=?').get(nivel,grado,turno, esp.IdEspecialidad);
}

const getCursos = (req, res) => {
  try {
    const cursos = db.prepare(`
      SELECT 
        c.IdCurso,
        c.Nivel,
        c.Grado,
        c.Letra,
        c.Turno,
        c.CantMaxAlumnos,
        e.Nombre AS Especialidad
      FROM Cursos c
      LEFT JOIN Especialidades e ON c.IdEspecialidad = e.IdEspecialidad
      ORDER BY c.Nivel, c.Grado, c.Turno, c.Letra
    `).all();

    res.json(cursos);
  } catch (err) {
    console.error("❌ Error en getCursos:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getCursosDisponibles= (req,res) =>{
  try {
    const cursos = db.prepare(`
      SELECT 
        c.IdCurso,
        e.Nombre as Especialidad,
        c.Turno,
        m.Nombre as Materia, 
        m.IdMateria
        FROM Cursos c 
        JOIN CursoMateria cm ON c.IdCurso = cm.IdCurso 
        JOIN Especialidades e ON e.IdEspecialidad = c.IdEspecialidad
        JOIN Materias m ON m.IdMateria = cm.IdMateria
        WHERE cm.DNIDocente IS NULL`).all();
    console.log(cursos);
    res.json(cursos);
  } catch (error) {
    console.error("❌ Error en obtener cursos-materias disponibles:", err.message);
    res.status(500).json({ error: error.message });
  }
}
module.exports = { getCursosPorProfe , getCursoByNivelYTurno, getCursos, getCursosDisponibles};
