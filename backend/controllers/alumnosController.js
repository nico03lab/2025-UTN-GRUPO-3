const db = require('../db/db');
const {getLocalidadByNombre, createLocalidad} = require('./localidadController');


const getAlumnos = (req, res) => {
  try {
    const alumnos = db.prepare('SELECT * FROM Alumnos').all();
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAlumnosPorCurso = (req, res) => {
  const { idCurso } = req.params;
  try {
    const alumnos = db.prepare(`
      SELECT DNIAlumno, Apellido, Nombres
      FROM Alumnos
      WHERE IdCurso = ?
    `).all(idCurso);
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAlumnoByDNI = (dni) => {
  return db.prepare('SELECT * FROM Alumnos WHERE DNIAlumno = ?').get(dni);
};

//Esto cuando se realiza la inscripcion, falta confirmarlo, es interno
const createAlumno = (datosAlumno) => {
  let idLocalidad;
  const localidadExistente = getLocalidadByNombre(datosAlumno.localidad, datosAlumno.provincia );
  if (localidadExistente){
    idLocalidad = localidadExistente.IdLocalidad;
  }else {
    idLocalidad = createLocalidad(datosAlumno.localidad, datosAlumno.provincia);
  }
  const fechaAlta = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const estado = "Inscripcion en tramite";
  const stmt = db.prepare('INSERT INTO Alumnos (DNIAlumno, Apellido, Nombres, Calle, Numero, IdLocalidad, Telefono, Email, Estado, FechaNacimiento, FechaAlta) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  stmt.run(datosAlumno.dni, datosAlumno.apellido, datosAlumno.nombre, datosAlumno.calle, datosAlumno.numero, idLocalidad, datosAlumno.telefono, datosAlumno.email, estado, datosAlumno.fechaNacimiento, fechaAlta);
}

const updateStateAlumno = (req, res) => {
  const { dni } = req.params;
  const { estado } = req.body;

  try {
    db.prepare("UPDATE Alumnos SET Estado = ? WHERE DNIAlumno = ?").run(estado, dni);
    res.json({ message: `✅ Estado actualizado a "${estado}"` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCursoAlumno = (req, res) => {
  const { dni } = req.params;
  const { idCurso } = req.body;

  console.log("📥 PUT /api/alumnos/:dni/curso");
  console.log("dni:", dni);
  console.log("idCurso:", idCurso);

  try {
    const result = db
      .prepare("UPDATE Alumnos SET IdCurso = ?, Estado = ? WHERE DNIAlumno = ?")
      .run(idCurso, "activo", dni);

    console.log("✅ Resultado DB:", result);
    res.json({ message: `Alumno ${dni} asignado al curso ${idCurso}` });
  } catch (err) {
    console.error("❌ Error SQL:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getAlumnoCompleto = (req, res) => {
  try {
    const { idUsuario } = req.params;
    
    const alumno = db.prepare(`
      SELECT 
        a.DNIAlumno,
        a.Apellido,
        a.Nombres,
        a.Email,
        a.Telefono,
        a.FechaNacimiento,
        a.Calle,
        a.Numero,
        a.IdLocalidad,
        a.IdCurso,
        l.Nombre as Localidad,
        l.Provincia,
        c.Nivel,
        c.Grado,
        c.Letra,
        u.NombreUsuario,
        u.IdUsuario,
        u.Pass
      FROM Alumnos a
      JOIN Localidades l ON a.IdLocalidad = l.IdLocalidad
      LEFT JOIN Cursos c ON a.IdCurso = c.IdCurso
      JOIN Usuarios u ON a.IdUsuario = u.IdUsuario
      WHERE u.IdUsuario = ?
    `).get(idUsuario);
    
    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    
    res.json(alumno);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener alumno' });
  };
}

const updateAlumno = async (req,res) =>{
  try {
    const { idUsuario } = req.params;
    const { 
      Apellido, 
      Nombres, 
      Email, 
      Telefono, 
      Calle, 
      Numero, 
      IdLocalidad,
      NombreUsuario,
      Pass 
    } = req.body;

    // Actualizar datos del alumno
    const stmt = db.prepare(`
      UPDATE Alumnos 
      SET Apellido = ?,
          Nombres = ?,
          Email = ?,
          Telefono = ?,
          Calle = ?,
          Numero = ?,
          IdLocalidad = ?
      WHERE IdUsuario = ?
    `);

    const result = stmt.run(
      Apellido, Nombres, Email, Telefono, Calle, Numero, IdLocalidad, idUsuario
    );

    // Actualizar usuario y/o contraseña
    if (NombreUsuario || Pass) {
      const bcrypt = require('bcrypt');
      
      if (Pass && NombreUsuario) {
        const hashedPassword = await bcrypt.hash(Pass, 10);
        const updateStmt = db.prepare(`
          UPDATE Usuarios 
          SET NombreUsuario = ?, Pass = ?
          WHERE IdUsuario = ?
        `);
        updateStmt.run(NombreUsuario, hashedPassword, idUsuario);
      } else if (Pass) {
        const hashedPassword = await bcrypt.hash(Pass, 10);
        const updateStmt = db.prepare(`
          UPDATE Usuarios 
          SET Pass = ?
          WHERE IdUsuario = ?
        `);
        updateStmt.run(hashedPassword, idUsuario);
      } else if (NombreUsuario) {
        const updateStmt = db.prepare(`
          UPDATE Usuarios 
          SET NombreUsuario = ?
          WHERE IdUsuario = ?
        `);
        updateStmt.run(NombreUsuario, idUsuario);
      }
    }

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    res.json({ success: true, message: 'Alumno actualizado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar alumno' });
  };
}

const getAlumnoUser = async (req, res) =>{
try{
      const {idUsuario} = req.params; // Si viene del token o del parámetro
      console.log("Cargado estudiante con idUser: ", idUsuario );
      
      const alumno = await db.prepare(`
          SELECT 
              a.Nombres,
              a.Apellido,
              a.Email,
              a.DNIAlumno,
              a.IdUsuario,
              c.Nivel,
              c.Grado,
              c.Letra,
              c.IdCurso
          FROM Alumnos a 
          LEFT JOIN Cursos c ON a.IdCurso = c.IdCurso
          WHERE IdUsuario = ?
          `).get(idUsuario);
      console.log ("Datos", alumno)
      res.json({
          success: true,
          data: alumno
      });
    } catch (error) {
    console.error('Error obteniendo al alumno:', error);
    res.status(500).json({
        success: false,
        message: 'Error al obtener al alumno'
    });
    }
}

module.exports = { getAlumnos,updateAlumno,getAlumnoCompleto, getAlumnosPorCurso , getAlumnoByDNI, createAlumno, getAlumnoUser, updateStateAlumno, updateCursoAlumno};
