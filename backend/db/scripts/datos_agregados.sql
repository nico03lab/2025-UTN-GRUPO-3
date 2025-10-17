-- =====================================================
-- 🧾 BOLETINES CON NOTAS TRUNCADAS A DOS DECIMALES
-- =====================================================

-- 🧹 Limpieza opcional
DELETE FROM BoletinDetalle;
DELETE FROM Boletines;
DELETE FROM sqlite_sequence WHERE name IN ('BoletinDetalle','Boletines');

--------------------------------------------------------
-- 📘 Alumno 1: 51000000
--------------------------------------------------------

INSERT INTO Boletines (DNIAlumno, Promedio, Observaciones)
VALUES ('51000000', NULL, 'Excelente rendimiento general. Participativo y constante.');

-- IdBoletin = 1
INSERT INTO BoletinDetalle (IdBoletin, IdMateria, Nivel, NotaTrimestral1, NotaTrimestral2, NotaTrimestral3, NotaFinal)
VALUES
  (1, 1, 1, 8, 9, 8, (CAST(((8 + 9 + 8) / 3.0 * 100) AS INTEGER) / 100.0)),     -- Matemática → 8.33 truncado
  (1, 2, 1, 7, 8, 8, (CAST(((7 + 8 + 8) / 3.0 * 100) AS INTEGER) / 100.0)),     -- Lengua → 7.66 truncado
  (1, 3, 1, 9, 9, 10, (CAST(((9 + 9 + 10) / 3.0 * 100) AS INTEGER) / 100.0)),   -- Ciencias → 9.33 truncado
  (1, 4, 1, 6, 7, 6, (CAST(((6 + 7 + 6) / 3.0 * 100) AS INTEGER) / 100.0));     -- Historia → 6.33 truncado

-- Promedio general (redondeado a 1 decimal)
UPDATE Boletines
SET Promedio = ROUND((
  SELECT AVG(NotaFinal)
  FROM BoletinDetalle
  WHERE IdBoletin = 1
), 1)
WHERE IdBoletin = 1;


--------------------------------------------------------
-- 📘 Alumno 2: 50000012
--------------------------------------------------------

INSERT INTO Boletines (DNIAlumno, Promedio, Observaciones)
VALUES ('50000012', NULL, 'Debe reforzar algunas áreas, pero muestra progreso.');

-- IdBoletin = 2
INSERT INTO BoletinDetalle (IdBoletin, IdMateria, Nivel, NotaTrimestral1, NotaTrimestral2, NotaTrimestral3, NotaFinal)
VALUES
  (2, 1, 1, 4, 6, 7, (CAST(((4 + 6 + 7) / 3.0 * 100) AS INTEGER) / 100.0)),     -- Matemática → 5.66 truncado
  (2, 2, 1, 8, 8, 9, (CAST(((8 + 8 + 9) / 3.0 * 100) AS INTEGER) / 100.0)),     -- Lengua → 8.33 truncado
  (2, 3, 1, 5, 6, 6, (CAST(((5 + 6 + 6) / 3.0 * 100) AS INTEGER) / 100.0)),     -- Ciencias → 5.66 truncado
  (2, 4, 1, 7, 6, 6, (CAST(((7 + 6 + 6) / 3.0 * 100) AS INTEGER) / 100.0));     -- Historia → 6.33 truncado

-- Promedio general (redondeado a 1 decimal)
UPDATE Boletines
SET Promedio = ROUND((
  SELECT AVG(NotaFinal)
  FROM BoletinDetalle
  WHERE IdBoletin = 2
), 1)
WHERE IdBoletin = 2;









-- =====================================================
-- EVENTOS Y NOTIFICACIONES PARA LOS CURSOS Y ALUMNOS
-- =====================================================

--Limpieza opcional (solo para testing)
DELETE FROM EventosCursos;
DELETE FROM EventosUsuarios;
DELETE FROM Eventos;
DELETE FROM Notificaciones;
DELETE FROM sqlite_sequence WHERE name IN ('Eventos','Notificaciones');


-- DOCENTES / DIRECTIVOS REFERENCIADOS

-- Aseguramos docentes válidos para las FK:
INSERT OR IGNORE INTO Usuarios (IdUsuario, NombreUsuario, Pass, Tipo)
VALUES
('DOC-001', 'Profesor de Matemática', '1234', 'docente'),
('DOC-002', 'Profesor de Lengua', '1234', 'docente'),
('DIR-001', 'Directora General', '1234', 'directivo');


-- EVENTOS POR CURSO


-- Curso 1C-SEC: alumna destacada (51000000)
INSERT INTO Eventos (Titulo, Descripcion, FechaInicio, FechaFin, IdUsuarioCreador, Tipo, Alcance)
VALUES
('Examen de Matematica', 'Evaluación trimestral de Matematica', '2025-10-20 08:00:00', '2025-10-20 09:30:00', 'DOC-001', 'Examen', 'Curso'),
('Reunión de Padres', 'Encuentro informativo sobre desempeño del curso', '2025-10-29 18:00:00', '2025-10-29 19:00:00', 'DIR-001', 'Reunión', 'Curso');

