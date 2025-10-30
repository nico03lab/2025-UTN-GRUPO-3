const express = require('express');
const router = express.Router();
const { LocalidadesModel} = require('../controllers/localidadController');

router.get('/provincias', LocalidadesModel.getProvincias);
router.get('/:provincia', LocalidadesModel.getLocalidades );
router.get('/info/:idLocalidad', LocalidadesModel.getLocalidadEspecifica);

module.exports = router;
