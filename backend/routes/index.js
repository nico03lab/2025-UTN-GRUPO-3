const express = require('express');
const router = express.Router();

router.use('/alumnos', require('./alumnosRoutes'));
router.use('/cursos', require('./cursosRoutes'));
router.use('/docentes', require('./docentesRoutes'));
router.use('/asistencias', require('./asistenciasRoutes'));
router.use('/inscripcion', require('./inscripcionRoutes'));
router.use('/documentos', require('./documentosRoutes'));
router.use('/eventos', require('./eventosRoutes'));
router.use('/notificaciones', require('./notificacionesRoutes'));
router.use('/usuarios', require('./usersRoutes'));
router.use('/localidades', require('./localidadesRoutes'));
router.use('/directivos', require('./directivosRoutes'));
router.use('/asistencias', require('./asistenciasRoutes'));
router.use('/calificaciones', require('./calificacionesRoutes.js'));

//router.use('/mensajes', require('./mensajesRoutes'));
//router.use('/difusion', require('./difusionRoutes'));

module.exports = router;
