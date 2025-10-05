const fs = require('fs'); 
const multer = require('multer');
const path = require('path');
// Crear carpeta si no existe
const uploadDir = 'uploads/';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Opción: Guardar en disco Y en base de datos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Formato: DNI_tipoDoc_timestamp.extension
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const uniqueName = `${file.fieldname}_${timestamp}${ext}`;
    cb(null, uniqueName);
  }
});

// Filtrar tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF, JPG, JPEG o PNG'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
  fileFilter: fileFilter
});

module.exports = upload;