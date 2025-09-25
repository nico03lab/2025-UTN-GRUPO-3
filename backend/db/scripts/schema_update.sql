-- schema_sqlite.sql
-- Modelo de datos para SistemaEscolar (SQLite)
-- Fecha: 2025-09-18

-- Tabla Localidades
CREATE TABLE Localidades (
    IdLocalidad INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL,
    Provincia TEXT NULL
);

-- Tabla Especialidades
CREATE TABLE Especialidades (
    IdEspecialidad INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL UNIQUE
);

-- Tabla Cursos
CREATE TABLE Cursos (
    IdCurso TEXT PRIMARY KEY,
    Nivel TEXT NOT NULL,
    Grado INTEGER NOT NULL,
    IdEspecialidad INTEGER NULL,
    Letra CHAR NOT NULL,
    Turno TEXT NOT NULL,
    CantMaxAlumnos INTEGER NULL,
    FOREIGN KEY (IdEspecialidad) REFERENCES Especialidades(IdEspecialidad)
);

-- Tabla Aulas
CREATE TABLE Aulas (
    NumAula INTEGER PRIMARY KEY,
    Piso INTEGER NULL,
    Capacidad INTEGER NULL,
    Tipo TEXT NULL
);

-- Tabla Alumnos
CREATE TABLE Alumnos (
    DNIAlumno TEXT PRIMARY KEY,
    Apellido TEXT NOT NULL,
    Nombres TEXT NOT NULL,
    Calle TEXT NULL,
    Numero TEXT NULL,
    IdLocalidad INTEGER NULL,
    Telefono TEXT NULL,
    Email TEXT NULL,
    Estado TEXT NOT NULL DEFAULT 'activo',
    FechaNacimiento DATETIME NOT NULL,
    FechaAlta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FechaBaja DATETIME NULL,
    IdCurso TEXT NULL,
    IdUsuario TEXT NULL,
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
    FOREIGN KEY (IdLocalidad) REFERENCES Localidades(IdLocalidad),
    FOREIGN KEY (IdCurso) REFERENCES Cursos(IdCurso)
);

-- Datos médicos
CREATE TABLE DatosMedicos (
    DNIAlumno TEXT PRIMARY KEY,
    ObraSocial TEXT NULL,
    NumeroAfiliado TEXT NULL,
    GrupoSanguineo TEXT NULL,
    Factor TEXT NULL,
    Alergias TEXT NULL,
    EnfermedadesPrevias TEXT NULL,
    Observaciones TEXT NULL,
    FOREIGN KEY (DNIAlumno) REFERENCES Alumnos(DNI)
);

-- Tutores
CREATE TABLE Tutores (
    DNITutor TEXT PRIMARY KEY,
    Apellido TEXT NOT NULL,
    Nombre TEXT NOT NULL,
    Calle TEXT NULL,
    Numero TEXT NULL,
    IdLocalidad INTEGER NULL,
    TelefonoCel TEXT NULL,
    TelefonoLinea TEXT NULL,
    Email TEXT NULL,
    IdUsuario TEXT NOT NULL,
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
    FOREIGN KEY (IdLocalidad) REFERENCES Localidades(IdLocalidad)
);

-- Tabla relacional Alumno - Tutor
CREATE TABLE AlumnoTutor (
    DNIAlumno TEXT NOT NULL,
    DNITutor TEXT NOT NULL,
    Relacion TEXT NULL,
    PRIMARY KEY (DNIAlumno, DNITutor),
    FOREIGN KEY (DNIAlumno) REFERENCES Alumnos(DNIAlumno),
    FOREIGN KEY (DNITutor) REFERENCES Tutores(DNITutor)
);

-- Docentes
CREATE TABLE Docentes (
    DNIDocente TEXT PRIMARY KEY,
    Apellido TEXT NOT NULL,
    Nombre TEXT NOT NULL,
    Calle TEXT NULL,
    Numero TEXT NULL,
    IdLocalidad INTEGER NOT NULL,
    TelefonoCel TEXT NULL,
    TelefonoLinea TEXT NULL,
    Email TEXT NULL,
    IdUsuario TEXT NOT NULL,
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
    FOREIGN KEY (IdLocalidad) REFERENCES Localidades(IdLocalidad)
);

