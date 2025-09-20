const express = require('express');
const { createAsistencia } = require('../controllers/asistenciasController');
const router = express.Router();

router.post('/', createAsistencia);

module.exports = router;
