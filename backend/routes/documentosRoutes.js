const express = require('express');
const { getDocumentosById, getDocumentos } = require('../controllers/documentosController');
const router = express.Router();

router.get('/', getDocumentos)
router.get('/:IdInscripcion',getDocumentosById)

module.exports = router;