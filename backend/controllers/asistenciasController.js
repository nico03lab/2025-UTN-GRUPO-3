const db = require("../db/db");

const createAsistencia = (req, res) => {
  const { curso, fecha, idMateria, asistencia } = req.body;

  try {
    console.log("Datos recibidos desde frontend:", req.body);

    if (!curso || !fecha || !idMateria || !Array.isArray(asistencia)) {
      return res.status(400).json({ error: "Faltan datos obligatorios en el cuerpo de la solicitud." });
    }

    const existe = db
      .prepare(`
        SELECT COUNT(*) as count 
        FROM Asistencias 
        WHERE IdCurso = ? AND IdMateria = ? AND Fecha = ?
      `)
      .get(curso, idMateria, fecha);

    if (existe.count > 0) {
      return res
        .status(400)
        .json({ message: "La asistencia ya fue registrada para este curso y materia hoy ❌" });
    }

    const insertAsistencia = db.prepare(`
      INSERT INTO Asistencias (IdCurso, Fecha, IdMateria, Observaciones)
      VALUES (?, ?, ?, NULL)
    `);

    const result = insertAsistencia.run(curso, fecha, idMateria);
    const idAsistencia = result.lastInsertRowid;

    const stmtDetalle = db.prepare(`
      INSERT INTO DetalleAsistencia (IdAsistencia, DNIAlumno, Presente)
      VALUES (?, ?, ?)
    `);

    const insertDetalles = db.transaction((registros) => {
      for (const a of registros) {

        const presente = a.Presente ? 1 : 0;
        stmtDetalle.run(idAsistencia, a.DNI, presente);
      }
    });

    insertDetalles(asistencia);

    res.json({
      message: "Asistencia guardada correctamente ✅",
      idAsistencia,
      totalRegistros: asistencia.length
    });
  } catch (err) {
    console.error("❌ createAsistencia ERROR:", err.stack);
    res.status(500).json({ error: err.message });
  }
};

const getAsistenciasPorCurso = (req, res) =>{
  try {
    const { idCurso } = req.params;
    const rows = db.prepare(`
      SELECT 
        a.IdCurso,
        a.Fecha,
        a.IdMateria,
        m.Nombre AS Materia,  -- Nombre de la materia
        da.DNIAlumno,
        al.Apellido,
		    al.Nombres,
        da.Presente
      FROM Asistencias a 
      JOIN DetalleAsistencia da ON da.IdAsistencia = a.IdAsistencia
      JOIN Materias m ON m.IdMateria = a.IdMateria  
      JOIN Alumnos al ON al.DNIAlumno = da.DNIAlumno 
      WHERE a.IdCurso = ?
      ORDER BY a.Fecha DESC, al.Apellido
    `).all(idCurso);
    console.log("Asistencias obtenidas:", rows);
    res.json(rows);  // Devuelve el array de objetos
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    res.status(500).json({ error: "Error interno al obtener asistencias" });
  }
}


module.exports = { createAsistencia, getAsistenciasPorCurso};
