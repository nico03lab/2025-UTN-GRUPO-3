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

module.exports = {getLocalidadByNombre, createLocalidad};