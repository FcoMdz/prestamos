const express = require('express');
const cors = require('cors');
const compression = require('compression');
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcrypt');

require('dotenv').config({path: __dirname+'/.env'});

const pool = require('./sql/connection');
const PORT = 3002;
const APP = express();
APP.use(compression());
APP.use(express.urlencoded({extended:false}));
APP.use(express.json());

const genContrasena = async (contrasena) => {
    const saltRounds = 15;
    try{
        const hashedContasena = await bcrypt.hash(contrasena,saltRounds);
        console.log(hashedContasena)
        return hashedContasena;
    }catch(err){
        console.log(err);
    }
}

const revContrasena = async (contrasena, usuario) => {
    q = `SELECT contrasena FROM Empleado WHERE usuario = ?;`;
    const data = await pool.query(q,[usuario]);
    var band = false;
    var hashedContasena = data[0].contrasena;
    await bcrypt.compare(contrasena, hashedContasena).then((result) => {
        band=result;
    });
    return band;
}

APP.post('/api/post/empleado',
    [
        body('nombre').not().isEmpty().isAlpha(),
        body('usuario').not().isEmpty().isAlpha(),
        body('contrasena').not().isEmail()
    ],
    async (req,res)=>{
        try{
            let body = req.body;
            let contrasena = await genContrasena(body.contrasena)
            console.log(contrasena)
            q = `INSERT INTO Empleado VALUES (NULL,?,?,?);`
            const data = await pool.query(q, [body.nombre, body.usuario, contrasena]);
            res.send({success:true, message: 'Empleado creado con éxito'})
        }catch(err){
            res.send({success: false, message: err})
        }
    }
)

APP.post('/api/post/usuario',
    [
        body('nombre').not().isEmpty().isAlpha(),
        body('apellidomaterno').not().isEmpty().isAlpha(),
        body('apellidopaterno').not().isEmpty().isAlpha(),
        body('telefono').not().isEmpty().isAlpha(),
        body('correo').not().isEmpty().isEmail(),
        body('contrasena').not().isEmail(),
        body('calle').not().isEmpty(),
        body('cp').not().isEmpty(),
        body('noint'),
        body('noext').not().isEmpty(),
        body('colonia').not().isEmpty(),
        body('idmunicipio').not().isEmpty()
    ],
    async (req,res)=>{
        const conexion = await pool.getConnection();
        try{
            let body = req.body;
            let contrasena = await genContrasena(body.contrasena)
            console.log(contrasena)
            await conexion.beginTransaction()
            q = `INSERT INTO Usuario VALUES (NULL,?,?,?,?,?,?);`
            let usuario = await conexion.query(q, [body.nombre, body.apellidomaterno, body.apellidopaterno, contrasena, body.telefono, body.correo]);
            let idUsuario = usuario[0].insertId;
            q = `INSERT INTO Direccion VALUES (NULL, ?,?,?,?,?,?)`;
            let domicilio = await conexion.query(q, [body.calle, body.cp, body.noint, body.noext, body.colonia, body.idmunicipio])
            let idDomicilio = domicilio[0].insertId;
            q = `INSERT INTO usuario_direccion VALUES (?,?)`;
            let usuario_direccion = await conexion.query(q, [idUsuario, idDomicilio]);
            await conexion.commit();
            res.send({success:true, message: 'Usuario creado con éxito'})
        }catch(err){
            conexion.release();
            res.send({success: false, message: err})
        }
    }
)


APP.get('/api/get/estados',async (req,res)=>{
    const data = await pool.query('SELECT * FROM Estado');
    res.send(data[0])
})

APP.get('/api/get/municipio',async (req,res)=>{
    const data = await pool.query('SELECT * FROM Municipio');
    res.send(data[0])
})

APP.get('/api/get/pais',async (req,res)=>{
    const data = await pool.query('SELECT * FROM Pais');
    res.send(data[0])
})

APP.get('/api/get/solicitud',async (req,res)=>{
    const data = await pool.query('SELECT * FROM Solicitud');
    res.send(data[0])
})


APP.listen(PORT, ()=>{
    console.log("Servidor en el puerto: " + PORT);
})