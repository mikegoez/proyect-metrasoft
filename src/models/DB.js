const mysql = require('mysql2');

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',      // Dirección del servidor de MySQL
  user: 'root',           // Usuario de MySQL
  password: 'mike88', // Contraseña de MySQL
  database: 'metrasoft'   // Nombre de la base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;