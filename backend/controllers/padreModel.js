const db = require('../db/db');

const PadreModel = {
  //obtener al tutor
  getTutor: async (padreId) => {
    console.log('🔍 Buscando Tutor para padre ID:', padreId);
    try{
      const rows = await db.prepare(`
      SELECT 
        Nombre,
        Apellido,
        Email,
        IdUsuario
      FROM Tutores 
      WHERE DNITutor = ?
      `).get(padreId);
      console.log ("Datos", rows)
     return rows;
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener todos los hijos de un padre
  getHijos: async (padreId) => {
    try {
      const rows = await db.prepare(`
        SELECT 
          e.DNIAlumno,
          e.Nombres, 
          e.Apellido,
          c.Grado,
          c.Letra,
          c.Nivel
        FROM Alumnos e
        INNER JOIN AlumnoTutor pe ON e.DNIAlumno = pe.DNIAlumno
        JOIN Cursos c ON e.IdCurso = c.IdCurso
        WHERE pe.DNITutor = ?
        ORDER BY e.Nombres
      `).all(padreId);
      console.log(rows);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Obtener notas de un estudiante
  getNotasEstudiante: async (estudianteDNI) => {
    try {
      const rows = await db.prepare(`
        SELECT 
          m.Nombre as Materia,
          d.Nombre Profesor_nombre,
          d.Apellido Profesor_apellido,
          n.NotaTrimestral1,
          n.NotaTrimestral2,
          n.NotaTrimestral3,
          n.NotaFinal,
          b.Observaciones
        FROM BoletinDetalle n
        JOIN Boletines b ON n.IdBoletin = b.IdBoletin
		JOIN Alumnos a ON a.DNIAlumno = b.DNIAlumno
        JOIN Materias m ON n.IdMateria = m.IdMateria
        JOIN CursoMateria cm ON cm.IdMateria = m.IdMateria
        JOIN Docentes d ON d.DNIDocente = cm.DNIDocente
        WHERE b.DNIAlumno = ? and a.IdCurso = cm.IdCurso
        ORDER BY m.Nombre
      `).all(estudianteDNI);
      console.log("Notas: ", rows);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Obtener horarios de un estudiante
  getHorariosEstudiante: async (estudianteId) => {
    try {
      // Obtenemos los horarios
      const rows = await db.prepare(`
        SELECT 
          h.IdCurso,
          h.DiaSemana,
          h.HoraInicio,
          h.HoraFin,
          h.NumAula,
          m.Nombre as Materia
        FROM HorarioMateria h
        JOIN Alumnos a ON h.IdCurso = a.IdCurso
        INNER JOIN Materias m ON h.IdMateria = m.IdMateria
        WHERE a.DNIAlumno = ?
        ORDER BY 
		  CASE h.DiaSemana
                WHEN 'Lunes' THEN 1
                WHEN 'Martes' THEN 2
                WHEN 'Miercoles' THEN 3
                WHEN 'Jueves' THEN 4
                WHEN 'Viernes' THEN 5
            END,
          h.HoraInicio
      `).all(estudianteId);
      console.log("Horarios: ", rows);
      
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Obtener asistencias de un estudiante, falta implementar!!!
  getInasistenciasEstudiante: async (estudianteId) => {
    try {
      const rows = await db.prepare(`
        SELECT 
          m.Nombre as Materia,
          a.Fecha,
          da.Presente
        FROM Asistencias a 
        JOIN DetalleAsistencia da ON da.IdAsistencia = a.IdAsistencia
        JOIN Materias m ON a.IdMateria = m.IdMateria
        WHERE da.DNIAlumno = ?
      `).all(estudianteId);
      
      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = PadreModel;