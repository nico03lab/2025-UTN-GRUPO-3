const express = require('express');
const router = express.Router();

const { 
  getEventos, 
  getEventosPorCurso, 
  getEventosCursoPorTutor, 
  getEventosUsuarioPorTutor,
  createEvento, 
  updateEvento, 
  deleteEvento 
} = require('../controllers/eventosController');

// Rutas base
router.get('/', getEventos); 

// Rutas específicas
router.get('/:idCurso', getEventosPorCurso);
router.get('/tutor/curso/:dniTutor', getEventosCursoPorTutor);
router.get('/tutor/usuario/:dniTutor', getEventosUsuarioPorTutor);

// CRUD
router.post('/', createEvento);
router.put('/:id', updateEvento);
router.delete('/:id', deleteEvento);

module.exports = router;