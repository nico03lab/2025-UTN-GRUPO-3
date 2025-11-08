const express = require('express');
const router = express.Router();
const { guardarCalificaciones } = require("../controllers/calificacionesController.js");

router.post("/", guardarCalificaciones);

module.exports = router;