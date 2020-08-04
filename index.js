const express = require('express');
const conectarDB = require('./config/db.js');

//conectar DB_mongo
conectarDB();

//crear servidor 
const app = express();

//asignar puerto dispo si no encuentra por defecto 
const port = process.env.PORT || 4060;
//habilitar leer los valores del body
app.use(express.json());

//rutas de la app
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/enlaces',require('./routes/enlaces'));
//arrancar la app

app.listen(port,'0.0.0.0' ,()=>{
    console.log(`entra con el puerto ${port}`);
})