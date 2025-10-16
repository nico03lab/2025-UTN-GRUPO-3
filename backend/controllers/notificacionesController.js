const db = require("../db/db"); // tu conexión SQLite

const getNotificaciones = (req, res) => {
  const sql = `SELECT * FROM Notificaciones ORDER BY Fecha DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const getNotificacionesPorUsuario = (req, res) => {
  const { idUsuario } = req.params;
  const sql = `
      SELECT IdNotificacion, Mensaje, Leida, Fecha, Tipo, IdReferencia
      FROM Notificaciones
      WHERE IdUsuario = ?
      ORDER BY Fecha DESC
  `;
  db.all(sql, [idUsuario], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const createNotificacion = (req, res) => {
  const { idUsuario, mensaje, tipo, idReferencia } = req.body;

  if (!idUsuario || !mensaje || !tipo) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  const sql = `
    INSERT INTO Notificaciones (IdUsuario, Mensaje, Tipo, IdReferencia)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [idUsuario, mensaje, tipo, idReferencia || null], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: "Notificación creada exitosamente.",
      id: this.lastID,
    });
  });
};

const marcarNotificacionLeida = (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE Notificaciones SET Leida = 1 WHERE IdNotificacion = ?`;

  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Notificación no encontrada." });
    res.json({ message: "Notificación marcada como leída." });
  });
};

const deleteNotificacion = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM Notificaciones WHERE IdNotificacion = ?`;

  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Notificación no encontrada." });
    res.json({ message: "Notificación eliminada correctamente." });
  });
};

module.exports = {
  getNotificaciones,
  getNotificacionesPorUsuario,
  createNotificacion,
  marcarNotificacionLeida,
  deleteNotificacion,
};