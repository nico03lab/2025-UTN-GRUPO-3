// hashPasswords.js
const bcrypt = require("bcrypt");
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "db/sistema_escolar.db"));

(async () => {
  const saltRounds = 10;

  // Obtener todos los usuarios
  const usuarios = db.prepare("SELECT IdUsuario, Pass FROM Usuarios").all();

  for (const u of usuarios) {
    const pass = u.Pass;
    if (!pass.startsWith("$2b$")) { // si no está hasheada
      const hash = await bcrypt.hash(pass, saltRounds);
      db.prepare("UPDATE Usuarios SET Pass = ? WHERE IdUsuario = ?").run(hash, u.IdUsuario);
      console.log(`🔐 Hasheada clave de ${u.IdUsuario}`);
    }
  }

  console.log("✅ Todas las contraseñas han sido hasheadas correctamente.");
})();
