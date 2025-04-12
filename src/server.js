const express = require("express");
const app = express();
require('dotenv').config();
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');

//importar rutas modulos
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const conductoresRoutes = require('./routes/conductoresRoutes');
const despachosRoutes = require('./routes/despachosRoutes');
const notificacionesRouter = require('./routes/notificaciones');

app.use(cors({
  origin: 'http://localhost:3000', // Ajusta a tu URL del frontend
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());
app.use(cookieParser());

// Usar el middleware
const autenticarUsuario = require('./middlewares/auth');
app.use('/api/notificaciones', autenticarUsuario);

// Middleware para archivos estáticos (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, "../public")));


// Rutas API
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/conductores', conductoresRoutes);
app.use('/api/despachos', despachosRoutes);
app.use('/api/notificaciones', notificacionesRouter);

require('./services/notificacionesScheduler');

// Redirección al login si no autenticado
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/login.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));