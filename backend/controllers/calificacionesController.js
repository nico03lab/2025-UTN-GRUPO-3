import db from "../db/db.js";

export const guardarCalificaciones = (req, res) => {
  const { curso, idMateria, calificaciones } = req.body;

  try {
    if (!curso || !idMateria || !Array.isArray(calificaciones)) {
      return res
        .status(400)
        .json({ success: false, message: "Datos incompletos" });
    }

    db.prepare("BEGIN TRANSACTION").run();

    for (const { DNIAlumno, nota, obs } of calificaciones) {
      let boletin = db
        .prepare("SELECT * FROM Boletines WHERE DNIAlumno = ?")
        .get(DNIAlumno);

      if (!boletin) {
        const result = db
          .prepare(
            "INSERT INTO Boletines (DNIAlumno, Promedio, Observaciones) VALUES (?, NULL, ?)"
          )
          .run(DNIAlumno, obs || null);

        boletin = { IdBoletin: result.lastInsertRowid };
      }

      const detalle = db
        .prepare(
          "SELECT * FROM BoletinDetalle WHERE IdBoletin = ? AND IdMateria = ?"
        )
        .get(boletin.IdBoletin, idMateria);

      if (!detalle) {
        db.prepare(
          "INSERT INTO BoletinDetalle (IdBoletin, IdMateria, Nivel, NotaTrimestral1, NotaTrimestral2, NotaTrimestral3, NotaFinal) VALUES (?, ?, 1, ?, NULL, NULL, ?)"
        ).run(boletin.IdBoletin, idMateria, nota, nota);
      } else {
        let trimestre = null;
        if (detalle.NotaTrimestral1 == null) trimestre = "NotaTrimestral1";
        else if (detalle.NotaTrimestral2 == null) trimestre = "NotaTrimestral2";
        else if (detalle.NotaTrimestral3 == null) trimestre = "NotaTrimestral3";
        else trimestre = "NotaTrimestral3";

        const sql = `
          UPDATE BoletinDetalle
          SET ${trimestre} = ?, NotaFinal = (
            (COALESCE(NotaTrimestral1,0) + COALESCE(NotaTrimestral2,0) + COALESCE(NotaTrimestral3,0)) /
            (CASE WHEN 
              (NotaTrimestral1 IS NOT NULL) + (NotaTrimestral2 IS NOT NULL) + (NotaTrimestral3 IS NOT NULL) = 0 
              THEN 1 
              ELSE (NotaTrimestral1 IS NOT NULL) + (NotaTrimestral2 IS NOT NULL) + (NotaTrimestral3 IS NOT NULL) 
            END)
          )
          WHERE IdBoletin = ? AND IdMateria = ?
        `;

        db.prepare(sql).run(nota, boletin.IdBoletin, idMateria);
      }

      const mensaje = `Se actualizó una calificación (${nota}) en una materia.`;
      const notifResult = db
        .prepare(
          "INSERT INTO Notificaciones (Mensaje, Tipo) VALUES (?, 'Mensaje')"
        )
        .run(mensaje);

      const idNotif = notifResult.lastInsertRowid;

      const usuarios = db
        .prepare(
          `
            SELECT a.IdUsuario
            FROM Alumnos a
            WHERE a.DNIAlumno = ?
            
            UNION
            
            SELECT t.IdUsuario
            FROM Tutores t
            JOIN AlumnoTutor at ON at.DNITutor = t.DNITutor
            WHERE at.DNIAlumno = ?;
          `
        )
        .all(DNIAlumno, DNIAlumno);

      for (const u of usuarios) {
        db.prepare(
          "INSERT INTO NotificacionesUsuarios (IdNotificacion, IdUsuario, Leida) VALUES (?, ?, 0)"
        ).run(idNotif, u.IdUsuario);
      }
    }

    db.prepare("COMMIT").run();
    res.json({
      success: true,
      message: "Calificaciones guardadas correctamente",
    });
  } catch (error) {
    console.error("Error guardando calificaciones:", error);
    db.prepare("ROLLBACK").run();
    res
      .status(500)
      .json({ success: false, message: "Error al guardar calificaciones" });
  }
};
