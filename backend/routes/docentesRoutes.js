const express = require('express');
const router = express.Router();

const { getHorariosDocente, getDocentes, getDocenteMateria } = require('../controllers/docentesController');

router.get('/', getDocentes);
router.get('/horarios/:DNIDocente', getHorariosDocente);
router.get('/materias', getDocenteMateria);

module.exports = router;
