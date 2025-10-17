const express = require('express');
const router = express.Router();

const { getHorariosDocente, getDocentes } = require('../controllers/docentesController');

router.get('/', getDocentes);
router.get('/horarios/:DNIDocente', getHorariosDocente);

module.exports = router;
