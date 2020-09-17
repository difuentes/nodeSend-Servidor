//subida de archivo
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/enlaces');

//Subir Archivo
exports.subirArchivo = async(req,res,next  ) => {

    //configuracion multer
    const configuracionMulter = {
        limits : { fileSize: req.usuario ? 1024*1024*10 : 1024*1024 },
        storage : fileStorage = multer.diskStorage({
            destination: (req,file,cb) =>{
                cb(null , __dirname + '/../uploads')
            },
            filename: (res,file,cb) =>{
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length);
                cb(null,`${shortid.generate()}${extension}`)
            }/*Filttrar por pdf
            fileFilter : (res,file,db) => {
                    if(file.fileFilter ==="application/pdf"){
                        return cb(null,true)
                    }
            }
            */
        })
    }

    const upload = multer(configuracionMulter).single('archivo');

    upload(req,res, async (error) => {
        console.log(req.file);
        if(!error){
            res.json({archivo: req.file.filename});
        }
        else {
            console.log(error);
            return next();
        }
    }) 
} 
//eliminar archivos
exports.eliminarArchivo = async (res,req) =>{
    console.log(req.archivo);

    try {
            fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
            console.log("archivo eliminado")

    } catch (error) {
        console.log(error);
    }
}

//descargar Archivos
exports.descargar = async (req,res,next) =>{

    //obtener el enlace
    const {archivo} = req.params;
    const enlace = await Enlaces.findOne({nombre: archivo})


    const archivoDescargar = __dirname +'/../uploads/'+ archivo;
    res.download(archivoDescargar);

    //eliminar archivo y entrada de _BD
    //si las descargas son iguales a 1 -borrar la entrada y borrar el archivo
    const {descargar,nombre } = enlace 

    if(descargar === 1 ){
        //eliminar el archivo
        req.archivo = nombre;
        //eliminar entrada de BD
        await Enlaces.findOneAndDelete(enlace.id);

        next();

    }else{
        
        enlace.descargar--;
        await enlace.save();
         //si las descagas son mayores a 1 restar
        console.log("mas de uno");
    }
}