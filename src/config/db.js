const mysql = require("mysql2/promise"); //importar al driver MySQL con soporte para promesas
require("dotenv").config(); //carga variables de entorno desde el archivo .env

//crea un pool de conexiones a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST, //servidor de la base de datos
  user: process.env.DB_USER, //usuario de la base de datos
  password: process.env.DB_PASSWORD, //contraseña de usuario
  database: process.env.DB_NAME, //nombre de la base de datos
  waitForConnections: true, //mantiene  en cola las solicitudes cuando se alcanza el limite
  connectionLimit: 10, //maximo de conexiones simultaneas
  queueLimit: 0, //limite ilimitado de solicitudes en cola (0 = sin limites )
});

module.exports = pool;