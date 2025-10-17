const express = require('express');

const { getUsuarios, getUsuarioById, createUsuario } = require('../controllers/usersController');
const router = express.Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario)

module.exports = router;
