const Usuario = require('../models/Usuario');
//paquete para encriptar pass
const bcryp = require('bcrypt');
//validacion de resultados
const {validationResult} = require('express-validator');

exports.nuevoUsuario = async (req,res) =>{

    //mostrar mensajes de error de express validator

    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return  res.status(400).json({errores: errores.array()})
    }
    
    //verificar si usuario existe 
    const {email,password} = req.body;
    let usuario = await Usuario.findOne({email});

    if(usuario){
        return res.status(400).json({msg:'El usuario ingresado ya existe'});
    }

    usuario = new Usuario(req.body);

    //hashear el pass
    const salt = await bcryp.genSalt(10);
    usuario.password = await bcryp.hash(password,salt);

    //guardar usuario 
    await usuario.save();
    
    res.json({msg:'usuario ingresado'});
}