const express = require("express");
const app = express();
require('dotenv').config(); //carga avriables de entorno
const cors = require("cors"); //manejar cors
const path = require("path"); // manejo de rutras de archivo
const cookieParser = require('cookie-parser'); // para manejar cookies

//importar rutas modulos
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const conductoresRoutes = require('./routes/conductoresRoutes');
const despachosRoutes = require('./routes/despachosRoutes');
const notificacionesRouter = require('./routes/notificaciones');
//configuracion de corsc para desarrollo 
app.use(cors({
  origin: 'http://localhost:3000', // dominio permitido
  credentials: true, // permitir enviar cookies
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'] //cabeceras permitidas
}));

app.use(express.json()); //parsear bodies JSON
app.use(cookieParser()); //middleware para cookies

// middelwares de autentificacion para notificaciones
const autenticarUsuario = require('./middlewares/auth');
app.use('/api/notificaciones', autenticarUsuario);

// srvir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../public")));


// configuracion rutas API
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/conductores', conductoresRoutes);
app.use('/api/despachos', despachosRoutes);
app.use('/api/notificaciones', notificacionesRouter);

//programador de tareas para notificaciones
require('./services/notificacionesScheduler');

// ruta catch all para spa
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/login.html"));
});
//iniciar servidor 
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));