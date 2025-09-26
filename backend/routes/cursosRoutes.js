const express = require('express');
const router = express.Router();

const { getCursosPorProfe } = require('../controllers/cursosController');

router.get('/:DNIDocente', getCursosPorProfe); // GET /api/cursos/:dniDocente

module.exports = router;
