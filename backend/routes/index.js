const express = require('express');
const router = express.Router();

router.use('/alumnos', require('./alumnosRoutes'));
router.use('/cursos', require('./cursosRoutes'));
router.use('/asistencias', require('./asistenciasRoutes'));
router.use('/inscripcion', require('./inscripcionRoutes'));
router.use('/documentos', require('./documentosRoutes'));
router.use('/eventos', require('./eventosRoutes'));
router.use('/notifaciones', require('./notificacionesRoutes'));
router.use('/usuarios', require('./usersRoutes'));
//router.use('/mensajes', require('./mensajesRoutes'));
//router.use('/difusion', require('./difusionRoutes'));

module.exports = router;
