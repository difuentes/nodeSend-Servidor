const moongose = require('mongoose');
const Schema = moongose.Schema;


const enlaceSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    nombre_original:{
        type: String,
        required: true
    },
    descargar:{
        type: Number,
        default:1
    },
    autor:{
        type: moongose.Schema.Types.ObjectId ,
        ref: 'Usuarios',
        default: null
    },
    password:{
        type: String,
        default: null

    },
    creado:{
        type: Date,
        default: Date.now()
    }
});


module.exports = moongose.model('enlaces',enlaceSchema);