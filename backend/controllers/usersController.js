const db = require("../db/db");

// Obtener todos los usuarios
const getUsuarios = (req, res) => {
  try {
    const sql = `SELECT IdUsuario, NombreUsuario, Tipo FROM Usuarios`;
    const rows = db.prepare(sql).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un usuario por ID
const getUsuarioById = (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT IdUsuario, NombreUsuario, Tipo FROM Usuarios WHERE IdUsuario = ?`;
    const row = db.prepare(sql).get(id);
    if (!row) return res.status(404).json({ error: "Usuario no encontrado." });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear usuario
const createUsuario = (req, res) => {
  try {
    const { idUsuario, nombreUsuario, pass, tipo } = req.body;
    if (!idUsuario || !nombreUsuario || !pass || !tipo) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const sql = `INSERT INTO Usuarios (IdUsuario, NombreUsuario, Pass, Tipo)
                 VALUES (?, ?, ?, ?)`;
    db.prepare(sql).run(idUsuario, nombreUsuario, pass, tipo); // 👈 .run()
    res.status(201).json({ message: "Usuario creado.", id: idUsuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUsuarioInterno = (idUsuario, nombreUsuario, pass, tipo) =>{
  const sql = `INSERT INTO Usuarios (IdUsuario, NombreUsuario, Pass, Tipo)
                VALUES (?, ?, ?, ?)`;
  db.prepare(sql).run(idUsuario, nombreUsuario, pass, tipo); 
}

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  createUsuarioInterno
};