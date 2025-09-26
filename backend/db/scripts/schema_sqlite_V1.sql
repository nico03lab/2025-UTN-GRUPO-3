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
    IdEspecialidad INTEGER NULL,
    AnioLectivo INTEGER NULL,
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
    DNI TEXT PRIMARY KEY,
    Apellido TEXT NOT NULL,
    Nombres TEXT NOT NULL,
    Calle TEXT NULL,
    Numero TEXT NULL,
    IdLocalidad INTEGER NULL,
    Telefono TEXT NULL,
    Email TEXT NULL,
    Estado TEXT NOT NULL DEFAULT 'activo',
    FechaAlta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FechaBaja DATETIME NULL,
    FOREIGN KEY (IdLocalidad) REFERENCES Localidades(IdLocalidad)
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
    FOREIGN KEY (IdLocalidad) REFERENCES Localidades(IdLocalidad)
);

-- Tabla relacional Alumno - Tutor
CREATE TABLE AlumnoTutor (
    DNIAlumno TEXT NOT NULL,
    DNITutor TEXT NOT NULL,
    Relacion TEXT NULL,
    FechaVinculo DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (DNIAlumno, DNITutor),
    FOREIGN KEY (DNIAlumno) REFERENCES Alumnos(DNI),
    FOREIGN KEY (DNITutor) REFERENCES Tutores(DNITutor)
);

-- Docentes
CREATE TABLE Docentes (
    DNIDocente TEXT PRIMARY KEY,
    Apellido TEXT NOT NULL,
    Nombre TEXT NOT NULL,
    Calle TEXT NULL,
    Numero TEXT NULL,
    IdLocalidad INTEGER NULL,
    TelefonoCel TEXT NULL,
    TelefonoLinea TEXT NULL,
    Email TEXT NULL,
    FOREIGN KEY (IdLocalidad) REFERENCES Localidades(IdLocalidad)
);

-- Materias
CREATE TABLE Materias (
    IdMateria INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL UNIQUE
);

-- Relación Curso <-> Materia
CREATE TABLE CursoMateria (
    IdCursoMateria INTEGER PRIMARY KEY AUTOINCREMENT,
    IdCurso TEXT NOT NULL,
    IdMateria INTEGER NOT NULL,
    CantHorasSemanales INTEGER NULL,
    FOREIGN KEY (IdCurso) REFERENCES Cursos(IdCurso),
    FOREIGN KEY (IdMateria) REFERENCES Materias(IdMateria)
);

-- Horarios para CursoMateria
CREATE TABLE CursoMateriaHorario (
    IdHorario INTEGER PRIMARY KEY AUTOINCREMENT,
    IdCursoMateria INTEGER NOT NULL,
    DiaSemana INTEGER NOT NULL,
    HoraInicio TEXT NOT NULL,
    HoraFin TEXT NOT NULL,
    IdAula INTEGER NULL,
    FOREIGN KEY (IdCursoMateria) REFERENCES CursoMateria(IdCursoMateria),
    FOREIGN KEY (IdAula) REFERENCES Aulas(NumAula)
);

-- Asignación de Docentes a CursoMateria
CREATE TABLE DocenteCursoMateria (
    IdDocenteCursoMateria INTEGER PRIMARY KEY AUTOINCREMENT,
    DNIDocente TEXT NOT NULL,
    IdCursoMateria INTEGER NOT NULL,
    Rol TEXT NULL,
    FOREIGN KEY (DNIDocente) REFERENCES Docentes(DNIDocente),
    FOREIGN KEY (IdCursoMateria) REFERENCES CursoMateria(IdCursoMateria)
);

-- Inscripciones
CREATE TABLE Inscripciones (
    IdInscripcion INTEGER PRIMARY KEY AUTOINCREMENT,
    DNIAlumno TEXT NOT NULL,
    IdCurso TEXT NOT NULL,
    FechaInscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    Estado TEXT DEFAULT 'pendiente',
    FOREIGN KEY (DNIAlumno) REFERENCES Alumnos(DNI),
    FOREIGN KEY (IdCurso) REFERENCES Cursos(IdCurso),
    UNIQUE (DNIAlumno, IdCurso)
);

-- Solicitudes
CREATE TABLE Solicitudes (
    IdSolicitud INTEGER PRIMARY KEY AUTOINCREMENT,
    DNIAlumno TEXT NOT NULL,
    FechaSolicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    TipoSolicitud TEXT NULL,
    Estado TEXT DEFAULT 'pendiente',
    Observaciones TEXT NULL,
    FOREIGN KEY (DNIAlumno) REFERENCES Alumnos(DNI)
);

