const express = require('express');
const router = express.Router();
const { getEstadisticasPorCurso } = require('../controllers/statsController');

router.get('/cursos/:idCurso', getEstadisticasPorCurso);  // Para directivos

module.exports = router;