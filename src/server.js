const express = require("express");
const app = express();
require('dotenv').config();
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');

// ======================
// 1. Configuración Base
// ======================
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// ======================
// 2. Base de Datos
// ======================
const pool = require('./config/db');
app.use((req, res, next) => {
  req.db = pool; // Inyecta la conexión para que los controladores la usen
  next();
});

// ======================
// 3. Archivos Estáticos
// ======================
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/login.html"));
});

// ======================
// 4. Rutas → Controladores
// ======================
// Importamos las rutas (que ya apuntan a tus controladores)
const authRoutes = require('./routes/authRoutes');
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const conductoresRoutes = require('./routes/conductoresRoutes');
const despachosRoutes = require('./routes/despachosRoutes');
const notificacionesRoutes = require('./routes/notificaciones');

// Middleware de autenticación (ajusta la ruta según tu archivo)
const autenticarUsuario = require('./middlewares/auth');

// Montamos las rutas exactamente como las tienes
app.use("/api/auth", authRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/conductores', conductoresRoutes);
app.use('/api/despachos', despachosRoutes);
app.use('/api/notificaciones', autenticarUsuario, notificacionesRoutes);

// ======================
// 5. Tareas Programadas
// ======================
require('./services/notificacionesScheduler');

// ======================
// 6. Manejo de Producción (Para Railway)
// ======================
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.redirect("/");
  });
}

// ======================
// 7. Inicio del Servidor
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor conectado a ${process.env.DB_HOST}`);
  console.log(`📡 Escuchando en puerto ${PORT}`);
});