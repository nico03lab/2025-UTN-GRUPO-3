const db = require('../db/db');

const getEstadisticasPorCurso = (req, res) => {
  try {
    const { idCurso } = req.params;

    // Total de alumnos en el curso
    const totalAlumnos = db.prepare(`SELECT COUNT(*) AS count FROM Alumnos WHERE IdCurso = ?`).get(idCurso).count;

    // Asistencia promedio (basado en Asistencias JOIN Alumnos)
    const asistenciaPromedio = db.prepare(`
      SELECT AVG(da.Presente) * 100 AS promedio
      FROM DetalleAsistencia da
      JOIN Asistencias a ON da.IdAsistencia = a.IdAsistencia
      JOIN Alumnos al ON da.DNIAlumno = al.DNIAlumno
      WHERE al.IdCurso = ?
    `).get(idCurso)?.promedio || 0;

    // Calificación promedio (basado en Boletines JOIN Alumnos)
    const calificacionPromedio = db.prepare(`
      SELECT AVG(b.Promedio) AS promedio
      FROM Boletines b
      JOIN Alumnos al ON b.DNIAlumno = al.DNIAlumno
      WHERE al.IdCurso = ?
    `).get(idCurso)?.promedio || 0;

    const stats = {
      totalAlumnos,
      asistenciaPromedio: Math.round(asistenciaPromedio),  // Redondear a entero
      calificacionPromedio: calificacionPromedio.toFixed(1),  // 1 decimal
    };

    console.log("Estadísticas del curso:", stats);
    res.json(stats);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error interno al obtener estadísticas" });
  }
};

module.exports = {getEstadisticasPorCurso};