const fs = require('fs');
const db = require('../db.js'); 

// --- 1. Crear tablas ---
const schema = fs.readFileSync('./db/scripts/schema_update.sql', 'utf8');
db.exec(schema);
console.log('Tablas creadas correctamente');

// --- 2. Insertar datos de prueba ---

// Localidades
const localidades = [
  { IdLocalidad:1, Nombre: 'La Plata', Provincia: 'Buenos Aires' },
  { IdLocalidad:2, Nombre: 'Berisso', Provincia: 'Buenos Aires' },
  { IdLocalidad:3, Nombre: 'Ensenada', Provincia: 'Buenos Aires' },
  { IdLocalidad:4, Nombre: 'Gonnet', Provincia: 'Buenos Aires' },
  { IdLocalidad:5, Nombre: 'Ringuelet', Provincia: 'Buenos Aires' },
];
const insertLocalidad = db.prepare('INSERT INTO Localidades (IdLocalidad, Nombre, Provincia) VALUES (?, ?, ?)');
for (const loc of localidades) insertLocalidad.run(loc.IdLocalidad, loc.Nombre, loc.Provincia);

// --- Especialidades ---
const especialidades = ['Cs. Exactas', 'Cs. Naturales', 'Cs.Sociales'];
const insertEspecialidad = db.prepare('INSERT INTO Especialidades (Nombre) VALUES (?)');
for (const e of especialidades) insertEspecialidad.run(e);

// --- Curso ---
const cursos = [
  { IdCurso:'1A-SEC', Nivel:'Secundario', Grado: 1, IdEspecialidad: 1, Letra:'A', Turno:'Mañana', CantMaxAlumnos:30 },
  { IdCurso:'2C-SEC', Nivel:'Secundario', Grado: 1, IdEspecialidad:2, Letra:'C', Turno:'Mañana', CantMaxAlumnos:20 },
  { IdCurso:'5D-PRI', Nivel:'Primario', Grado: 5, IdEspecialidad:null, Letra:'D', Turno:'Tarde', CantMaxAlumnos:20 },
];

const insertCurso = db.prepare(`  INSERT INTO Cursos (IdCurso, Nivel, Grado, IdEspecialidad, Letra, Turno, CantMaxAlumnos)
  VALUES (?, ?, ?, ?, ?, ?, ?)`)

for (const c of cursos) insertCurso.run(c.IdCurso, c.Nivel, c.Grado, c.IdEspecialidad, c.Letra, c.Turno, c.CantMaxAlumnos);

// --- Materias ---
const materias = [
  ["Matemática"],
  ["Lengua y literatura"],
  ["Geografia"],
  ["Historia"],
  ["Economia"],
  ["Inglés"],
  ["Educación Física"],
  ["Informatica"],
  ["Fisica"],
  ["Biologia"],
  ["Derecho"],
  ["Quimica"]
];

const insertMateria = db.prepare('INSERT INTO Materias (Nombre) VALUES (?)');
for (const m of materias) insertMateria.run(m);

const aulas = [{NumAula: 101, Piso: 1, Capacidad: 30, Tipo: 'Regular'},
              {NumAula: 102, Piso: 1, Capacidad: 30, Tipo: 'Regular'},
              {NumAula: 103, Piso: 1, Capacidad: 30, Tipo: 'Regular'},
              {NumAula: 211, Piso: 2, Capacidad: 50, Tipo: 'Laboratorio'},
              {NumAula: 10, Piso: 0, Capacidad: 100, Tipo: 'Campo Deportes'}
];

const insertAulas = db.prepare(`
    INSERT INTO Aulas (NumAula, Piso, Capacidad, Tipo)
    VALUES (?, ?, ?, ?)
`);

for (const au of aulas) insertAulas.run(au.NumAula, au.Piso, au.Capacidad, au.Tipo);

