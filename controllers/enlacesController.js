const Enlaces = require('../models/enlaces');
const shorid = require('shortid');
const bcrypt = require('bcrypt');
const {validationResult} = require("express-validator");

exports.nuevoEnlace = async(req,res,next) =>{

    //Revisar si hay errores
        // Revisar si hay errores
        const errores = validationResult(req);
        if(!errores.isEmpty()) {
            return res.status(400).json({errores: errores.array()});
        }



    //crear objeto de enlace
    const {nombre_original,password} = req.body;

    const enlace = new Enlaces();
    enlace.url = shorid.generate();
    enlace.nombre = shorid.generate();
    enlace.nombre_original =nombre_original;
    

    //ver si usuario esta autenticado
    if(req.usuario){
        const {password,descargar} =req.body;
        //asignar al enlace una cantidad de descagas
        if(descargar){
            enlace.descargar = descargar;
        }
        //asignar pass 
        if(password){
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password,salt);
        }
        //asignar el autor
        enlace.autor = req.usuario.id;
    }
    
    console.log(req.usuario)
    //almacenar en BD
        try {
            await enlace.save();
            return res.json({msg:`${enlace.url}`});
            next();
        } catch (error) {
            console.log(error);
        }

    
}