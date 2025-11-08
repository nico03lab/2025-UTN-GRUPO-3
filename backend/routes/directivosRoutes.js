const express = require('express');
const router = express.Router();
const {directivoController} = require('../controllers/directivoController');
//para obtener el user 
router.get('/:idUsuario', directivoController.getDirectivo);

//para la configuracion/actualziacion
router.get('/configuracion/:idUsuario',directivoController.getDirectivoCompleto);
router.put('/configuracion/:idUsuario', directivoController.updateDirectivo)

module.exports = router;
