const express = require('express');
const { getAlumnos, getAlumnosPorCurso,getAlumnoCompleto, updateCursoAlumno, updateStateAlumno,updateAlumno, getAlumnoUser } = require('../controllers/alumnosController');
const {padreController } = require("../controllers/tutoresController");
const router = express.Router();

router.get('/', getAlumnos);
router.get('/:idCurso', getAlumnosPorCurso);

router.put('/:dni/estado', updateStateAlumno);
router.put('/:dni/curso', updateCursoAlumno);

//para la pagina Alumnos-padre, como agregamos la pagina alumnos esto esta demas pero ya que
router.get('/tutor/:idUsuario', padreController.getTutor);
router.get('/tutor/:padreId/hijos', padreController.getHijos); //obtener todos los hijos
//para la configuracion/actualiacion
router.get('/tutor/configuracion/:idUsuario', padreController.getTutorCompleto); //devuelve al padre con los hijos para la modificacion
router.put('/tutor/configuracion/:idUsuario', padreController.updateTutor);
router.put('/configuracion/:dni', padreController.updateAlumno);

//compartido
router.get('/estudiante/:estudianteId/notas', padreController.getNotas); //Obtener solo notas de un estudiante
router.get('/estudiante/:estudianteId/horarios', padreController.getHorarios); //Obtener solo horarios de un estudiante
router.get('/estudiante/:estudianteId/inasistencias', padreController.getInasistencias); //Obtener asistencias de un estudiante

//para la pagina alumnos
router.get('/user/:idUsuario', getAlumnoUser);
//para la configuracion
router.get('/configuracion/user/:idUsuario',getAlumnoCompleto); //obtener info completa de un hijo
router.put('/configuracion/user/:idUsuario', updateAlumno);
module.exports = router;
