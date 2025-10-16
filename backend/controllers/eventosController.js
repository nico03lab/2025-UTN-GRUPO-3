const db = require("../db/db"); // tu conexión SQLite

const getEventos = (req, res) => {
  const sql = `SELECT * FROM Eventos ORDER BY FechaInicio DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const getEventosPorCurso = (req, res) => {
  const { idCurso } = req.params;
  const sql = `SELECT e.*, ec.IdCurso 
                FROM Eventos e
                JOIN EventosCursos ec ON e.IdEvento = ec.IdEvento
                WHERE ec.IdCurso = ?
                ORDER BY e.FechaInicio DESC`;
  db.all(sql, [idCurso], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const getEventosCursoPorTutor = (req, res) => {
  const { dniTutor } = req.params;
  const sql = `
            SELECT DISTINCT e.*
            FROM Eventos e
            JOIN EventosCursos ec ON e.IdEvento = ec.IdEvento
            JOIN Alumnos a ON ec.IdCurso = a.IdCurso
            JOIN AlumnoTutor at ON at.DNIAlumno = a.DNIAlumno
            WHERE at.DNITutor = ?
            ORDER BY e.FechaInicio DESC;
    `;
  db.all(sql, [dniTutor], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const getEventosUsuarioPorTutor = (req, res) => {
  const { dniTutor } = req.params;
  const sql = `
            SELECT e.*
            FROM Eventos e
            JOIN EventosUsuarios eu ON eu.IdEvento = e.IdEvento
            JOIN Alumnos a ON eu.IdUsuario = a.IdUsuario
            JOIN AlumnoTutor at ON at.DNIAlumno = a.DNIAlumno
            WHERE at.DNITutor = ?
            ORDER BY e.FechaInicio DESC;
        `;
  db.all(sql, [dniTutor], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
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
    usuarios 
  } = req.body;

  if (!titulo || !fechaInicio || !idUsuarioCreador || !tipo) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    const sqlEvento = `
      INSERT INTO Eventos (Titulo, Descripcion, FechaInicio, FechaFin, IdUsuarioCreador, Tipo, Alcance)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const paramsEvento = [
      titulo, descripcion || "", fechaInicio, fechaFin || null, idUsuarioCreador, tipo, alcance || "Curso"
    ];

    db.run(sqlEvento, paramsEvento, function (err) {
      if (err) {
        console.error("Error creando evento:", err.message);
        db.run("ROLLBACK");
        return res.status(500).json({ error: "Error al crear el evento." });
      }

      const idEvento = this.lastID;

      try {
        if (alcance === "Curso" && cursos?.length) {
          cursos.forEach(idCurso => {
            db.run(`INSERT INTO EventosCursos (IdCurso, IdEvento) VALUES (?, ?)`, [idCurso, idEvento]);
            
            // Buscar los alumnos del curso
            const sqlAlumnos = `
              SELECT u.IdUsuario
              FROM Alumnos a
              JOIN Usuarios u ON u.IdUsuario = a.IdUsuario
              WHERE a.IdCurso = ?
            `;
            db.all(sqlAlumnos, [idCurso], (err, alumnos) => {
              if (err) throw err;
              alumnos.forEach(a => {
                const mensaje = `Nuevo evento para tu curso: ${titulo}`;
                db.run(
                  `INSERT INTO Notificaciones (IdUsuario, Mensaje, Tipo, IdReferencia)
                   VALUES (?, ?, 'Evento', ?)`,
                  [a.IdUsuario, mensaje, idEvento]
                );
              });
            });
          });
        } 
        else if (alcance === "Alumno" && usuarios?.length) {
          usuarios.forEach(idUsuario => {
            db.run(`INSERT INTO EventosUsuarios (IdEvento, IdUsuario) VALUES (?, ?)`, [idEvento, idUsuario]);
            const mensaje = `Nuevo evento para vos: ${titulo}`;
            db.run(
              `INSERT INTO Notificaciones (IdUsuario, Mensaje, Tipo, IdReferencia)
               VALUES (?, ?, 'Evento', ?)`,
              [idUsuario, mensaje, idEvento]
            );
          });
        } 
        else if (alcance === "Global") {
          db.all(`SELECT IdUsuario FROM Usuarios`, [], (err, usuarios) => {
            if (err) throw err;
            usuarios.forEach(u => {
              const mensaje = `Nuevo evento institucional: ${titulo}`;
              db.run(
                `INSERT INTO Notificaciones (IdUsuario, Mensaje, Tipo, IdReferencia)
                 VALUES (?, ?, 'Evento', ?)`,
                [u.IdUsuario, mensaje, idEvento]
              );
            });
          });
        }

        // Si todo salió bien
        db.run("COMMIT");
        res.status(201).json({
          message: "Evento creado y notificaciones enviadas con éxito.",
          id: idEvento
        });
      } catch (error) {
        console.error("Error en la transacción:", error);
        db.run("ROLLBACK");
        res.status(500).json({ error: "Error en el proceso de creación." });
      }
    });
  });
};

const updateEvento = (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fechaInicio, fechaFin, tipo, alcance } = req.body;

  // Primero obtener el evento existente
  db.get("SELECT * FROM Eventos WHERE IdEvento = ?", [id], (err, evento) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!evento) return res.status(404).json({ error: "Evento no encontrado." });

    const sql = `
      UPDATE Eventos
      SET Titulo = ?, Descripcion = ?, FechaInicio = ?, FechaFin = ?, Tipo = ?, Alcance = ?
      WHERE IdEvento = ?
    `;

    const params = [
      titulo || evento.Titulo,
      descripcion || evento.Descripcion,
      fechaInicio || evento.FechaInicio,
      fechaFin || evento.FechaFin,
      tipo || evento.Tipo,
      alcance || evento.Alcance,
      id
    ];

    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Evento actualizado con éxito." });
    });
  });
};

const deleteEvento = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM Eventos WHERE IdEvento = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Evento no encontrado." });

    res.json({ message: "Evento eliminado correctamente." });
  });
};

module.exports = {
  getEventos,
  getEventosPorCurso,
  getEventosCursoPorTutor,
  getEventosUsuarioPorTutor,
  createEvento,
  updateEvento,
  deleteEvento
};