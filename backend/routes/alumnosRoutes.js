const express = require('express');
const { getAlumnos, getAlumnosPorCurso, updateCursoAlumno, updateStateAlumno } = require('../controllers/alumnosController');
const {padreController } = require("../controllers/tutoresController");
const router = express.Router();

router.get('/', getAlumnos);
router.get('/:idCurso', getAlumnosPorCurso);

router.put('/:dni/estado', updateStateAlumno);
router.put('/:dni/curso', updateCursoAlumno);

//para la pagina Alumnos-padre
router.get('/tutor/:idUsuario', padreController.getTutor);
router.get('/tutor/:padreId/hijos', padreController.getHijos); //obtener todos los hijos
//para la configuracion/actualiacion
router.get('/tutor/configuracion/:idUsuario', padreController.getTutorCompleto); //devuelve al padre con los hijos para la modificacion
router.put('/tutor/configuracion/:idUsuario', padreController.updateTutor);
router.put('/configuracion/:dni', padreController.updateAlumno);

//router.get('/:padreId/estudiante/:estudianteId', padreController.getHijoCompleto); //obtener info completa de un hijo
router.get('/estudiante/:estudianteId/notas', padreController.getNotas); //Obtener solo notas de un estudiante
router.get('/estudiante/:estudianteId/horarios', padreController.getHorarios); //Obtener solo horarios de un estudiante
router.get('/estudiante/:estudianteId/inasistencias', padreController.getInasistencias); //Obtener asistencias de un estudiante

module.exports = router;