CREATE TABLE Directivo (
    DNIDirectivo TEXT PRIMARY KEY,
    Cargo TEXT NOT NULL,
    Apellido TEXT NOT NULL,
    Nombre TEXT NOT NULL,
    Calle TEXT NULL,
    Numero TEXT NULL,
    IdLocalidad INTEGER NULL,
    TelefonoCel TEXT NULL,
    TelefonoLinea TEXT NULL,
    Email TEXT NULL,
    IdUsuario TEXT NOT NULL,
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
    FOREIGN KEY (IdLocalidad) REFERENCES Localidades(IdLocalidad)
);

-- Materias
CREATE TABLE Materias (
    IdMateria INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL UNIQUE
);


-- Relación Curso <-> Materia
CREATE TABLE CursoMateria (
    IdCurso TEXT NOT NULL,
    IdMateria INTEGER NOT NULL,
    DNIDocente TEXT NOT NULL,
    CantHorasSemanales INTEGER NULL,
    PRIMARY KEY (IdCurso, IdMateria),
    FOREIGN KEY (IdCurso) REFERENCES Cursos(IdCurso),
    FOREIGN KEY (IdMateria) REFERENCES Materias(IdMateria),
    FOREIGN KEY (DNIDocente) REFERENCES Docentes(DNIDocente)
);

-- Horarios para CursoMateria
CREATE TABLE HorarioMateria (
    IdCurso TEXT NOT NULL,
    IdMateria INTEGER NOT NULL,
    DiaSemana TEXT NOT NULL,
    HoraInicio TEXT NOT NULL,
    HoraFin TEXT NOT NULL,
    IdAula INTEGER NULL,
    PRIMARY KEY (IdCurso, IdMateria, DiaSemana),
    FOREIGN KEY (IdCurso) REFERENCES Cursos(IdCurso),
    FOREIGN KEY (IdMateria) REFERENCES Materias(IdMateria)
);

-- Inscripciones
CREATE TABLE Inscripciones (
    IdInscripcion INTEGER PRIMARY KEY AUTOINCREMENT,
    DNIAlumno TEXT NOT NULL,
    IdEspecialidad INTEGER NULL,
    Nivel TEXT NOT NULL,
    Grado INTEGER NOT NULL,
    Turno TEXT NOT NULL,
    FechaInscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    Estado TEXT DEFAULT 'pendiente',
    FOREIGN KEY (DNIAlumno) REFERENCES Alumnos(DNIAlumno)
);

-- Documentación asociada a solicitudes
CREATE TABLE DocumentacionInscripciones (
    IdDocumento INTEGER PRIMARY KEY AUTOINCREMENT,
    Descripcion TEXT NOT NULL,
    IdInscripcion INTEGER NOT NULL,
    NombreArchivo TEXT NOT NULL,
    TipoMime TEXT NULL,
    Archivo BLOB NULL,
    RutaArchivo TEXT NULL,
    FechaSubida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdInscripcion) REFERENCES Solicitudes(IdSolicitud)
);

-- Asistencias
CREATE TABLE Asistencias (
    IdAsistencia INTEGER PRIMARY KEY AUTOINCREMENT,
    IdCurso TEXT NOT NULL,
    Fecha DATE NOT NULL,
    IdMateria INTEGER NOT NULL,
    Observaciones TEXT NULL,
    FOREIGN KEY (IdCurso) REFERENCES Cursos(IdCurso),
    FOREIGN KEY (IdMateria) REFERENCES Materias(IdMateria)
);

