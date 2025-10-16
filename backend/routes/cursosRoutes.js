const express = require('express');
const router = express.Router();

const { getCursos, getCursosPorProfe } = require('../controllers/cursosController');

router.get('/', getCursos);
router.get('/:DNIDocente', getCursosPorProfe);

module.exports = router;