-- Asociaciones con el curso
INSERT INTO EventosCursos (IdCurso, IdEvento)
VALUES
('2C-SEC', 1),
('2C-SEC', 2);


-- Curso 1A-SEC: alumno que necesita reforzar (50000012)
INSERT INTO Eventos (Titulo, Descripcion, FechaInicio, FechaFin, IdUsuarioCreador, Tipo, Alcance)
VALUES
('Examen de Lengua', 'Evaluación de redacción y comprensión lectora', '2025-10-23 09:00:00', '2025-10-23 10:30:00', 'DOC-002', 'Examen', 'Curso'),
('Charla Motivacional', 'Actividad para reforzar hábitos de estudio', '2025-10-30 11:00:00', '2025-10-30 12:00:00', 'DIR-001', 'Evento', 'Curso');

INSERT INTO EventosCursos (IdCurso, IdEvento)
VALUES
('1A-SEC', 3),
('1A-SEC', 4);


-- EVENTO INDIVIDUAL (ALCANCE = 'Alumno')

-- Competencia de Matemática solo para la alumna destacada
INSERT INTO Eventos (Titulo, Descripcion, FechaInicio, FechaFin, IdUsuarioCreador, Tipo, Alcance)
VALUES
('Competencia de Matemática', 'Participación en olimpiadas regionales de Matemática', '2025-11-10 08:00:00', '2025-11-10 13:00:00', 'DOC-001', 'Evento', 'Alumno');

-- Asociar individualmente (su IdUsuario)
INSERT INTO EventosUsuarios (IdEvento, IdUsuario)
SELECT 5, u.IdUsuario
FROM Alumnos a
JOIN Usuarios u ON u.IdUsuario = a.IdUsuario
WHERE a.DNIAlumno = '51000000';

-- NOTIFICACIONES AUTOMÁTICAS

-- Notificaciones por eventos de curso
INSERT INTO Notificaciones (IdUsuario, Mensaje, Tipo, IdReferencia)
SELECT a.IdUsuario,
       'Nuevo evento para tu curso: ' || e.Titulo,
       'Evento',
       e.IdEvento
FROM Eventos e
JOIN EventosCursos ec ON e.IdEvento = ec.IdEvento
JOIN Alumnos a ON a.IdCurso = ec.IdCurso
WHERE e.Alcance = 'Curso';

-- Notificación individual
INSERT INTO Notificaciones (IdUsuario, Mensaje, Tipo, IdReferencia)
SELECT a.IdUsuario,
       'Has sido seleccionada para participar en: ' || e.Titulo,
       'Evento',
       e.IdEvento
FROM Eventos e
JOIN EventosUsuarios eu ON eu.IdEvento = e.IdEvento
JOIN Alumnos a ON a.IdUsuario = eu.IdUsuario
WHERE e.Alcance = 'Alumno';


-------------------------------------------------
-- NOTIFICACIONES BASE (1 registro por evento)---
-------------------------------------------------

INSERT INTO Notificaciones (Mensaje, Tipo, IdReferencia) VALUES
('Nuevo evento para tu curso: Examen de Matemática', 'Evento', 1),
('Nuevo evento para tu curso: Reunión de Padres', 'Evento', 2),
('Nuevo evento para tu curso: Examen de Lengua', 'Evento', 3),
('Nuevo evento para tu curso: Charla Motivacional', 'Evento', 4),
('Has sido seleccionada para participar en: Competencia de Matemática', 'Evento', 5);

-- ASOCIACIONES: ALUMNOS Y TUTOR

-- Alumno est-013
INSERT INTO NotificacionesUsuarios (IdNotificacion, IdUsuario)
VALUES
(1, 'est-013'),
(2, 'est-013');

-- Alumna est-001
INSERT INTO NotificacionesUsuarios (IdNotificacion, IdUsuario)
VALUES
(3, 'est-001'),
(4, 'est-001'),
(5, 'est-001');

-- Tutor tut-001 (recibe todas las de sus hijos)
INSERT INTO NotificacionesUsuarios (IdNotificacion, IdUsuario)
VALUES
(1, 'tut-001'),
(2, 'tut-001'),
(3, 'tut-001'),
(4, 'tut-001'),
(5, 'tut-001');

INSERT INTO Asistencias (IdCurso, Fecha, IdMateria, Observaciones)
VALUES
('1A-SEC', '2025-10-17', 1, NULL),
('1A-SEC', '2025-10-17', 4, NULL),
('1A-SEC', '2025-10-17', 1, NULL);

INSERT INTO DetalleAsistencia (IdAsistencia, DNIAlumno, Presente)
VALUES
(1, '51000000', 0),
(2, '51000000', 0),
(3, '51000000', 0);
