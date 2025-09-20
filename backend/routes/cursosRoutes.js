const express = require('express');
const { getCursos } = require('../controllers/cursosController');
const router = express.Router();

router.get('/', getCursos);

module.exports = router;
