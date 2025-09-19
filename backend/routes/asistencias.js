const express = require('express');
const router = express.Router();
const { getCursos, getAlumnosPorCurso, guardarAsistencias } = require('../controllers/asistenciasController');

// GET /asistencias/cursos
router.get('/cursos', getCursos);

// GET /asistencias/:idCurso/alumnos
router.get('/:idCurso/alumnos', getAlumnosPorCurso);

// POST /asistencias
router.post('/', guardarAsistencias);

module.exports = router;
