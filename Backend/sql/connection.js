const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env['HOST_DB']||'localhost', // Cambia a tu host de base de datos
    user: process.env['USER_DB']||'root',   // Cambia a tu usuario de base de datos
    password: process.env['PASSWORD_DB']||'12345678', // Cambia a tu contraseña
    database: process.env['DATABASE_DB']||'test', // Cambia a tu nombre de base de datos
    port: process.env['PORT_DB']||3306,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones en el pool
    queueLimit: 0,
    "typeCast": function castField( field, useDefaultTypeCasting ) {

        // We only want to cast bit fields that have a single-bit in them. If the field
        // has more than one bit, then we cannot assume it is supposed to be a Boolean.
        if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

            var bytes = field.buffer();

            // A Buffer in Node represents a collection of 8-bit unsigned integers.
            // Therefore, our single "bit field" comes back as the bits '0000 0001',
            // which is equivalent to the number 1.
            return( bytes[ 0 ] === 1 );

        }

        return( useDefaultTypeCasting() );
    }
});

module.exports = pool.promise();
