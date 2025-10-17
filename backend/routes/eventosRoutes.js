const express = require('express');
const router = express.Router();

const { 
  getEventos, 
  getEventosPorCurso, 
  getEventosPorAlumno, 
  createEvento, 
  updateEvento, 
  deleteEvento 
} = require('../controllers/eventosController');

// Rutas base
router.get('/', getEventos); 
router.get('/alumnos/:dniAlumno', getEventosPorAlumno)

// Rutas específicas
router.get('/cursos/:idCurso', getEventosPorCurso);

// CRUD
router.post('/', createEvento);
router.put('/:id', updateEvento);
router.delete('/:id', deleteEvento);

module.exports = router;