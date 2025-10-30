const db = require("../db/db");

const getLocalidadByNombre = (nombre, provincia) => {
  return db.prepare('SELECT * FROM Localidades WHERE Nombre = ? AND Provincia= ?').get(nombre, provincia);
}

const createLocalidad = (localidad, provincia) =>{
    if (!localidad || !provincia) throw new Error("Nombre y provincia son obligatorios");

    const stmtLocalidad = db.prepare('INSERT INTO Localidades (Nombre, Provincia) VALUES (?,?)');
    const result = stmtLocalidad.run(localidad, provincia);
    return result.lastInsertRowid;
};

const LocalidadesModel = {
  getProvincias: async (req,res) => {
    try {
      const provincias = db.prepare(`
        SELECT DISTINCT Provincia 
        FROM Localidades 
        ORDER BY Provincia
      `).all();
      res.json(provincias.map(p => p.Provincia));
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtener provincias' });
    }
  },

  getLocalidades: async (req, res)=>{
    try {
      const {provincia} = req.params;
      const localidades = db.prepare(`
        SELECT IdLocalidad, Nombre, Provincia
        FROM Localidades 
        WHERE Provincia = ?
        ORDER BY Nombre
      `).all(provincia);
      res.json(localidades);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error al obtener localidades' });
    }

  },
  // Obtener info de una localidad específica (para saber su provincia)
  getLocalidadEspecifica: async (req, res) =>{
    try {
      const { idLocalidad } = req.params;
    
      const localidad = db.prepare(`
        SELECT IdLocalidad, Nombre, Provincia
        FROM Localidades 
        WHERE IdLocalidad = ?
      `).get(idLocalidad);
      
      if (!localidad) {
        return res.status(404).json({ error: 'Localidad no encontrada' });
      }
      
      res.json(localidad);
    } catch (error) {
      console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener localidad' });
    }
  }
}


module.exports = {getLocalidadByNombre, createLocalidad, LocalidadesModel};