CREATE TABLE DetalleAsistencia (
    IdAsistencia INTEGER NOT NULL,
    DNIAlumno TEXT NOT NULL,
    Presente INTEGER NOT NULL,
    FOREIGN KEY (DNIAlumno) REFERENCES Alumnos(DNIAlumno),
    FOREIGN KEY (IdAsistencia) REFERENCES Asistencias(IdAsistencia)
);

-- Boletines
CREATE TABLE Boletines (
    IdBoletin INTEGER PRIMARY KEY AUTOINCREMENT,
    DNIAlumno TEXT NOT NULL,
    Promedio REAL NULL,
    FechaGeneracion DATETIME DEFAULT CURRENT_TIMESTAMP,
    Observaciones TEXT NULL,
    FOREIGN KEY (DNIAlumno) REFERENCES Alumnos(DNI)
);

CREATE TABLE BoletinDetalle (
    IdBoletin INTEGER NOT NULL,
    IdMateria INTEGER NOT NULL,
    Nivel INTEGER NOT NULL,
    NotaTrimestral1 REAL NULL,
    NotaTrimestral2 REAL NULL,
    NotaTrimestral3 REAL NULL,
    NotaFinal REAL NULL,
    PRIMARY KEY (IdBoletin, IdMateria),
    FOREIGN KEY (IdBoletin) REFERENCES Boletines(IdBoletin),
    FOREIGN KEY (IdMateria) REFERENCES Materias(IdMateria)
);

CREATE TABLE Usuarios (
    IdUsuario TEXT PRIMARY KEY NOT NULL,
    NombreUsuario TEXT NOT NULL,
    Pass TEXT NOT NULL,
    Tipo TEXT NOT NULL       -- Padre, docente, estudiante, directivo
);

CREATE TABLE Mensajes (
    IdMensaje INTEGER PRIMARY KEY AUTOINCREMENT,
    Emisor INTEGER NOT NULL,      -- IdUsuario
    Receptor INTEGER NOT NULL,    -- IdUsuario
    Contenido TEXT NOT NULL,
    FechaEnvio DATETIME DEFAULT CURRENT_TIMESTAMP,
    Leido BOOLEAN DEFAULT 0,
    FOREIGN KEY (Emisor) REFERENCES Usuarios(IdUsuario),
    FOREIGN KEY (Receptor) REFERENCES Usuarios(IdUsuario)
);

CREATE TABLE Eventos (
    IdEvento INTEGER PRIMARY KEY AUTOINCREMENT,
    Titulo TEXT NOT NULL,
    Descripcion TEXT NULL,
    FechaInicio DATETIME NOT NULL,
    FechaFin DATETIME NULL,
    IdUsuario TEXT NOT NULL,   -- IdUsuario del docente que creó el evento
    IdCurso TEXT NOT NULL,
    FOREIGN KEY (IdCurso) REFERENCES Cursos(IdCurso),
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

CREATE TABLE EventosCursos (
    IdCurso TEXT NOT NULL,
    IdEvento INTEGER NOT NULL,
    PRIMARY KEY (IdCurso, IdEvento),
    FOREIGN KEY (IdCurso) REFERENCES Cursos(IdCurso),
    FOREIGN KEY (IdEvento) REFERENCES Eventos(IdEvento)
);

CREATE TABLE Notificaciones (
    IdNotificacion INTEGER PRIMARY KEY AUTOINCREMENT,
    IdUsuario INTEGER NOT NULL,   -- receptor
    Mensaje TEXT NOT NULL,
    Leida BOOLEAN DEFAULT 0,
    Fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    Tipo TEXT NOT NULL,           -- 'Evento', 'Mensaje', 'Difusion'
    IdReferencia INTEGER NULL,    -- IdEvento o IdMensaje
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

CREATE TABLE DifusionCurso (
    IdDifusion INTEGER PRIMARY KEY AUTOINCREMENT,
    IdCurso TEXT NOT NULL,
    IdUsuario INTEGER NOT NULL,   -- IdUsuario del docente
    Contenido TEXT NOT NULL,
    FechaEnvio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdCurso) REFERENCES Cursos(IdCurso),
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

