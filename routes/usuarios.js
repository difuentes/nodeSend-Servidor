const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController')
const {check} = require('express-validator');


router.post('/',
    //arreglo con validaciones
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('email','Agrega un correo valido').isEmail(),
        check('password','contraseña debe ser mayor a 8').isLength({min:8})
    ],
    usuarioController.nuevoUsuario
);


module.exports = router;