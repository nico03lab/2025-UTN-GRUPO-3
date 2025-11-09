// controllers/eventosController.js
const db = require("../db/db");

// ====== Statements preparados (1 sola vez) ======
const stmts = {
  // SELECTs
  getEventos: db.prepare(`
    SELECT *
    FROM Eventos
    ORDER BY datetime(FechaInicio) DESC
  `),

  getEventosPorCurso: db.prepare(`
    SELECT e.*, ec.IdCurso
    FROM Eventos e
    JOIN EventosCursos ec ON e.IdEvento = ec.IdEvento
    WHERE ec.IdCurso = ?
    ORDER BY datetime(e.FechaInicio) DESC
  `),

  getEventosPorAlumno: db.prepare(`
    SELECT DISTINCT e.*
    FROM Eventos e
    JOIN EventosUsuarios eu ON eu.IdEvento = e.IdEvento
    JOIN Alumnos a ON a.IdUsuario = eu.IdUsuario
    WHERE a.DNIAlumno = ?
    UNION ALL
    SELECT DISTINCT e.*
    FROM Eventos e
    JOIN EventosCursos ec ON ec.IdEvento = e.IdEvento
    JOIN Alumnos a ON a.IdCurso = ec.IdCurso
    WHERE a.DNIAlumno = ?
  `),

  // INSERTs
  insertEvento: db.prepare(`
    INSERT INTO Eventos
      (Titulo, Descripcion, FechaInicio, FechaFin, IdUsuarioCreador, Tipo, Alcance)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  insertEventoCurso: db.prepare(`
    INSERT INTO EventosCursos (IdCurso, IdEvento)
    VALUES (?, ?)
  `),

  insertEventoUsuario: db.prepare(`
    INSERT INTO EventosUsuarios (IdEvento, IdUsuario)
    VALUES (?, ?)
  `),

  insertNotificacion: db.prepare(`
    INSERT INTO Notificaciones (Mensaje, Tipo, IdReferencia)
    VALUES (?, 'Evento', ?)
  `),

  insertNotificacionUsuario: db.prepare(`
    INSERT INTO NotificacionesUsuarios (IdNotificacion, IdUsuario, Leida)
    VALUES (?, ?, 0)
    `),

  // SELECTs auxiliares
  getAlumnosIdsPorCurso: db.prepare(`
    SELECT u.IdUsuario
    FROM Alumnos a
    JOIN Usuarios u ON u.IdUsuario = a.IdUsuario
    WHERE a.IdCurso = ?
  `),

  getTodosUsuariosIds: db.prepare(`
    SELECT IdUsuario FROM Usuarios
  `),

  // UPDATE / DELETE
  getEventoById: db.prepare(`
    SELECT * FROM Eventos WHERE IdEvento = ?
  `),

  updateEvento: db.prepare(`
    UPDATE Eventos
    SET Titulo = ?, Descripcion = ?, FechaInicio = ?, FechaFin = ?, Tipo = ?, Alcance = ?
    WHERE IdEvento = ?
  `),

  deleteEvento: db.prepare(`
    DELETE FROM Eventos WHERE IdEvento = ?
  `),
};

// ====== Controladores ======
const getEventos = (req, res) => {
  try {
    const rows = stmts.getEventos.all();
    res.json(rows);
  } catch (err) {
    console.error("getEventos:", err);
    res.status(500).json({ error: err.message });
  }
};

const getEventosPorCurso = (req, res) => {
  try {
    const { idCurso } = req.params;
    const rows = stmts.getEventosPorCurso.all(idCurso);
    res.json(rows);
  } catch (err) {
    console.error("getEventosPorCurso:", err);
    res.status(500).json({ error: err.message });
  }
};

const getEventosPorAlumno = (req, res) => {
  try {
    const { dniAlumno } = req.params; 
    const rows = stmts.getEventosPorAlumno.all(dniAlumno, dniAlumno);
    res.json(rows);
  } catch (err) {
    console.error("getEventosPorAlumno:", err);
    res.status(500).json({ error: err.message });
  }
};

const createEvento = (req, res) => {
  const {
    titulo,
    descripcion,
    fechaInicio,
    fechaFin,
    idUsuarioCreador,
    tipo,
    alcance,
    cursos,
    usuarios,
  } = req.body;

  if (!titulo || !fechaInicio || !idUsuarioCreador || !tipo) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  try {
    const trx = db.transaction(() => {
      // Insertar el evento
      const info = stmts.insertEvento.run(
        titulo,
        descripcion || "",
        fechaInicio,
        fechaFin || null,
        idUsuarioCreador,
        tipo,
        alcance || "Curso"
      );
      const idEvento = info.lastInsertRowid;

      // Crear la notificación base
      const mensajeBase =
        alcance === "Global"
          ? `Nuevo evento institucional: ${titulo}`
          : alcance === "Alumno"
          ? `Nuevo evento para vos: ${titulo}`
          : `Nuevo evento para tu curso: ${titulo}`;

      const notif = stmts.insertNotificacion.run(mensajeBase, idEvento);
      const idNotificacion = notif.lastInsertRowid;

      // Asociar usuarios según el alcance
      if (alcance === "Curso" && Array.isArray(cursos) && cursos.length) {
        for (const idCurso of cursos) {
          // Asociación curso-evento
          stmts.insertEventoCurso.run(idCurso, idEvento);

          // Obtener alumnos del curso
          const alumnos = stmts.getAlumnosIdsPorCurso.all(idCurso);
          for (const a of alumnos) {
            stmts.insertNotificacionUsuario.run(idNotificacion, a.IdUsuario, 0);

            // 🔹 También notificar a sus tutores
            const tutores = db
              .prepare(`
                SELECT t.IdUsuario
                FROM Tutores t
                JOIN AlumnoTutor at ON at.DNITutor = t.DNITutor
                JOIN Alumnos al ON al.DNIAlumno = at.DNIAlumno
                WHERE al.IdUsuario = ?
              `)
              .all(a.IdUsuario);

            for (const t of tutores) {
              stmts.insertNotificacionUsuario.run(idNotificacion, t.IdUsuario, 0);
            }
          }
        }
      } else if (alcance === "Alumno" && Array.isArray(usuarios) && usuarios.length) {
        for (const idUsuario of usuarios) {
          stmts.insertEventoUsuario.run(idEvento, idUsuario);
          stmts.insertNotificacionUsuario.run(idNotificacion, idUsuario, 0);

          const tutores = db
            .prepare(`
              SELECT t.IdUsuario
              FROM Tutores t
              JOIN AlumnoTutor at ON at.DNITutor = t.DNITutor
              JOIN Alumnos al ON al.DNIAlumno = at.DNIAlumno
              WHERE al.IdUsuario = ?
            `)
            .all(idUsuario);

          for (const t of tutores) {
            stmts.insertNotificacionUsuario.run(idNotificacion, t.IdUsuario, 0);
          }
        }
      } else if (alcance === "Global") {
        const allUsers = stmts.getTodosUsuariosIds.all();
        for (const u of allUsers) {
          stmts.insertNotificacionUsuario.run(idNotificacion, u.IdUsuario, 0);
        }
      }

      return idEvento;
    });

    const idEvento = trx(); // Ejecuta la transacción

    res.status(201).json({
      message: "Evento y notificaciones creados con éxito.",
      id: idEvento,
    });
  } catch (err) {
    console.error("createEvento (trx):", err);
    res.status(500).json({ error: "Error en el proceso de creación." });
  }
};

const updateEvento = (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fechaInicio, fechaFin, tipo, alcance } =
      req.body;

    const evento = stmts.getEventoById.get(id);
    if (!evento)
      return res.status(404).json({ error: "Evento no encontrado." });

    const newTitulo = titulo ?? evento.Titulo;
    const newDesc = descripcion ?? evento.Descripcion;
    const newInicio = fechaInicio ?? evento.FechaInicio;
    const newFin = fechaFin ?? evento.FechaFin;
    const newTipo = tipo ?? evento.Tipo;
    const newAlcance = alcance ?? evento.Alcance;

    stmts.updateEvento.run(
      newTitulo,
      newDesc,
      newInicio,
      newFin,
      newTipo,
      newAlcance,
      id
    );

    res.json({ message: "Evento actualizado con éxito." });
  } catch (err) {
    console.error("updateEvento:", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteEvento = (req, res) => {
  try {
    const { id } = req.params;
    const info = stmts.deleteEvento.run(id);
    if (info.changes === 0)
      return res.status(404).json({ error: "Evento no encontrado." });
    res.json({ message: "Evento eliminado correctamente." });
  } catch (err) {
    console.error("deleteEvento:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getEventos,
  getEventosPorCurso,
  getEventosPorAlumno,
  createEvento,
  updateEvento,
  deleteEvento,
};
