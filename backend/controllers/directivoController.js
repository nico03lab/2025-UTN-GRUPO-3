const db = require("../db/db");

const directivoController = {
  //obtener datos por el user
  getDirectivo: async (req, res) => {
    try {
      const { idUsuario } = req.params;
      console.log("📩 getDirectivo() llamado con idUsuario:", idUsuario);

      const directivo = db
        .prepare(
          `
          SELECT 
            IdUsuario,
            DNIDirectivo,
            Nombre,
            Apellido,
            Email,
            Cargo
          FROM Directivo
          WHERE IdUsuario = ?
        `
        )
        .get(idUsuario);

      console.log("📦 Resultado query:", directivo);

      if (!directivo) {
        console.log("⚠️ No se encontró el directivo con ese ID");
        return res
          .status(404)
          .json({ success: false, message: "No encontrado" });
      }

      // Agregamos este log para ver qué exactamente se envía al frontend:
      console.log("🚀 Enviando respuesta JSON:", {
        success: true,
        data: directivo,
      });

      return res.json({
        success: true,
        data: directivo,
      });
    } catch (error) {
      console.error("❌ Error en getDirectivo:", error);
      res.status(500).json({ success: false, message: "Error interno" });
    }
  },

  //obtener datos para la modificacion
  getDirectivoCompleto: async (req, res) => {
    try {
      const { idUsuario } = req.params; // Si viene del token o del parámetro
      console.log("Cargando directivo para la modificaion: ", idUsuario);
      const directivo = await db
        .prepare(
          `
            SELECT 
                d.DNIDirectivo,
                d.Cargo,
                d.Apellido,
                d.Nombre,
                d.Calle,
                d.Numero,
                d.IdLocalidad,
                l.Nombre as Localidad,
                l.Provincia, 
                d.TelefonoCel,
                d.TelefonoLinea,
                d.Email,
                u.NombreUsuario,
                u.Pass
            FROM Directivo d 
            LEFT JOIN Localidades l ON d.IdLocalidad = l.IdLocalidad
            JOIN Usuarios u ON d.IdUsuario = u.IdUsuario
            WHERE d.IdUsuario = ?
            `
        )
        .get(idUsuario);
      console.log("Datos", directivo);
      res.json({
        success: true,
        data: directivo,
      });
    } catch (error) {
      console.error("Error obteniendo al directivo:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener al directivo",
      });
    }
  },

  updateDirectivo: async (req, res) => {
    try {
      const { idUsuario } = req.params;
      console.log("Actualizar directivo: ", idUsuario);
      const {
        Apellido,
        Nombre,
        Cargo,
        Email,
        TelefonoCel,
        TelefonoLinea,
        Calle,
        Numero,
        IdLocalidad,
        NombreUsuario,
        Pass,
      } = req.body;

      const stmt = db.prepare(`
                UPDATE Directivo
                SET Apellido = ?,
                    Nombre = ?,
                    Cargo = ?,
                    Email = ?,
                    TelefonoCel = ?,
                    TelefonoLinea = ?,
                    Calle = ?,
                    Numero = ?,
                    IdLocalidad = ?
                WHERE IdUsuario = ?
            `);

      const result = stmt.run(
        Apellido,
        Nombre,
        Cargo,
        Email,
        TelefonoCel,
        TelefonoLinea,
        Calle,
        Numero,
        IdLocalidad,
        idUsuario
      );

      // Si se proporciona una nueva contraseña, actualizarla
      if (Pass || NombreUsuario) {
        const bcrypt = require('bcrypt');
        if (Pass && NombreUsuario) {
            // Actualizar ambos
            const hashedPassword = await bcrypt.hash(Pass, 10);
            const updateStmt = db.prepare(`
                UPDATE Usuarios 
                SET NombreUsuario = ?, Pass = ?
                WHERE IdUsuario = ?
            `);
            updateStmt.run(NombreUsuario, hashedPassword, idUsuario);
            console.log('Usuario y contraseña actualizados');
            
        } else if (Pass) {
            // Solo contraseña
            const hashedPassword = await bcrypt.hash(Pass, 10);
            const updateStmt = db.prepare(`
                UPDATE Usuarios 
                SET Pass = ?
                WHERE IdUsuario = ?
            `);
            updateStmt.run(hashedPassword, idUsuario);
            console.log('Contraseña actualizada');
            
        } else if (NombreUsuario) {
            // Solo nombre de usuario
            const updateStmt = db.prepare(`
                UPDATE Usuarios 
                SET NombreUsuario = ?
                WHERE IdUsuario = ?
            `);
            updateStmt.run(NombreUsuario, idUsuario);
            console.log('Nombre de usuario actualizado');
        }
      }

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message: "Directivo no encontrado",
        });
      }

      res.json({
        success: true,
        message: "Directivo actualizado correctamente",
      });
    } catch (error) {
      console.error("Error actualizando Directivo:", error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar Directivo",
      });
    }
  },
};

module.exports = { directivoController };
