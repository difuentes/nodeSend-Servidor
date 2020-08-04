//subida de archivo
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');


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


exports.eliminarArchivo = async (res,req) =>{
    console.log(req.archivo);

    try {
            fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
            console.log("archivo eliminado")

    } catch (error) {
        console.log(error);
    }
}