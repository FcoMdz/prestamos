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
        return hashedContasena;
    }catch(err){
        console.log(err);
    }
}

const revContrasena = async (contrasena, usuario) => {
    q = `SELECT contrasena FROM Empleado WHERE usuario = ?;`;
    const data = await pool.query(q,[usuario]);
    var band = false;
    var hashedContasena = data[0][0].contrasena;
    await bcrypt.compare(contrasena, hashedContasena).then((result) => {
        band=result;
    });
    return band;
}


const revContrasenaUsuario = async (contrasena, correo) => {
    q = `SELECT contrasena FROM Usuario WHERE correo = ?;`;
    const data = await pool.query(q,[correo]);
    var band = false;
    var hashedContasena = data[0][0].contrasena;
    await bcrypt.compare(contrasena, hashedContasena).then((result) => {
        band=result;
    });
    return band;
}

APP.post('/api/post/empleado',
    [
        body('nombre').not().isEmpty().isAlpha(),
        body('usuario').not().isEmpty().isAlpha(),
        body('contrasena').not().isEmpty()
    ],
    async (req,res)=>{
        try{
            let body = req.body;
            let contrasena = await genContrasena(body.contrasena)
            q = `INSERT INTO Empleado VALUES (NULL,?,?,?);`
            const data = await pool.query(q, [body.nombre, body.usuario, contrasena]);
            res.send({success:true, message: 'Empleado creado con éxito'})
        }catch(err){
            res.send({success: false, message: err})
        }
    }
)

APP.post('/api/post/login/empleado',
    [
        body('usuario').not().isEmpty().isAlpha(),
        body('contrasena').not().isEmpty()
    ],
    async (req,res)=>{
        try{
            let body = req.body;
            let comprobacion = await revContrasena(body.contrasena, body.usuario);
            if(comprobacion){
                q = `SELECT * FROM Empleado WHERE usuario = ?;`;
                const data = await pool.query(q,[body.usuario]);
                res.send({success:true, message: 'Inicio de sesión correcto', data: data[0][0]})
            }else{
                res.send({success:false, message: 'Usuario o contraseña incorrecta'})
            }
            
        }catch(err){
            res.send({success: false, message: err})
        }
    }
)


APP.post('/api/post/login/usuario',
    [
        body('correo').not().isEmpty().isAlpha(),
        body('contrasena').not().isEmpty()
    ],
    async (req,res)=>{
        try{
            let body = req.body;
            let comprobacion = await revContrasenaUsuario(body.contrasena, body.correo);
            if(comprobacion){
                q = `SELECT * FROM Usuario WHERE correo = ?;`;
                const data = await pool.query(q,[body.correo]);
                res.send({success:true, message: 'Inicio de sesión correcto', data: data[0][0]})
            }else{
                res.send({success:false, message: 'Correo o contraseña incorrecta'})
            }
            
        }catch(err){
            res.send({success: false, message: err})
        }
    }
)


APP.post('/api/post/prestamo',
    [
        body('usuario_empleado').not().isEmpty().isAlpha(),
        body('contrasena').not().isEmpty(),
        body('usuario_cliente').not().isEmpty(),
        body('monto').not().isEmpty(),
        body('meses').not().isEmpty().isNumeric(),
        body('interes').not().isEmpty().isNumeric()
    ],
    async (req,res)=>{
        const conexion = await pool.getConnection();
       
        try{
            let body = req.body;
            let comprobacion = await revContrasena(body.contrasena, body.usuario_empleado);
            if(comprobacion){
                
                await conexion.beginTransaction()
                q = `SELECT * FROM Empleado WHERE usuario = ?;`;
                let empleado = await conexion.query(q,[body.usuario_empleado]);
                q = `INSERT INTO Solicitud VALUES (NULL,?,?,?,?,?,?,?);`
                let date = new Date();
                let formatDate = date.toISOString()
                formatDate = formatDate.split('T')[0]
                let prestamo = await conexion.query(q, [body.monto, body.meses, body.interes, formatDate, null, false, empleado[0][0].idempleado]);
                let idPrestamo = prestamo[0].insertId;
                q = `INSERT INTO usuario_solicitud VALUES (?,?)`;
                let solicitud = await conexion.query(q, [idPrestamo, body.usuario_cliente]);
                await conexion.commit();
                res.send({success:true, message: 'Solicitud creada con éxito'})
            }else{
                res.send({success:false, message: 'Usuario incorrecto, acceda al sistema para poder crear solicitudes'})
            }
        }catch(err){
            conexion.release();
            res.send({success: false, message: err})
        }
    }
)

APP.post('/api/post/arpovar/prestamo',
    [
        body('usuario_empleado').not().isEmpty().isAlpha(),
        body('contrasena').not().isEmpty(),
        body('id_solicitud').not().isEmpty()
    ],
    async (req,res)=>{
        const conexion = await pool.getConnection();
       
        try{
            let body = req.body;
            let comprobacion = await revContrasena(body.contrasena, body.usuario_empleado);
            if(comprobacion){
                
                await conexion.beginTransaction()
                q = `SELECT * FROM Empleado WHERE usuario = ?;`;
                let empleado = await conexion.query(q,[body.usuario_empleado]);
                q = `UPDATE Solicitud SET aprovado=TRUE, fecha_aprovado=? WHERE idsolicitud = ?`
                let date = new Date();
                let formatDate = date.toISOString()
                formatDate = formatDate.split('T')[0]
                let prestamo = await conexion.query(q, [formatDate, body.id_solicitud]);
                await conexion.commit();
                res.send({success:true, message: 'Solicitud aprovada con éxito'})
            }else{
                res.send({success:false, message: 'Usuario incorrecto, acceda al sistema para poder crear solicitudes'})
            }
        }catch(err){
            conexion.release();
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
    try{
        const data = await pool.query('SELECT * FROM Estado');
        res.send({success:true, message: "Datos recuperados con éxito", data: data[0]})
    }catch(err){
        res.send({success:false, message: "Datos recuperados con éxito", data: err})
    }
    
})

APP.get('/api/get/municipio',async (req,res)=>{
    try{
        const data = await pool.query('SELECT * FROM Municipio');
        res.send({success:true, message: "Datos recuperados con éxito", data: data[0]})
    }catch(err){
        res.send({success:false, message: "Datos recuperados con éxito", data: err})
    }
})

APP.get('/api/get/pais',async (req,res)=>{
    try{
        const data = await pool.query('SELECT * FROM Pais');
        res.send({success:true, message: "Datos recuperados con éxito", data: data[0]})
    }catch(err){
        res.send({success:false, message: "Datos recuperados con éxito", data: err})
    }
})

APP.post('/api/post/solicitudes',
    [
        body('correo').not().isEmpty(),
        body('contrasena').not().isEmpty()
    ]
    ,async (req,res)=>{
    try{
        let body = req.body;
        let comprobacion = await revContrasenaUsuario(body.contrasena, body.correo);
        if(comprobacion){
            q = `SELECT * FROM Usuario WHERE correo = ?;`;
            let usuario = await pool.query(q,[body.correo]);
            const data = await pool.query('SELECT S.* FROM Solicitud S, usuario_solicitud US WHERE US.usuario_idusuario=? and S.idsolicitud=US.solicitud_idsolicitud',[usuario[0][0].idusuario]);
            res.send({success:true, message: "Datos recuperados con éxito", data: data[0]})
        }
    }catch(err){
        res.send({success:false, message: "Datos recuperados con éxito", data: err})
    }
})


APP.listen(PORT, ()=>{
    console.log("Servidor en el puerto: " + PORT);
})