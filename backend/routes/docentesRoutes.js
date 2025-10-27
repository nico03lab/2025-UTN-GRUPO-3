const express = require('express');
const router = express.Router();

const { getHorariosDocente, getDocentes, getDocenteMateria, agregarNuevoDocente, asociarCursoMateria} = require('../controllers/docentesController');

router.get('/', getDocentes);
router.get('/horarios/:DNIDocente', getHorariosDocente);

//manejo dentro de directicos
router.get('/materias', getDocenteMateria);
router.post('/nuevo', agregarNuevoDocente);
router.put('/:idDocente/Curso-Materia', asociarCursoMateria); //actualiza

module.exports = router;
