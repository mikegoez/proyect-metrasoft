const mysql = require('mysql2');

// Configuración de la conexión
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'metrasoft',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar la conexión
pool.execute('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión exitosa. Resultado de la consulta:', results);
    }
    pool.end(); // Cerrar el pool de conexiones
});