const express = require('express');
const { createAsistencia, getAsistenciasPorCurso } = require('../controllers/asistenciasController');
const router = express.Router();

router.post('/', createAsistencia);
router.get('/:idCurso', getAsistenciasPorCurso);
module.exports = router;
