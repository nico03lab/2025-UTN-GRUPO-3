const express = require('express');
const { getAlumnos, getAlumnosPorCurso, updateCursoAlumno, updateStateAlumno } = require('../controllers/alumnosController');
const router = express.Router();

router.get('/', getAlumnos);
router.get('/:idCurso', getAlumnosPorCurso);

router.put('/:dni/estado', updateStateAlumno);
router.put('/:dni/curso', updateCursoAlumno);

module.exports = router;
