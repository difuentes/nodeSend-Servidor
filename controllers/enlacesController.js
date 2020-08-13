const Enlaces = require('../models/enlaces');
const shorid = require('shortid');
const bcrypt = require('bcrypt');
const {validationResult} = require("express-validator");

//nuevo enlace
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
        
        //console.log(req.params.url)
        const {url } = req.params;

        //verificar si existe el enlace 

        const enlace = await Enlaces.findOne({ url} );

        if(!enlace){
            res.status(404).json({msg:'este enlace no existe'});
            return next();
        }

        //si enlace existe 
        res.json({archivo: enlace.nombre ,password:false})

        next(); 
}

//retorna si enlace tiene pass
exports.tienePass = async (req,res,next) =>{

    const {url } = req.params;

        //verificar si existe el enlace 

    const enlace = await Enlaces.findOne({ url} );

    if(!enlace){
        res.status(404).json({msg:'este enlace no existe'});
        return next();
    }

    if(enlace.password){
        return res.json({password :true,enlace: enlace.url})
    }

    next();
}

//traer todos los Enlaces
exports.todosEnlaces = async(req,res,next)=>{

    try {
        const enlaces = await Enlaces.find({}).select('url -_id');
        res.json({enlaces});

    } catch (error) {
        console.log(error)
    }
}


//verifica si el password es el correcta
exports.verificarPassword = async (req,res,next)=>{

    const {url } = req.params;
    const {password } = req.body;

    //consultar por el enlace 
    const enlace = await Enlaces.findOne({url});

    //verificar el password
    if(bcrypt.compareSync(password,enlace.password)){
        //descargar el archivo
            next();
    }
    else{
        return res.status(400).json({msg:'Password incorrecto'})
    }
    
    

}