// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Database = require("better-sqlite3");
const path = require("path");

// Conecta a la base de datos
const db = new Database(path.join(__dirname, "../db/sistema_escolar.db"));

const router = express.Router();

// Helpers

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_TTL = process.env.JWT_ACCESS_TTL || "15m";
const JWT_REFRESH_TTL = process.env.JWT_REFRESH_TTL || "7d";

console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET);
console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_TTL });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_TTL });
}

// Middleware: validar token de acceso
function authenticateJWT(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido o expirado" });
    req.user = user;
    next();
  });
}


// RUTAS

// Login
router.post("/login", async (req, res) => {
  const { nombreUsuario, pass } = req.body;
  if (!nombreUsuario || !pass)
    return res.status(400).json({ error: "Faltan datos" });

  try {
    const row = db
      .prepare("SELECT * FROM Usuarios WHERE NombreUsuario = ?")
      .get(nombreUsuario);

    if (!row) return res.status(401).json({ error: "Usuario no encontrado" });

    // Comparar contraseña hasheada
    const ok = await bcrypt.compare(pass, row.Pass);
    if (!ok) return res.status(401).json({ error: "Contraseña incorrecta" });

    // Armar payload básico
    const payload = {
      userId: row.IdUsuario,
      tipo: row.Tipo,
      nombre: row.NombreUsuario,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ userId: row.IdUsuario });

    // Setear cookie httpOnly con el refresh token
    res.cookie(process.env.COOKIE_REFRESH || "coleapp_refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true en producción con HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: "/auth",
    });

    res.json({ accessToken, user: payload });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Refresh accessToken
router.post("/refresh", (req, res) => {
  const token =
    req.cookies?.[process.env.COOKIE_REFRESH || "coleapp_refresh_token"];
  if (!token) return res.status(401).json({ error: "Sin token de refresh" });

  try {
    const { userId } = jwt.verify(token, JWT_REFRESH_SECRET);
    const row = db
      .prepare("SELECT IdUsuario, NombreUsuario, Tipo FROM Usuarios WHERE IdUsuario = ?")
      .get(userId);

    if (!row) return res.status(401).json({ error: "Usuario no encontrado" });

    const payload = {
      userId: row.IdUsuario,
      tipo: row.Tipo,
      nombre: row.NombreUsuario,
    };

    const newAccess = signAccessToken(payload);
    res.json({ accessToken: newAccess, user: payload });
  } catch (err) {
    console.error("Error en refresh:", err);
    res.status(401).json({ error: "Refresh inválido o expirado" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie(process.env.COOKIE_REFRESH || "coleapp_refresh_token", {
    path: "/api/auth",
  });
  res.json({ ok: true });
});

// Obtener usuario actual
router.get("/me", authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

// Exportar
module.exports = router;
