const express = require('express');
const { getAlumnos, getAlumnosPorCurso, updateCursoAlumno, updateStateAlumno } = require('../controllers/alumnosController');
const {padreController } = require("../controllers/tutoresController")
const router = express.Router();

router.get('/', getAlumnos);
router.get('/:idCurso', getAlumnosPorCurso);

router.put('/:dni/estado', updateStateAlumno);
router.put('/:dni/curso', updateCursoAlumno);

//para la pagina Alumnos-padre
router.get('/tutor/:padreId', padreController.getTutor);
router.get('/tutor/:padreId/hijos', padreController.getHijos); //obtener todos los hijos
//router.get('/:padreId/estudiante/:estudianteId', padreController.getHijoCompleto); //obtener info completa de un hijo
router.get('/estudiante/:estudianteId/notas', padreController.getNotas); //Obtener solo notas de un estudiante
router.get('/estudiante/:estudianteId/horarios', padreController.getHorarios); //Obtener solo horarios de un estudiante
router.get('/estudiante/:estudianteId/asistencias', padreController.getInasistencias); //Obtener asistencias de un estudiante




module.exports = router;
