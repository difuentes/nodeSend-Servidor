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
    const {nombre_original,nombre} = req.body;

    const enlace = new Enlaces();
    enlace.url = shorid.generate();
    enlace.nombre = nombre;
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


//obtener el enlace 

exports.obtenerEnlace =  async(req,res,next)=> {
        
        console.log(req.params.url)
        const {url } = req.params;

        //verificar si existe el enlace 

        const enlace = await Enlaces.findOne({ url} );

        if(!enlace){
            res.status(404).json({msg:'este enlace no existe'});
            return next();
        }

        //si enlace existe 
        res.json({archivo: enlace.nombre})

        //si las descargas son iguales a 1 -borrar la entrada y borrar el archivo
        const {descargar,nombre }= enlace 


        if(descargar === 1 ){
            //eliminar el archivo
            req.archivo = nombre;
            //eliminar entrada de BD
            await Enlaces.findOneAndDelete(req.params.url);

            next();

        }else{
            enlace.descargar--;
            await enlace.save();
             //si las descagas son mayores a 1 restar
            console.log("mas de uno");
        }

       
        
}