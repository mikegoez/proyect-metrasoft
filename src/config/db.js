const mysql = require('mysql2');

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',      // Dirección del servidor de MySQL
  user: 'root',           // Usuario de MySQL
  password: 'mike',       // Contraseña de MySQL
  database: 'metrasoft',  // Nombre de la base de datos
  waitForConnections: true, // Esperar si no hay conexiones disponibles
  connectionLimit: 10,    // Límite de conexiones en el pool
  queueLimit: 0           // Límite de solicitudes en cola (0 = sin límite)
});

// Manejo de errores en el pool
pool.on('error', (err) => {
  console.error('Error en el pool de conexiones:', err);
});

// Exportar el pool para su uso en otros archivos
module.exports = pool.promise(); // Usamos .promise() para soportar async/await