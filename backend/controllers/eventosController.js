const db = require('../db/db'); // tu conexión SQLite

const getEventos = (req, res) => {
    const sql = `SELECT * FROM Eventos ORDER BY Fecha DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

const getEventosPorCurso = (req, res) => {
    const { idCurso } = req.params;
    const sql = `SELECT * FROM Eventos WHERE IdCurso = ? ORDER BY Fecha DESC`;
    db.all(sql, [idCurso], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

const getEventosPorTutor = (req, res) => {
    const { dniTutor } = req.params;
    const sql = `
        SELECT e.*
        FROM Eventos e
        JOIN Cursos c ON e.IdCurso = c.IdCurso
        JOIN Inscripciones i ON i.IdCurso = c.IdCurso
        JOIN AlumnoTutor at ON at.DNIAlumno = i.DNIAlumno
        WHERE at.DNITutor = ?
        ORDER BY e.Fecha DESC
    `;
    db.all(sql, [dniTutor], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

module.exports = { getEventos, getEventosPorCurso, getEventosPorTutor };
