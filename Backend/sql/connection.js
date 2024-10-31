const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env['HOST_DB']||'localhost', // Cambia a tu host de base de datos
    user: process.env['USER_DB']||'root',   // Cambia a tu usuario de base de datos
    password: process.env['PASSWORD_DB']||'12345678', // Cambia a tu contraseña
    database: process.env['DATABASE_DB']||'test', // Cambia a tu nombre de base de datos
    port: process.env['PORT_DB']||3306,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones en el pool
    queueLimit: 0
});

module.exports = pool.promise();
