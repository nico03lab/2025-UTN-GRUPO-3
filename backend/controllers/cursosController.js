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
const getCalificacionesPorCurso = (req, res) => {
  try {
    const { idCurso } = req.params;
    const rows = db.prepare(`
      SELECT 
        a.IdCurso,
        m.Nombre AS Materia,  -- Nombre de la materia
        a.DNIAlumno,
        a.Apellido,
        a.Nombres,
        bd.NotaFinal AS NotaMateria,
        b.Promedio,
        b.Observaciones
      FROM Alumnos a
      JOIN Boletines b ON b.DNIAlumno = a.DNIAlumno
      JOIN BoletinDetalle bd ON bd.IdBoletin = b.IdBoletin
      JOIN Materias m ON m.IdMateria = bd.IdMateria
      WHERE a.IdCurso = ?
      ORDER BY a.Apellido, a.Nombres, m.Nombre
    `).all(idCurso);
    console.log("Calificaciones obtenidas:", rows);
    res.json(rows);  // Array de objetos
  } catch (error) {
    console.error("Error al obtener calificaciones:", error);
    res.status(500).json({ error: "Error interno al obtener calificaciones" });
  }
};

const getHorariosPorCurso = (req, res) => {
  try {
    const { idCurso } = req.params;
    const rows = db.prepare(`
      SELECT 
        h.IdCurso,
        h.DiaSemana AS dia,
        h.NumAula AS aula,
        m.Nombre AS materia,
        h.HoraInicio || '-' || h.HoraFin AS hora
      FROM HorarioMateria h
      INNER JOIN Materias m ON h.IdMateria = m.IdMateria
      WHERE h.IdCurso = ?
      ORDER BY 
        CASE h.DiaSemana
          WHEN 'Lunes' THEN 1
          WHEN 'Martes' THEN 2
          WHEN 'Miercoles' THEN 3
          WHEN 'Jueves' THEN 4
          WHEN 'Viernes' THEN 5
        END,
        h.HoraInicio
        
    `).all(idCurso);
    console.log("Horarios del curso obtenidos:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener horarios del curso:", error);
    res.status(500).json({ error: "Error interno al obtener horarios" });
  }
};

module.exports = { getCursosPorProfe , getCursoByNivelYTurno, getHorariosPorCurso, getCursos, getCursosDisponibles, getCalificacionesPorCurso};
