//express
const express = require('express');
//express para rutas
const router = express.Router();
//controlador
const archivosController = require('../controllers/archivosController');
//middleware auth
const auth = require('../middleware/auth');



router.post('/',
    auth,
    archivosController.subirArchivo
);



module.exports = router;