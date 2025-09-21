const express = require('express');
const { createInscripcion } = require('../controllers/inscripcionesController');

const router = express.Router();

//crear nueva inscripcion 
router.post('/', createInscripcion);

module.exports = router;