const usuarios = [
  // Docentes
  ["doc-001", "HMMendez", "doc-001", "docente"],
  ["doc-002", "DarioZar", "doc-002", "docente"],
  ["doc-003", "RaiLop", "doc-003", "docente"],
  ["doc-004", "MarceloGali", "doc-004", "docente"],
  ["doc-005", "AriaMarti", "doc-005", "docente"],
  ["doc-006", "EstebanRios", "doc-006", "docente"],
  ["doc-007", "RodmanAz", "doc-007", "docente"],
  ["doc-008", "AleCast01", "doc-008", "docente"],
  // 7 alumnos 1A-SEC
  ["est-001","mariaGon33","est-001","estudiante"],
  ["est-002","juanPez44","est-002","estudiante"],
  ["est-003","luciaFer22","est-003","estudiante"],
  ["est-004","carlosRam11","est-004","estudiante"],
  ["est-005","anaLop55","est-005","estudiante"],
  ["est-006","martinTor33","est-006","estudiante"],
  ["est-007","sofiaMar77","est-007","estudiante"],
  // 8 alumnos 2C-SEC
  ["est-008","diegoCas88","est-008","estudiante"],
  ["est-009","valentinaRoj99","est-009","estudiante"],
  ["est-010","tomasGom10","est-010","estudiante"],
  ["est-011","camilaVeg11","est-011","estudiante"],
  ["est-012","emilianoSil12","est-012","estudiante"],
  ["est-013","isabellaRom13","est-013","estudiante"],
  ["est-014","matiasAlv14","est-014","estudiante"],
  ["est-015","sofiaMol15","est-015","estudiante"],

  // 7 alumnos 5D-PRI
  ["est-016","lucasCor16","est-016","estudiante"],
  ["est-017","martinaRio17","est-017","estudiante"],
  ["est-018","federicoSan18","est-018","estudiante"],
  ["est-019","julietaDia19","est-019","estudiante"],
  ["est-020","ignacioOrt20","est-020","estudiante"],
  ["est-021","lucianaMed21","est-021","estudiante"],
  ["est-022","brunoVar22","est-022","estudiante"],

  // Tutores
  ["tut-001", "Laura González", "tut-001", "padre"],
  ["tut-002", "Jorge Pérez", "tut-002", "padre"],
  ["tut-003", "Patricia Fernández", "tut-003", "padre"],
  ["tut-004", "Luis Ramírez", "tut-004", "padre"],
  ["tut-005", "Marta López", "tut-005", "padre"],
  ["tut-006", "Roberto Torres", "tut-006", "padre"],
  ["tut-007", "Sofía Martínez", "tut-007", "padre"],
  ["tut-008", "Diego Castro", "tut-008", "padre"],
  ["tut-009", "Valentina Rojas", "tut-009", "padre"],
  ["tut-010", "Tomás Gómez", "tut-010", "padre"],
  ["tut-011", "Camila Vega", "tut-011", "padre"],
  ["tut-012", "Emiliano Silva", "tut-012", "padre"],
  ["tut-013", "Isabella Romero", "tut-013", "padre"],
  ["tut-014", "Matías Alvarez", "tut-014", "padre"],
  ["tut-015", "Sofía Molina", "tut-015", "padre"],
  ["tut-016", "Lucas Córdoba", "tut-016", "padre"],
  ["tut-017", "Martina Ríos", "tut-017", "padre"],
  ["tut-018", "Federico Sánchez", "tut-018", "padre"],
  ["tut-019", "Julieta Díaz", "tut-019", "padre"],
  ["tut-020", "Ignacio Ortiz", "tut-020", "padre"],
  //Directivos
  ["dir-001", "manmilo", "dir-001", "directivo"],
  ["dir-002", "FerPerez", "dir-002", "directivo"],
  ["dir-003", "AntoSid", "dir-003", "directivo"],
  ["dir-004", "ZelenofKaren", "dir-004", "directivo"],
  ["dir-005", "MLToreli", "dir-005", "directivo"]
];

const insertUsuario = db.prepare(`
  INSERT INTO Usuarios (IdUsuario, NombreUsuario, Pass, Tipo)
  VALUES (?, ?, ?, ?)
`);

for (const u of usuarios) insertUsuario.run(u);

