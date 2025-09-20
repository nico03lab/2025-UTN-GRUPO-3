const express = require('express');
const { getAlumnos, getAlumnosPorCurso } = require('../controllers/alumnosController');
const router = express.Router();

router.get('/', getAlumnos);
router.get('/:idCurso', getAlumnosPorCurso);

module.exports = router;
