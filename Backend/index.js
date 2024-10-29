const express = require('express')
const cors = require('cors')
const compression = require('compression')
require('dotenv').config({path: __dirname+'/.env'});
const PORT = 3002;
const APP = express();
APP.use(compression());
APP.use(express.urlencoded({extended:false}));
APP.use(express.json());

APP.listen(PORT, ()=>{
    console.log("Servidor en el puerto: " + PORT);
})