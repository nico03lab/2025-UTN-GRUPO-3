const db = require('../db/db');
const {getLocalidadByNombre, createLocalidad} = require('./localidadController')
const PadreModel = require('../controllers/padreModel');

const padreController ={

    //obtener datos por el dni del padre
    getTutor: async (req,res) => {
        try{
        const {padreId} = req.params; // Si viene del token o del parámetro
        const tutor = await PadreModel.getTutor(padreId);
        res.json({
            success: true,
            data: tutor
        });
        } catch (error) {
        console.error('Error obteniendo al tutor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener al tutor'
        });
        }
    },
    // Obtener todos los hijos
    getHijos: async (req, res) => {
        try {
        const padreId = req.params.padreId || req.user.id; // Si viene del token o del parámetro
        
        const hijos = await PadreModel.getHijos(padreId);
        
        res.json({
            success: true,
            data: hijos
        });
        } catch (error) {
        console.error('Error obteniendo hijos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los hijos'
        });
        }
    },

    // Obtener información completa de un hijo
    getHijoCompleto: async (req, res) => {
        try {
        const { estudianteId } = req.params;
        const padreId = req.user?.id || req.query.padreId;

        // Verificar que el estudiante es hijo del padre
        const hijos = await PadreModel.getHijos(padreId);
        const esHijo = hijos.some(h => h.id == estudianteId);

        if (!esHijo) {
            return res.status(403).json({
            success: false,
            message: 'No tienes permiso para ver este estudiante'
            });
        }

        // Obtener toda la información
        const [notas, horarios] = await Promise.all([
            PadreModel.getNotasEstudiante(estudianteId),
            PadreModel.getHorariosEstudiante(estudianteId)
        ]);

        const estudiante = hijos.find(h => h.id == estudianteId);

        res.json({
            success: true,
            data: {
            estudiante,
            notas,
            horarios
            }
        });
        } catch (error) {
        console.error('Error obteniendo información del hijo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener información del estudiante'
        });
        }
    },

    // Obtener solo notas
    getNotas: async (req, res) => {
        try {
        const { estudianteId } = req.params;
        
        const notas = await PadreModel.getNotasEstudiante(estudianteId);
        
        res.json({
            success: true,
            data: notas
        });
        } catch (error) {
        console.error('Error obteniendo notas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las notas'
        });
        }
    },

    getHorarios: async (req, res) => {
        try {
        const { estudianteId } = req.params;
        
        const horarios = await PadreModel.getHorariosEstudiante(estudianteId);
        res.json({
            success: true,
            data: horarios
        });
        } catch (error) {
        console.error('Error obteniendo horarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los horarios'
        });
        }
    },

    // Obtener asistencias
    getInasistencias: async (req, res) => {
        try {
        const { estudianteId } = req.params;
        
        const inasistencias = await PadreModel.getInasistenciasEstudiante(
            estudianteId,
        );
        
        res.json({
            success: true,
            data: inasistencias
        });
        } catch (error) {
        console.error('Error obteniendo asistencias:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las asistencias'
        });
        }
    }
};

const getTutorByDNI = (dni) =>{
    return db.prepare('SELECT * FROM Tutores WHERE DNITutor = ?').get(dni);
};

const createTutor = (datosTutor) => { 
    const stmt = db.prepare('INSERT INTO Tutores (DNITutor, Apellido, Nombre, Calle, Numero, IdLocalidad, TelefonoCel, TelefonoLinea, Email) VALUES (?,?,?,?,?,?,?,?,?)');
    const localidadExistente = getLocalidadByNombre(datosTutor.localidad, datosTutor.provincia );
    let idLocalidad;
    if (localidadExistente){
        idLocalidad = localidadExistente.IdLocalidad;
    }else {
        idLocalidad = createLocalidad(datosTutor.localidad, datosTutor.provincia);
    }
    stmt.run (
        datosTutor.dni, 
        datosTutor.nombre, 
        datosTutor.apellido, 
        datosTutor.calle,
        datosTutor.telefonoCel,
        idLocalidad, 
        datosTutor.telefono,
        datosTutor.telefonoLinea,
        datosTutor.email);
};

const linkAlumnoTutor =(alumnoDNI, tutorDNI, relacion) =>{

    const stmt = db.prepare('INSERT OR IGNORE INTO AlumnoTutor (DNIAlumno, DNITutor, Relacion) VALUES (?,?,?)' );
    return stmt.run(alumnoDNI, tutorDNI, relacion);
};
module.exports = {linkAlumnoTutor, createTutor, getTutorByDNI, padreController};