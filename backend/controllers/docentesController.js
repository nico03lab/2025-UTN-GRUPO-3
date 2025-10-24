const db = require("../db/db");

const getDocentes = async () => {
    try {
        const rows = db.prepare(
            `SELECT * FROM Docentes`
        )
      .all();
    console.log("Docentes: ", rows);

    return rows;
  } catch (error) {
    throw error;
  }
}

const getHorariosDocente = (req, res) => {
  try {

    const { DNIDocente } = req.params;
    const dni = String(DNIDocente);

    const rows = db.prepare(`
      SELECT 
        h.DiaSemana,
        h.HoraInicio,
        h.HoraFin,
        h.NumAula,
        c.IdCurso,
        m.Nombre AS Materia
      FROM HorarioMateria h
      JOIN CursoMateria cm ON h.IdCurso = cm.IdCurso AND h.IdMateria = cm.IdMateria
      JOIN Materias m ON m.IdMateria = h.IdMateria
      JOIN Cursos c ON c.IdCurso = h.IdCurso
      WHERE cm.DNIDocente = ?
      ORDER BY
        CASE h.DiaSemana
          WHEN 'Lunes' THEN 1
          WHEN 'Martes' THEN 2
          WHEN 'Miercoles' THEN 3
          WHEN 'Jueves' THEN 4
          WHEN 'Viernes' THEN 5
        END,
        h.HoraInicio
    `).all(dni);

    console.log("✅ Horarios del docente:", rows);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener horarios:", error);
    res.status(500).json({ error: "Error interno al obtener horarios" });
  }
};

const getDocenteMateria = (req, res) => {
  try {
    const rows = db.prepare(
            `SELECT 
              d.DNIDocente,
              d.Nombre,
              d.Apellido,
              c.Nombre as Materia,
              d.Email
              FROM Docentes d 
              JOIN CursoMateria cm ON cm.DNIDocente = d.DNIDocente
              JOIN Materias c ON c.IdMateria = cm.IdMateria`
        )
      .all();
    res.json(rows);
    
  } catch (error) {
    console.error("Error al obtener docentes:", error);
    res.status(500).json({ error: "Error interno al obtener dcoentes" });
  }
}

module.exports = {
  getHorariosDocente, getDocentes, getDocenteMateria
};
