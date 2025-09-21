const db = require('../db/db');
const {getLocalidadByNombre, createLocalidad} = require('./localidadController')

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
module.exports = {linkAlumnoTutor, createTutor, getTutorByDNI};