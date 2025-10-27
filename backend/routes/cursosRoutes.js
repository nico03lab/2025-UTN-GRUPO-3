const express = require('express');
const router = express.Router();

const { getCursos, getCursosPorProfe, getCursosDisponibles } = require('../controllers/cursosController');
//consulta desde directivos 
router.get('/disponibles',getCursosDisponibles); //el curso asociado a la materiba libre

router.get('/', getCursos);
router.get('/:DNIDocente', getCursosPorProfe);


module.exports = router;
