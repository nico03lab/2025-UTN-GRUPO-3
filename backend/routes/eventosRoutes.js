const express = require('express');
const router = express.Router();

const { getEventos, getEventosPorCurso, getEventosPorTutor } = require('../controllers/cursosController');

router.get('/', getEventos); 
router.get('/:idCurso', getEventosPorCurso);
router.get('/:dniPadre', getEventosPorTutor);

module.export = router;