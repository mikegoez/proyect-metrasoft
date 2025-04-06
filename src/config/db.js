const mysql = require("mysql2/promise");
require("dotenv").config(); // Asegúrate de cargar las variables de entorno

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Usa la contraseña de .env
  database: process.env.DB_NAME, // Nombre de la BD desde .env
});

module.exports = pool;