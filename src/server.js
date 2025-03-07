const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

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

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Backend de MetraSoft funcionando!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

const userRoutes = require('./routes/userRoutes');
app.use('/usuarios', userRoutes);