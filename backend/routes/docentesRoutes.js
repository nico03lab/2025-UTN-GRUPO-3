const express = require('express');
const router = express.Router();

const { getHorariosDocente, getDocentes, getDocenteMateria, agregarNuevoDocente, asociarCursoMateria, getDocenteUser} = require('../controllers/docentesController');
const { docenteConfig } = require('../controllers/docentesController');

router.get('/', getDocentes);

router.get('/horarios/:DNIDocente', getHorariosDocente);

//manejo dentro de directicos
router.get('/materias', getDocenteMateria);
router.post('/nuevo', agregarNuevoDocente);
router.put('/:idDocente/Curso-Materia', asociarCursoMateria); //actualiza
//para obtener el user 
router.get('/:idUsuario', getDocenteUser);
//para la configuracion/actualizacion de datos
router.get('/configuracion/:idUsuario',docenteConfig.getDocenteCompleto);
router.put('/configuracion/:idUsuario', docenteConfig.updateDocente);

module.exports = router;
