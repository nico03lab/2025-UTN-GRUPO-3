const db = require("../db/db");

const getNotificaciones = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT *
      FROM Notificaciones
      ORDER BY datetime(Fecha) DESC
    `);
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("getNotificaciones:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getNotificacionesPorUsuario = (req, res) => {
  try {
    const { idUsuario } = req.params;
    const stmt = db.prepare(`
      SELECT n.IdNotificacion, n.Mensaje, nu.Leida, n.Fecha, n.Tipo, n.IdReferencia
      FROM Notificaciones n
      JOIN NotificacionesUsuarios nu ON n.IdNotificacion = nu.IdNotificacion
      WHERE nu.IdUsuario = ?
      ORDER BY datetime(Fecha) DESC
    `);
    const rows = stmt.all(idUsuario);
    res.json(rows);
  } catch (err) {
    console.error("getNotificacionesPorUsuario:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const createNotificacion = (req, res) => {
  try {
    const { idUsuario, mensaje, tipo, idReferencia } = req.body;

    if (!idUsuario || !mensaje || !tipo) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const stmt = db.prepare(`
      INSERT INTO Notificaciones (Mensaje, Tipo, IdReferencia)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(idUsuario, mensaje, tipo, idReferencia || null);

    res.status(201).json({
      message: "Notificación creada exitosamente.",
      id: result.lastInsertRowid,
    });
  } catch (err) {
    console.error("createNotificacion:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const marcarNotificacionLeida = (req, res) => {
  try {
    const { idNotif, idUser } = req.params;

    if (!idNotif || !idUser) {
      return res
        .status(400)
        .json({ error: "Faltan parámetros (idNotif o idUser)." });
    }

    const stmt = db.prepare(`
      UPDATE NotificacionesUsuarios
      SET Leida = 1
      WHERE IdNotificacion = ? AND IdUsuario = ?
    `);

    const result = stmt.run(idNotif, idUser);

    if (result.changes === 0) {
      return res
        .status(404)
        .json({ error: "Notificación no encontrada o ya marcada como leída." });
    }

    res.json({
      message: "Notificación marcada como leída.",
      idNotif,
      idUser,
    });
  } catch (err) {
    console.error("marcarNotificacionLeida:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const deleteNotificacion = (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare(`
      DELETE FROM Notificaciones
      WHERE IdNotificacion = ?
    `);

    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Notificación no encontrada." });
    }

    res.json({ message: "Notificación eliminada correctamente." });
  } catch (err) {
    console.error("deleteNotificacion:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getNotificaciones,
  getNotificacionesPorUsuario,
  createNotificacion,
  marcarNotificacionLeida,
  deleteNotificacion,
};
