const db = require('../db/db');
const upload = require('../config/multerConfig');
const {getAlumnoByDNI, createAlumno} = require('./alumnosController');
const {getTutorByDNI, createTutor, linkAlumnoTutor} = require('./tutoresController');
const {getCursoByNivelYTurno} = require ('./cursosController')

//endpoint 
const createInscripcion = (req, res) => { 
    console.log('Datos recibidos:', req.body.data); // verifico los datos JSON
    console.log('Archivos recibidos:', req.files); // Los archivos
    const {
        alumno, 
        tutor, 
        curso, 
        relacion
    } = JSON.parse(req.body.data);
    
    if (!alumno || !alumno.nombre || !alumno.apellido || !alumno.dni || !alumno.fechaNacimiento){
        return res.status(400).json({
            error: 'Los datos del alumno (nombre, apellido, DNI, FechaNac) son abligatorios'
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
            const cursoExistente = getCursoByNivelYTurno(curso.nivel, curso.grado, curso.turno, curso.especialidad);
            if(!cursoExistente){
                throw new Error('El curso solicitado no existe');
            }
            const alumnoExistente = getAlumnoByDNI(alumno.dni);
            if (alumnoExistente){ //esto va a ser cuando el alumno ya es parte de la institucion
               
                // Verificar si ya tiene inscripción en el año actual
                const anioActual = new Date().getFullYear();
                const inscripcionExistente = db.prepare(`
                    SELECT IdInscripcion 
                    FROM Inscripciones 
                    WHERE DNIAlumno = ? 
                    AND strftime('%Y', FechaInscripcion) = ?
                `).get(alumno.dni, anioActual.toString());
                
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
            const stmtInscripcion = db.prepare('INSERT INTO Inscripciones (DNIAlumno, IdEspecialidad, Nivel, Grado, Turno, FechaInscripcion, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)');
            const fechaHoy = new Date().toLocaleString('sv-SE', { 
                timeZone: 'America/Argentina/Buenos_Aires',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).replace(',', '');
            const estado = "Pendiente";
            const resultadoInscripcion = stmtInscripcion.run(alumno.dni,cursoExistente.IdEspecialidad,cursoExistente.Nivel, cursoExistente.Grado,cursoExistente.Turno, fechaHoy, estado);
            
            const inscripcionId = resultadoInscripcion.lastInsertRowid;
      
            // Guardar documentos (solo ruta en BD, archivo en disco)
            if (req.files) {
                console.log('Guardando documentos...');
                Object.keys(req.files).forEach(key => {
                const file = req.files[key][0];
                console.log(`  - ${key}: ${file.filename}`);
                guardarDocumento(inscripcionId, key, file);
                });
            }
            return inscripcionId;
        });
        
        const inscripcionId = transaction();
        return res.status(201).json({ 
            message: 'Inscripción creada exitosamente', 
            id: inscripcionId 
        });

    }catch(err){
        console.error('error al crear inscripcion', err);
        // Si hay error, eliminar archivos subidos
        if (req.files) {
            const fs = require('fs');
            Object.keys(req.files).forEach(key => {
                const file = req.files[key][0];
                if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
                }
            });
        }
        if (err.message.includes('ya tiene')) { //por el throw
            res.status(409).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }  
};

// Función para guardar documentos en la BD
const guardarDocumento = (idInscripcion, tipoDocumento, archivo) => {
  const stmt = db.prepare(`
    INSERT INTO DocumentacionInscripciones 
    (IdInscripcion, Descripcion, NombreArchivo, TipoMime, Archivo, RutaArchivo, FechaSubida)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const fechaHoy = new Date().toLocaleDateString('sv-SE');
  
  // Descripciones según el tipo de documento
  const descripciones = {
    'certificadoNacimiento': 'Certificado de Nacimiento',
    'certificadoEstudios': 'Certificado de Estudios',
    'fotocopia_dni': 'Fotocopia DNI (estudiante y tutor)',
    'certificadoMedico': 'Certificado Médico'
  };
  
  stmt.run(
    idInscripcion,
    descripciones[tipoDocumento],
    archivo.originalname,        // Nombre original del archivo
    archivo.mimetype,             // Tipo MIME (image/jpeg, application/pdf, etc.)
    null,                         // Archivo BLOB = null (no guardamos en BD), solo path
    archivo.path,                 // Ruta donde se guardó en disco
    fechaHoy
  );
};

// Obtener documentos de una inscripción
const getDocumentosByInscripcion = (req, res) => {
  const { idInscripcion } = req.params;
  
  try {
    const documentos = db.prepare(`
      SELECT IdDocumento, Descripcion, NombreArchivo, TipoMime, FechaSubida, RutaArchivo
      FROM DocumentacionInscripciones
      WHERE IdInscripcion = ?
    `).all(idInscripcion);
    
    return res.status(200).json(documentos);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {createInscripcion, getDocumentosByInscripcion};
