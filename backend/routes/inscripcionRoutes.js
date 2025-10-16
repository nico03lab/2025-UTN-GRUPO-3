const express = require('express');
const { createInscripcion, getInscripciones, getInscripcion, updateState } = require('../controllers/inscripcionesController');
const upload = require('../config/multerConfig');

const router = express.Router();

//crear nueva inscripcion 
//router.post('/', createInscripcion);

router.get('/', getInscripciones);
router.get('/:id', getInscripcion)
router.put('/:id/estado', updateState)

// Crear inscripción con documentos
router.post('/', upload.fields([
  { name: 'certificadoNacimiento', maxCount: 1 },
  { name: 'certificadoEstudios', maxCount: 1 },
  { name: 'fotocopia_dni', maxCount: 1 },
  { name: 'certificadoMedico', maxCount: 1 }
]), createInscripcion);

module.exports = router;