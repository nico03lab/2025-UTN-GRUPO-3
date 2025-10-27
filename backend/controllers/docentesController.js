const db = require("../db/db");
const { createUsuarioInterno } = require('./usersController');
const { getLocalidadByNombre, createLocalidad } = require("./localidadController");

const getDocentes = async () => {
    try {
        const rows = db.prepare(
            `SELECT * FROM Docentes`
        )
      .all();
    console.log("Docentes: ", rows);

    return rows;
  } catch (error) {
    throw error;
  }
}

const getHorariosDocente = (req, res) => {
  try {

    const { DNIDocente } = req.params;
    const dni = String(DNIDocente);

    const rows = db.prepare(`
      SELECT 
        h.DiaSemana,
        h.HoraInicio,
        h.HoraFin,
        h.NumAula,
        c.IdCurso,
        m.Nombre AS Materia
      FROM HorarioMateria h
      JOIN CursoMateria cm ON h.IdCurso = cm.IdCurso AND h.IdMateria = cm.IdMateria
      JOIN Materias m ON m.IdMateria = h.IdMateria
      JOIN Cursos c ON c.IdCurso = h.IdCurso
      WHERE cm.DNIDocente = ?
      ORDER BY
        CASE h.DiaSemana
          WHEN 'Lunes' THEN 1
          WHEN 'Martes' THEN 2
          WHEN 'Miercoles' THEN 3
          WHEN 'Jueves' THEN 4
          WHEN 'Viernes' THEN 5
        END,
        h.HoraInicio
    `).all(dni);

    console.log("✅ Horarios del docente:", rows);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener horarios:", error);
    res.status(500).json({ error: "Error interno al obtener horarios" });
  }
};

const getDocenteMateria = (req, res) => {
  try {
    const rows = db.prepare(
            `SELECT 
              d.DNIDocente,
              d.Nombre,
              d.Apellido,
              c.Nombre as Materia,
              d.Email
              FROM Docentes d 
              JOIN CursoMateria cm ON cm.DNIDocente = d.DNIDocente
              JOIN Materias c ON c.IdMateria = cm.IdMateria`
        )
      .all();
    res.json(rows);
    
  } catch (error) {
    console.error("Error al obtener docentes:", error);
    res.status(500).json({ error: "Error interno al obtener dcoentes" });
  }
}
const agregarNuevoDocente = (req, res) =>{
  try {
    const docente = req.body;
    console.log("Datos recibidos para el nuevo docente: ", docente);
    if (!docente || !docente.DNIDocente || !docente.Nombre || !docente.Apellido ||!docente.Email){
      return res.status(400).json({
        error: 'Los datos requeridos del docente no fueron completados'
      });
    }
    let nuevoId;

    const transaction = db.transaction(()=> {
      const docenteExistente = db.prepare(`SELECT DNIDocente FROM Docentes WHERE DNIDocente = ? `).get(docente.DNIDocente);
      if(docenteExistente){
        throw new Error('El docente ya existe');
      }else{
        //para darle un usuario 
        const ultimoUser = db.prepare(`SELECT IdUsuario FROM Usuarios where IdUsuario like 'doc%' ORDER BY IdUsuario DESC LIMIT 1`).get();
        if (ultimoUser) {
          // Extraer el número: "doc-008" -> "008"
          const numero = parseInt(ultimoUser.IdUsuario.split('-')[1]);
          // Sumar 1 y formatear con ceros: 8 + 1 = 9 -> "009"
          const nuevoNumero = (numero + 1).toString().padStart(3, '0');
          // Crear nuevo ID: "doc-009"
          nuevoId = `doc-${nuevoNumero}`;
        } else {
          // Si no hay docentes, empezar en doc-001
          nuevoId = 'doc-001';
        }
        createUsuarioInterno(nuevoId,  `${docente.Nombre} ${docente.Apellido}`, nuevoId, 'docente');
        console.log("Nuevo usuario creado, inicalmente con contraseña igual al user", nuevoId);
        createDocente(docente, nuevoId);
      };
    });
    const inscripcionId = transaction();
    return res.status(201).json({ 
        message: 'Alta de docente exitosa!', 
        id: nuevoId
    });

  } catch (error) {
    console.error('Error al crear docente:', error);
    
    // Si es un error de clave duplicada
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya existe un docente con ese DNI' });
    }
    
    res.status(500).json({ error: 'Error al crear el docente' });
  }
}

const createDocente = (docente, IdUsuario) => {
  let idLocalidad;
  const localidadExistente = getLocalidadByNombre(docente.Localidad, docente.Provincia );
  if (localidadExistente){
    idLocalidad = localidadExistente.IdLocalidad;
  }else {
    idLocalidad = createLocalidad(docente.Localidad, docente.Provincia);
  }
  const stmt = db.prepare('INSERT INTO Docentes (DNIDocente, Apellido, Nombre, Calle, Numero, IdLocalidad, TelefonoCel, TelefonoLinea, Email, IdUsuario) VALUES (?,?,?,?,?,?,?,?,?,?)');
  stmt.run(docente.DNIDocente, docente.Apellido, docente.Nombre,docente.Calle, docente.Numero, docente.idLocalidad,docente.TelefonoCel, docente.TelefonoLinea, docente.Email, IdUsuario);
}

const asociarCursoMateria = (req, res) => {
 try {
  const {dni }= req.params;
  const {IdCurso, IdMateria} = req.body;
  if (!IdCurso || !IdMateria){
    return res.status(400).json({ error: 'Curso y materia son obligatorios' });
  }
  const stmt = db.prepare('UPDATE CursoMateria SET DNIDocente = ? WHERE IdCurso = ? AND IdMateria = ?');
  const result = stmt.run(dni, IdCurso, IdMateria);
 // Verificar si se actualizó algo
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Docente no encontrado' });
  }
  res.json({ 
    message: 'Docente actualizado correctamente',
    changes: result.changes
  });

 } catch (error) {
  console.error('Error al actualizar docente:', error);
  res.status(500).json({ error: 'Error al actualizar docente' });
 }
}

module.exports = {
  getHorariosDocente, getDocentes, getDocenteMateria, agregarNuevoDocente, asociarCursoMateria
};