// --- Docentes ---

const docentes = [
  ["30111222", "Mendez", "Horacio Manuel", "San Martín", "123", 1, "1165432211", "42115544", "m.gonzalez@escuela.edu", "doc-001"],
  ["29888777", "Zaragosa", "Dario Lucas", "Belgrano", "456", 2, "1156783344", null, "j.perez@escuela.edu", "doc-002"],
  ["31222333", "Lopenato", "Raimundo", "Mitre", "789", 3, "1167891122", "42667788", "l.fernandez@escuela.edu", "doc-003"],
  ["28777111", "Galilei", "Marcelo", "Rivadavia", "321", 1, "1144455566", null, "c.ramirez@escuela.edu", "doc-004"],
  ["30555999", "Martiarena", "Ariana", "Sarmiento", "654", 2, "1177788899", "42223344", "a.lopez@escuela.edu", "doc-005"],
  ["29999333", "Rios", "Esteban", "Alvear", "987", 3, "1161122233", null, "m.torres@escuela.edu", "doc-006"],
  ["31444555", "Rodman", "Azucena", "Lavalle", "741", 1, "1155556677", "42998877", "s.martinez@escuela.edu", "doc-007"],
  ["30222777", "Castrilli", "Alejandro Ramon", "Urquiza", "852", 2, "1188990011", null, "d.castro@escuela.edu", "doc-008"]
];


