const db = require('../db/db');
const {getAlumnoByDNI, createAlumno} = require('./alumnosController');
const {getTutorByDNI, createTutor, linkAlumnoTutor} = require('./tutoresController');
const {getCursoByNivelYTurno} = require ('./cursosController')

//endpoint 
const createInscripcion = (req, res) => { 
    const {
        alumno, 
        tutor, 
        curso, 
        relacion
    } = req.body;
    
    if (!alumno || !alumno.nombre || !alumno.apellido || !alumno.dni){
        return res.status(400).json({
            error: 'Los datos del alumno (nombre, apellido, DNI) son abligatorios'
        });
    }
    
    if (!tutor || !tutor.dni || !tutor.nombre || !tutor.apellido || !tutor.telefonoCel || !tutor.email){
        return res.status(400).json({error: 'Debe proporcionar un tutor con datos suficientes(nombre, apellido, DNI, telefonoCel, email)'});
    }
    if (!curso){
        return res.status(400).json({error: 'Curso solicitado obligatorio'});
     
    }
    try {
        const transaction = db.transaction(() => {
            //primero verifico el curso
            let idCurso;
            const cursoExistente = getCursoByNivelYTurno(curso.nivel, curso.turno);
            if(!cursoExistente){
                throw new Error('El curso solicitado no existe');
            }else{
                idCurso = cursoExistente.IdCurso;
            } 
            const alumnoExistente = getAlumnoByDNI(alumno.dni);
            if (alumnoExistente){ //esto va a ser cuando el alumno ya es parte de la institucion
                let alumnoDni = alumnoExistente.DNI;
            
                // Verificar si ya tiene inscripción
                const anioActual = new Date().getFullYear();
                const inscripcionExistente = db.prepare('SELECT id FROM Inscripciones WHERE alumnoId = ? AND anio = ?').get(alumnoDni, anioActual);
                if (inscripcionExistente) {
                    throw new Error('El alumno ya tiene una inscripción registrada para este año');
                }

            }else{
                //creo un nuevo alumno
                createAlumno(alumno);
            }
            //manejo de tutores, un tutor puede tener mas de un hijo
            const tutorExistente = getTutorByDNI(tutor.dni);
            if (!tutorExistente) {
                createTutor(tutor);
            };
            //para vincular al alumno con el tutor
            linkAlumnoTutor(alumno.dni, tutor.dni, relacion); 

            //ahora si creo la inscripcion
            const stmtInscripcion = db.prepare('INSERT INTO Inscripciones (DNIAlumno, IdCurso, FechaInscripcion, Estado) VALUES (?, ?, ?, ?)');
            const fechaHoy = new Date().toISOString().replace("T", " ").split(".")[0]; // YYYY-MM-DD HH:mm:ss
            const estado = "Pendiente";
            const resultadoInscripcion = stmtInscripcion.run(alumno.dni,idCurso, fechaHoy, estado);
            return resultadoInscripcion.lastInsertRowid;
        });
        const inscripcionId = transaction();
        //const inscripcionNueva = obtenerInscripcionPorId(inscripcionId);
        res.status(201).json({message: 'Inscripcion creada exitosamente'});

    }catch(err){
        console.error('error al crear inscripcion', err);
        if (err.message.includes('already has') || err.message.includes('ya tiene')) { //por el throw
            res.status(409).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }  
};

module.exports = {createInscripcion};
