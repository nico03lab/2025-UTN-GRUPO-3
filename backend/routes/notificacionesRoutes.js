const express = require("express");
const {
  getNotificaciones,
  getNotificacionesPorUsuario,
  createNotificacion,
  marcarNotificacionLeida,
  deleteNotificacion,
} = require("../controllers/notificacionesController");

const router = express.Router();

router.get("/", getNotificaciones);

router.get("/:idUsuario", getNotificacionesPorUsuario);

router.post("/", createNotificacion);

router.put("/:idNotif/leida/:idUser", marcarNotificacionLeida);

router.delete("/:id", deleteNotificacion);

module.exports = router;