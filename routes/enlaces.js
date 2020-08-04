const express = require('express');
//libreria rutas
const router = express.Router();
//instancia controlador 
const enlacesController = require('../controllers/enlacesController');
const archivosController = require('../controllers/archivosController');
//libreria validaciones
const {check} = require('express-validator');
//instancia de middleware
const auth = require('../middleware/auth');

router.post('/',
    [
        check('nombre', 'sube un archivo').not().isEmpty(),
        check('nombre_original', 'sube un archivo original').not().isEmpty()
    ],
    auth,
    enlacesController.nuevoEnlace

);


router.get('/:url',
    enlacesController.obtenerEnlace,
    archivosController.eliminarArchivo
);

module.exports = router;