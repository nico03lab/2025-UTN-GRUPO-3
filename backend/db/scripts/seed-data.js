const fs = require('fs');
const db = require('../db.js'); // si db.js también usa require

// --- 1. Crear tablas ---
const schema = fs.readFileSync('./schema_sqlite.sql', 'utf8');
db.exec(schema);
console.log('Tablas creadas correctamente');

// --- 2. Insertar datos de prueba ---

// Localidades
const localidades = [
  { Nombre: 'La Plata', Provincia: 'Buenos Aires' },
  { Nombre: 'Berisso', Provincia: 'Buenos Aires' },
];
const insertLocalidad = db.prepare('INSERT INTO Localidades (Nombre, Provincia) VALUES (?, ?)');
for (const loc of localidades) insertLocalidad.run(loc.Nombre, loc.Provincia);

// --- Especialidad ---
db.prepare('INSERT INTO Especialidades (Nombre) VALUES (?)').run('Ciencias Exactas');

// --- Curso ---
db.prepare(`
  INSERT INTO Cursos (IdCurso, Nivel, IdEspecialidad, AnioLectivo, CantMaxAlumnos)
  VALUES (?, ?, ?, ?, ?)
`).run('CEX-101', '1er Año', 1, 2025, 20);

// --- Materias ---
const materias = ['Matemática', 'Física', 'Química', 'Biología', 'Informática', 'Geometría', 'Estadística'];
const insertMateria = db.prepare('INSERT INTO Materias (Nombre) VALUES (?)');
for (const m of materias) insertMateria.run(m);

// --- Docentes ---
const docentes = [
  { DNIDocente: '10000001', Apellido: 'Gomez', Nombre: 'Laura', IdLocalidad: 1 },
  { DNIDocente: '10000002', Apellido: 'Martinez', Nombre: 'Jorge', IdLocalidad: 2 },
  { DNIDocente: '10000003', Apellido: 'Diaz', Nombre: 'Ana', IdLocalidad: 1 },
];
const insertDocente = db.prepare(`
  INSERT INTO Docentes (DNIDocente, Apellido, Nombre, IdLocalidad)
  VALUES (?, ?, ?, ?)
`);
for (const d of docentes) insertDocente.run(d.DNIDocente, d.Apellido, d.Nombre, d.IdLocalidad);

// --- Alumnos y Tutores ---
for (let i = 1; i <= 15; i++) {
  const dniAlumno = (20000000 + i).toString();
  const alumno = {
    DNI: dniAlumno,
    Apellido: `Apellido${i}`,
    Nombres: `Alumno${i}`,
    IdLocalidad: i % 2 === 0 ? 1 : 2,
    Email: `alumno${i}@mail.com`,
  };
  db.prepare(`
    INSERT INTO Alumnos (DNI, Apellido, Nombres, IdLocalidad, Email)
    VALUES (?, ?, ?, ?, ?)
  `).run(alumno.DNI, alumno.Apellido, alumno.Nombres, alumno.IdLocalidad, alumno.Email);

  // Tutores
  const dniTutor = (30000000 + i).toString();
  const tutor = {
    DNITutor: dniTutor,
    Apellido: `Tutor${i}`,
    Nombre: `TutorNombre${i}`,
    IdLocalidad: i % 2 === 0 ? 1 : 2,
  };
  db.prepare(`
    INSERT INTO Tutores (DNITutor, Apellido, Nombre, IdLocalidad)
    VALUES (?, ?, ?, ?)
  `).run(tutor.DNITutor, tutor.Apellido, tutor.Nombre, tutor.IdLocalidad);

  // Alumno-Tutor
  db.prepare(`
    INSERT INTO AlumnoTutor (DNIAlumno, DNITutor, Relacion)
    VALUES (?, ?, ?)
  `).run(dniAlumno, dniTutor, 'Padre/Madre');
}

// --- Inscribir todos los alumnos al curso ---
const alumnosInscritos = db.prepare('SELECT DNI FROM Alumnos').all();
for (const a of alumnosInscritos) {
  db.prepare(`
    INSERT INTO Inscripciones (DNIAlumno, IdCurso)
    VALUES (?, ?)
  `).run(a.DNI, 'CEX-101');
}

// --- Asignar docentes a materias del curso ---
const cursoMateriaIds = [];
materias.forEach((m, idx) => {
  const materia = db.prepare('SELECT IdMateria FROM Materias WHERE Nombre = ?').get(m);
  db.prepare(`
    INSERT INTO CursoMateria (IdCurso, IdMateria, CantHorasSemanales)
    VALUES (?, ?, ?)
  `).run('CEX-101', materia.IdMateria, 4);
  const cursoMateria = db.prepare('SELECT IdCursoMateria FROM CursoMateria WHERE IdCurso = ? AND IdMateria = ?').get('CEX-101', materia.IdMateria);
  cursoMateriaIds.push(cursoMateria.IdCursoMateria);
});

// Asignar docentes aleatoriamente a materias
cursoMateriaIds.forEach((id, i) => {
  const docente = docentes[i % docentes.length];
  db.prepare(`
    INSERT INTO DocenteCursoMateria (DNIDocente, IdCursoMateria, Rol)
    VALUES (?, ?, ?)
  `).run(docente.DNIDocente, id, 'Titular');
});

console.log('Base de datos inicializada con datos completos');