const insertDocentes = db.prepare(`
  INSERT INTO Docentes (DNIDocente, Apellido, Nombre, Calle, Numero, IdLocalidad, TelefonoCel, TelefonoLinea, Email, IdUsuario)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const d of docentes) {
  insertDocentes.run(d);
}

const insertAlu = db.prepare(`
  INSERT INTO Alumnos
    (DNIAlumno, Apellido, Nombres, Calle, Numero, IdLocalidad, Telefono, Email, Estado, FechaNacimiento, FechaAlta, FechaBaja, IdCurso, IdUsuario)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const alumnos = [
  // 7 alumnos 1A-SEC
  ["51000000","González","María","San Martín","123",1,"1165432211","m.gonzalez@escuela.edu","activo","2014-01-15","2009-03-16",null,"1A-SEC","est-001"],
  ["51000001","Pérez","Juan","Belgrano","456",2,"1156783344","j.perez@escuela.edu","activo","2014-05-20","2009-04-12",null,"1A-SEC","est-002"],
  ["51000002","Fernández","Lucía","Mitre","789",3,"1167891122","l.fernandez@escuela.edu","activo","2014-08-30","2009-05-01",null,"1A-SEC","est-003"],
  ["51000003","Ramírez","Carlos","Rivadavia","321",1,"1144455566","c.ramirez@escuela.edu","activo","2014-02-11","2009-06-15",null,"1A-SEC","est-004"],
  ["51000004","López","Ana","Sarmiento","654",2,"1177788899","a.lopez@escuela.edu","activo","2014-09-22","2009-07-07",null,"1A-SEC","est-005"],
  ["51000005","Torres","Martín","Alvear","987",3,"1161122233","m.torres@escuela.edu","activo","2014-03-18","2009-08-19",null,"1A-SEC","est-006"],
  ["51000006","Martínez","Sofía","Lavalle","741",1,"1155556677","s.martinez@escuela.edu","activo","2014-06-05","2009-09-23",null,"1A-SEC","est-007"],
  // 8 alumnos 2C-SEC
  ["50000007","Castro","Diego","Urquiza","852",2,"1188990011","d.castro@escuela.edu","activo","2013-12-10","2008-02-15",null,"2C-SEC","est-008"],
  ["50000008","Rojas","Valentina","España","159",3,"1166677889","v.rojas@escuela.edu","activo","2013-11-21","2008-03-08",null,"2C-SEC","est-009"],
  ["50000009","Gómez","Tomás","San Juan","753",1,"1155544332","t.gomez@escuela.edu","activo","2013-09-30","2008-04-11",null,"2C-SEC","est-010"],
  ["50000010","Vega","Camila","Corrientes","852",2,"1167788990","c.vega@escuela.edu","activo","2013-07-15","2008-05-19",null,"2C-SEC","est-011"],
  ["50000011","Silva","Emiliano","Belgrano","321",3,"1156677889","e.silva@escuela.edu","activo","2013-05-08","2008-06-25",null,"2C-SEC","est-012"],
  ["50000012","Romero","Isabella","Mitre","654",1,"1178899001","i.romero@escuela.edu","activo","2013-03-22","2008-07-30",null,"2C-SEC","est-013"],
  ["50000013","Alvarez","Matías","Rivadavia","147",2,"1163344556","m.alvarez@escuela.edu","activo","2013-01-17","2008-09-10",null,"2C-SEC","est-014"],
  ["50000014","Molina","Sofía","San Martín","258",3,"1156678990","s.molina@escuela.edu","activo","2013-06-05","2008-10-21",null,"2C-SEC","est-015"],
  // 7 alumnos 5D-PRI
  ["53000015","Córdoba","Lucas","Belgrano","369",1, null,"l.cordoba@escuela.edu","activo","2015-02-12","2010-03-16",null,"5D-PRI","est-016"],
  ["53000016","Ríos","Martina","Mitre","741",2, null,"m.rios@escuela.edu","activo","2015-08-18","2010-04-22",null,"5D-PRI","est-017"],
  ["53000017","Sánchez","Federico","Corrientes","852",3, null,"f.sanchez@escuela.edu","activo","2015-01-25","2010-05-11",null,"5D-PRI","est-018"],
  ["53000018","Díaz","Julieta","Alvear","963",1, null,"j.diaz@escuela.edu","activo","2015-09-30","2010-06-30",null,"5D-PRI","est-019"],
  ["53000019","Ortiz","Ignacio","Lavalle","357",2,"1177788992","i.ortiz@escuela.edu","activo","2015-03-07","2010-07-15",null,"5D-PRI","est-020"],
  ["53000020","Medina","Luciana","Urquiza","159",3,"1155566899","l.medina@escuela.edu","activo","2015-05-21","2010-08-01",null,"5D-PRI","est-021"],
  ["53000021","Vargas","Bruno","San Juan","753",1,"1167788991","b.vargas@escuela.edu","activo","2015-07-14","2010-09-12",null,"5D-PRI","est-022"],
  // Inscripción en trámite → sin usuario
  ["50000022","Cabrera","Agustina","España","852",2,"1178899002","a.cabrera@escuela.edu","Inscripción en tramite","2015-04-12",null,null,null,null],
  ["50000023","Herrera","Nicolás","Belgrano","456",3,"1156677882","n.herrera@escuela.edu","Inscripción en tramite","2015-01-20",null,null,null,null],
  ["50000024","Méndez","Victoria","Mitre","123",1,"1167788993","v.mendez@escuela.edu","Inscripción en tramite","2015-03-05",null,null,null,null],
  ["50000025","Cruz","Tomás","Rivadavia","987",2,"1178899003","t.cruz@escuela.edu","Inscripción en trámite","2015-02-28",null,null,null,null],
  ["50000026","Figueroa","Camila","Lavalle","321",3,"1155566779","c.figueroa@escuela.edu","Inscripción en tramite","2015-05-18",null,null,null,null],
  ["50000027","Luna","Mateo","San Martín","654",1,"1166677883","m.luna@escuela.edu","Inscripción en tramite","2015-06-22",null,null,null,null],
  ["50000028","Peralta","Sofía","Corrientes","852",2,"1177788994","s.peralta@escuela.edu","Inscripción en tramite","2015-07-30",null,null,null,null],
  ["50000029","Marín","Bruno","Alvear","147",3,"1156677884","b.marin@escuela.edu","Inscripción en tramite","2015-08-14",null,null,null,null]
];

  // Ejecutar inserts
  for (const a of alumnos) {
    insertAlu.run(a);
  }

  // Tutores
  const tutores = [
  ["25000000","González","Laura","San Martín","123",1,"1161112233","42110011","l.gonzalez@correo.com","tut-001"],
  ["26000001","Pérez","Jorge","Belgrano","456",2,"1152223344","42220022","j.perez@correo.com","tut-002"],
  ["27000002","Fernández","Patricia","Mitre","789",3,"1163334455","42330033","p.fernandez@correo.com","tut-003"],
  ["28000003","Ramírez","Luis","Rivadavia","321",1,"1144445566","42440044","l.ramirez@correo.com","tut-004"],
  ["29000004","López","Marta","Sarmiento","654",2,"1175556677","42550055","m.lopez@correo.com","tut-005"],
  ["30000005","Torres","Roberto","Alvear","987",3,"1166667788","42660066","r.torres@correo.com","tut-006"],
  ["31000006","Martínez","Sofía","Lavalle","741",1,"1157778899","42770077","s.martinez@correo.com","tut-007"],
  ["32000007","Castro","Diego","Urquiza","852",2,"1188889900","42880088","d.castro@correo.com","tut-008"],
  ["33000008","Rojas","Valentina","España","159",3,"1169990011","42990099","v.rojas@correo.com","tut-009"],
  ["34000009","Gómez","Tomás","San Juan","753",1,"1151112233","43001111","t.gomez@correo.com","tut-010"],
  ["35000010","Vega","Camila","Corrientes","852",2,"1162223344","43112222","c.vega@correo.com","tut-011"],
  ["36000011","Silva","Emiliano","Belgrano","321",3,"1153334455","43223333","e.silva@correo.com","tut-012"],
  ["37000012","Romero","Isabella","Mitre","654",1,"1164445566","43334444","i.romero@correo.com","tut-013"],
  ["38000013","Alvarez","Matías","Rivadavia","147",2,"1155556677","43445555","m.alvarez@correo.com","tut-014"],
  ["39000014","Molina","Sofía","San Martín","258",3,"1166667788","43556666","s.molina@correo.com","tut-015"],
  ["26000015","Córdoba","Lucas","Belgrano","369",1,"1157778899","43667777","l.cordoba@correo.com","tut-016"],
  ["27000016","Ríos","Martina","Mitre","741",2,"1168889900","43778888","m.rios@correo.com","tut-017"],
  ["28000017","Sánchez","Federico","Corrientes","852",3,"1159990011","43889999","f.sánchez@correo.com","tut-018"],
  ["29000018","Díaz","Julieta","Alvear","963",1,"1161112234","43990000","j.diaz@correo.com","tut-019"],
  ["30000019","Ortiz","Ignacio","Lavalle","357",2,"1152223345","44001111","i.ortiz@correo.com","tut-020"]
];


  // Insertar tutores
  const insertTutor = db.prepare(`
    INSERT INTO Tutores
      (DNITutor, Apellido, Nombre, Calle, Numero, IdLocalidad, TelefonoCel, TelefonoLinea, Email, IdUsuario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const t of tutores) insertTutor.run(t);
  // Alumno-Tutor

  const alumnoTutor = [
  // Alumno 50000000
  ["51000000","25000000","Madre"],
  ["51000000","26000001","Padre"],
  // Alumno 50000001
  ["51000001","27000002","Madre"],
  ["51000001","28000003","Padre"],
  // Alumno 50000002
  ["51000002","29000004","Madre"],
  ["51000002","30000005","Padre"],
  // Alumno 50000003
  ["51000003","31000006","Madre"],
  ["51000003","32000007","Padre"],
  // Alumno 50000004
  ["51000004","33000008","Madre"],
  // Alumno 50000005
  ["51000005","34000009","Padre"],
  // Alumno 50000006
  ["51000006","35000010","Madre"],
  ["51000006","36000011","Padre"],
  // Alumno 50000007
  ["50000007","37000012","Madre"],
  ["50000007","38000013","Padre"],
  // Alumno 50000008
  ["50000008","39000014","Madre"],
  // Alumno 50000009
  ["50000009","26000015","Padre"],
  // Alumno 50000010
  ["50000010","27000016","Madre"],
  ["50000010","28000017","Padre"],
  // Alumno 50000011
  ["50000011","29000018","Madre"],
  ["50000011","30000019","Padre"],
  // Alumno 50000012 (solo madre)
  ["50000012","25000000","Madre"],
  // Alumno 50000013 (solo padre)
  ["50000013","26000001","Padre"],
  // Alumno 50000014
  ["50000014","27000002","Madre"],
  // Alumno 50000015
  ["53000015","28000003","Padre"],
  // Alumno 50000016
  ["53000016","29000004","Madre"],
  // Alumno 50000017
  ["53000017","30000005","Padre"],
  // Alumno 50000018
  ["53000018","31000006","Madre"],
  // Alumno 50000019
  ["53000019","32000007","Padre"],
  // Alumno 50000020
  ["53000020","33000008","Madre"],
  // Alumno 50000021
  ["53000021","34000009","Padre"],
  // Alumno 50000022
  ["50000022","35000010","Madre"],
  // Alumno 50000023
  ["50000023","36000011","Padre"],
  // Alumno 50000024
  ["50000024","37000012","Madre"],
  // Alumno 50000025
  ["50000025","38000013","Padre"],
  // Alumno 50000026
  ["50000026","39000014","Madre"],
  // Alumno 50000027
  ["50000027","26000015","Padre"],
  // Alumno 50000028
  ["50000028","27000016","Madre"],
  // Alumno 50000029
  ["50000029","28000017","Padre"]
];

  // Insertar relaciones Alumno-Tutor
  const insertAlumnoTutor = db.prepare(`
    INSERT INTO AlumnoTutor
      (DNIAlumno, DNITutor, Relacion)
      VALUES (?, ?, ?)
  `);

  for (const at of alumnoTutor) insertAlumnoTutor.run(at);


// --- Asignar docentes a materias del curso ---
const cursoMateria = [
  // 1A-SEC
  ["1A-SEC", 1, "30111222", 5], // Matemática
  ["1A-SEC", 2, "29888777", 4], // Lengua
  ["1A-SEC", 3, "31222333", 3], // Biologia
  ["1A-SEC", 4, "28777111", 2], // Historia

  // 2C-SEC
  ["2C-SEC", 1, "30555999", 5], // Matemática
  ["2C-SEC", 2, "29999333", 4], // Lengua
  ["2C-SEC", 5, "31444555", 3], // Geografía
  ["2C-SEC", 6, "30222777", 2], // Inglés

  // 5D-PRI
  ["5D-PRI", 1, "30111222", 5], // Matemática
  ["5D-PRI", 2, "29888777", 4], // Lengua
  ["5D-PRI", 7, "31222333", 3], // Educación Física
  ["5D-PRI", 8, "28777111", 2]  
];

const insertCursoMateria = db.prepare(`
  INSERT INTO CursoMateria (IdCurso, IdMateria, DNIDocente, CantHorasSemanales)
  VALUES (?, ?, ?, ?)
`);

for (const cm of cursoMateria) insertCursoMateria.run(cm);

const horarioMateria = [
  // 1A-SEC
  ["1A-SEC", 1, "Lunes", "08:00", "10:00", 101], // Matemática lunes
  ["1A-SEC", 2, "Lunes", "10:00", "12:00", 101], // Lengua lunes
  ["1A-SEC", 3, "Martes", "10:00", "12:00", 101], // Geografia martes
  ["1A-SEC", 4, "Martes", "08:00", "10:00", 101], // Historia martes
  ["1A-SEC", 10, "Miercoles", "08:00", "10:00", 101], // Matematica miercoles
  ["1A-SEC", 5, "Miercoles", "10:15", "12:30", 101], //Economia miercoles
  ["1A-SEC", 6, "Jueves", "10:00", "12:00", 101], // Ingles jueves
  ["1A-SEC", 7, "Jueves", "10:00", "12:00", 10], // Educacion Fisica jueves
  ["1A-SEC", 8, "Viernes", "08:00", "12:00", 101], // Informatica viernes

  // 2C-SEC
  ["2C-SEC", 4, "Lunes", "08:00", "09:30", 102], 
  ["2C-SEC", 3, "Lunes", "09:45", "12:00", 102], 
  ["2C-SEC", 1, "Martes", "08:00", "11:30", 102], 
  ["2C-SEC", 2, "Martes", "11:45", "13:00", 102], 
  ["2C-SEC", 7, "Miercoles", "08:00", "09:45", 102], 
  ["2C-SEC", 8, "Miercoles", "09:45", "12:30", 102], 
  ["2C-SEC", 5, "Jueves", "08:00", "10:30", 102], 
  ["2C-SEC", 6, "Jueves", "11:00", "12:00", 102], 
  ["2C-SEC", 4, "Viernes", "11:00", "12:00", 102], 
  ["2C-SEC", 2, "Viernes ", "11:00", "12:00", 102], 
  // 5D-PRI
  ["5D-PRI", 5, "Lunes", "08:00", "09:30", 103], 
  ["5D-PRI", 6, "Lunes", "09:45", "12:00", 103], 
  ["5D-PRI", 7, "Martes", "08:00", "11:30", 103], 
  ["5D-PRI", 2, "Martes", "11:45", "13:00", 103], 
  ["5D-PRI", 10, "Miercoles", "08:00", "09:45", 103], 
  ["5D-PRI", 8, "Miercoles", "09:45", "12:30", 103], 
  ["5D-PRI", 2, "Jueves", "08:00", "10:30", 103], 
  ["5D-PRI", 6, "Jueves", "11:00", "12:00", 103], 
  ["5D-PRI", 4, "Viernes", "11:00", "12:00", 103], 
  ["5D-PRI", 1, "Viernes ", "11:00", "12:00", 103]
];

const insertHorario = db.prepare(`
  INSERT INTO HorarioMateria 
    (IdCurso, IdMateria, DiaSemana, HoraInicio, HoraFin, NumAula) 
    VALUES (?, ?, ?, ?, ?, ?)
`);

for (const h of horarioMateria) insertHorario.run(h);

//inscripciones

const inscripciones = [
  ["50000022", null, "Primaria", 2, "Mañana", "pendiente"],          // Primaria
  ["50000023", 1, "Secundaria", 3, "Tarde", "pendiente"],             // Secundaria → Ciencias Sociales
  ["50000024", null, "Primaria", 1, "Mañana", "pendiente"],           // Primaria
  ["50000025", 2, "Secundaria", 2, "Tarde", "pendiente"],             // Secundaria → Ciencias Naturales
  ["50000026", 1, "Secundaria", 3, "Mañana", "pendiente"],            // Secundaria → Ciencias Sociales
  ["50000027", null, "Primaria", 1, "Mañana", "pendiente"],           // Primaria
  ["50000028", 3, "Secundaria", 2, "Tarde", "pendiente"],             // Secundaria → Matemática Avanzada
  ["50000029", 2, "Secundaria", 3, "Mañana", "pendiente"]             // Secundaria → Ciencias Naturales
];

const insertInscripcion = db.prepare(`
  INSERT INTO Inscripciones (DNIAlumno, IdEspecialidad, Nivel, Grado, Turno, Estado)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const ins of inscripciones) insertInscripcion.run(ins);

//eventos
const eventos = [
  ["Reunión de Padres", "Reunión informativa para padres", "2025-09-30 18:00", "2025-09-30 19:30", "1A-SEC", "doc-001"],
  ["Excursión al Museo", "Salida educativa al museo de ciencias", "2025-10-10 09:00", "2025-10-10 15:00", "2C-SEC", "dir-005"],
  ["Entrega de Boletines", "Entrega de calificaciones del primer trimestre", "2025-10-12 14:00", "2025-10-12 16:00", "5D-PRI", "dir-005"],
  ["Acto Día de la Primavera", "Acto con presentaciones y bandas", "2025-10-21 10:00", "2025-10-21 12:00", "1A-SEC", "dir-005"],
  ["Clase de Ciencias Especial", "Práctica de laboratorio en aula de ciencias", "2025-10-25 09:00", "2025-10-25 11:00", "2C-SEC", "doc-003"],
  ["Taller de Arte", "Taller de pintura y escultura", "2025-10-01 10:00", "2025-10-01 12:00", "5D-PRI", "dir-003"]
];

const insertEvento = db.prepare(`
  INSERT INTO Eventos (Titulo, Descripcion, FechaInicio, FechaFin, IdCurso, IdUsuario)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const e of eventos) insertEvento.run(e);

//eventos cursos

const eventosCursos = [
  ["1A-SEC", 1],
  ["2C-SEC", 2],
  ["5D-PRI", 3],
  ["1A-SEC", 4],
  ["2C-SEC", 5],
  ["5D-PRI", 6]
];

const insertEventosCursos = db.prepare(`
  INSERT INTO EventosCursos (IdCurso, IdEvento)
  VALUES (?, ?)
`);

for (const ec of eventosCursos) insertEventosCursos.run(ec);

//Directivos

const directivos = [
  ["12145628","Director","Mandela","Milton","Sarmiento","123",1,"1161122233","42110011","manmilo@escuela.edu","dir-001"],
  ["23456789","Subdirector","Perez Galdos","Fermin","Belgrano","456",2,"1152223344","42220022","FerPerez@escuela.edu","dir-002"],
  ["34567890","Coordinador Académico","Sidney","Antonia","Mitre","789",3,"1163334455","42330033","AntoSid@escuela.edu","dir-003"],
  ["25678901","Coordinador Administrativo","Zelenof","Karen","Rivadavia","321",1,"1144445566","42440044","ZelenofKaren@escuela.edu","dir-004"],
  ["26789012","Vicedirector","Toreli","Maria Laura","Alvear","987",2,"1166667788","42660066","MLToreli@escuela.edu","dir-005"]
];


// Insertar en Directivo
const insertDirectivo = db.prepare(`
  INSERT INTO Directivo 
  (DNIDirectivo, Cargo, Apellido, Nombre, Calle, Numero, IdLocalidad, TelefonoCel, TelefonoLinea, Email, IdUsuario)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const d of directivos) {
  insertDirectivo.run(d);
}

// Generar algunos mensajes de ejemplo
const mensajes = [
  ["doc-001","tut-001","Hola, ¿puedes revisar la asistencia de tus alumnos?"],
  ["doc-002","tut-003","Recordatorio: enviar las calificaciones antes del viernes."],
  ["doc-003","tut-005","Por favor, confirma la participación de los alumnos en la excursión."],
  ["doc-004","tut-007","Necesito que entregues los informes de desempeño."],
  ["doc-005","tut-002","Hola, revisa los permisos de salida de los estudiantes."],
  ["doc-006","tut-010","Enviar actividades pendientes de tus alumnos."],
  ["doc-007","tut-015","Coordinar reunión sobre el plan de estudio."],
  ["doc-008","tut-020","Atención: actualizar registros de los estudiantes."]
];

// Insertar en Mensajes
const insertMensaje = db.prepare(`
  INSERT INTO Mensajes (Emisor, Receptor, Contenido)
  VALUES (?, ?, ?)
`);

mensajes.forEach(m => {
  insertMensaje.run(m[0], m[1], m[2]);
});

// Mensaje de difusión
const mensajeDifusion = {
    IdCurso: "1A-SEC",
    IdUsuario: "doc-001",
    Contenido: "Recordatorio: mañana tenemos la entrega de trabajos prácticos."
};

// Insertar en DifusionCurso
const insertDifusion = db.prepare(`
    INSERT INTO DifusionCurso (IdCurso, IdUsuario, Contenido)
    VALUES (?, ?, ?)
`);

insertDifusion.run(
    mensajeDifusion.IdCurso,
    mensajeDifusion.IdUsuario,
    mensajeDifusion.Contenido
);

db.close();

console.log('Base de datos inicializada con datos completos');
