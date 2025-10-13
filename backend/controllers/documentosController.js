const db = require('../db/db');


const getDocumentosById = (req, res) => {
  const { IdInscripcion } = req.params;

  if (!IdInscripcion) {
    return res.status(400).json({ error: "Falta el parámetro idInscripcion en la URL" });
  }

  try {
    const documentos = db.prepare(`
      SELECT 
        IdDocumento, 
        Descripcion, 
        NombreArchivo, 
        TipoMime, 
        FechaSubida, 
        RutaArchivo
      FROM DocumentacionInscripciones
      WHERE IdInscripcion = ?
    `).all(IdInscripcion); 

    if (documentos.length === 0) {
      return res.status(200).json([]); 
    }

    return res.status(200).json(documentos);
  } catch (error) {
    console.error("❌ Error al obtener documentos:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getDocumentosById };

const getDocumentos = (req, res) => {

  try {
    const documentos = db.prepare(`
      SELECT *
      FROM DocumentacionInscripciones
    `).all();
    
    return res.status(200).json(documentos);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {getDocumentosById, getDocumentos}