-- Documentación asociada a solicitudes
CREATE TABLE DocumentacionSolicitudes (
    IdDocumento INTEGER PRIMARY KEY AUTOINCREMENT,
    IdSolicitud INTEGER NOT NULL,
    NombreArchivo TEXT NOT NULL,
    TipoMime TEXT NULL,
    Archivo BLOB NULL,
    RutaArchivo TEXT NULL,
    FechaSubida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdSolicitud) REFERENCES Solicitudes(IdSolicitud)
);

-- Asistencias
CREATE TABLE Asistencias (
    IdAsistencia INTEGER PRIMARY KEY AUTOINCREMENT,
    DNIAlumno TEXT NOT NULL,
    IdCurso TEXT NOT NULL,
    Fecha DATE NOT NULL,
    Presente INTEGER NOT NULL, -- 0 = false, 1 = true
    DNIDocente TEXT NULL,
    Observaciones TEXT NULL,
    FOREIGN KEY (DNIAlumno) REFERENCES Alumnos(DNI),
    FOREIGN KEY (IdCurso) REFERENCES Cursos(IdCurso),
    FOREIGN KEY (DNIDocente) REFERENCES Docentes(DNIDocente),
    UNIQUE (DNIAlumno, IdCurso, Fecha)
);

-- Boletines
CREATE TABLE Boletines (
    IdBoletin INTEGER PRIMARY KEY AUTOINCREMENT,
    DNIAlumno TEXT NOT NULL,
    AnioLectivo INTEGER NOT NULL,
    FechaGeneracion DATETIME DEFAULT CURRENT_TIMESTAMP,
    Observaciones TEXT NULL,
    FOREIGN KEY (DNIAlumno) REFERENCES Alumnos(DNI)
);

CREATE TABLE BoletinDetalle (
    IdBoletinDetalle INTEGER PRIMARY KEY AUTOINCREMENT,
    IdBoletin INTEGER NOT NULL,
    IdMateria INTEGER NOT NULL,
    NotaTrimestral1 REAL NULL,
    NotaTrimestral2 REAL NULL,
    NotaTrimestral3 REAL NULL,
    NotaFinal REAL NULL,
    FOREIGN KEY (IdBoletin) REFERENCES Boletines(IdBoletin),
    FOREIGN KEY (IdMateria) REFERENCES Materias(IdMateria)
);

-- Notificaciones
CREATE TABLE Notificaciones (
    IdNotificacion INTEGER PRIMARY KEY AUTOINCREMENT,
    DNIAlumno TEXT NULL,
    IdCurso TEXT NULL,
    Titulo TEXT NULL,
    Mensaje TEXT NOT NULL,
    FechaEnvio DATETIME DEFAULT CURRENT_TIMESTAMP,
    Leida INTEGER DEFAULT 0, -- 0 = false, 1 = true
    FOREIGN KEY (DNIAlumno) REFERENCES Alumnos(DNI),
    FOREIGN KEY (IdCurso) REFERENCES Cursos(IdCurso)
);

-- Índices
CREATE INDEX IX_Inscripciones_Curso ON Inscripciones (IdCurso);
CREATE INDEX IX_Asistencias_Curso_Fecha ON Asistencias (IdCurso, Fecha);
CREATE INDEX IX_Asistencias_Alumno_Fecha ON Asistencias (DNIAlumno, Fecha);
CREATE INDEX IX_AlumnoTutor_Alumno ON AlumnoTutor (DNIAlumno);
CREATE INDEX IX_DocenteCursoMateria_Docente ON DocenteCursoMateria (DNIDocente);

-- Vistas (SQLite soporta vistas de forma similar)
CREATE VIEW vw_AlumnosPorCurso AS
SELECT a.DNI, a.Apellido, a.Nombres, i.IdCurso, i.Estado, i.FechaInscripcion
FROM Alumnos a
JOIN Inscripciones i ON a.DNI = i.DNIAlumno;

CREATE VIEW vw_AsistenciasPorCursoFecha AS
SELECT IdCurso, Fecha, COUNT(*) AS CantRegs, 
       SUM(CASE WHEN Presente = 1 THEN 1 ELSE 0 END) AS CantPresentes
FROM Asistencias
GROUP BY IdCurso, Fecha;