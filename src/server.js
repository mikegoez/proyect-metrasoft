require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// 1. Inicialización
const app = express();

// 2. Middlewares (usando TUS dependencias exactas)
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 3. Rate limiting (con tu versión de express-rate-limit)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Demasiadas solicitudes desde esta IP"
});
app.use("/api/", limiter);

// 4. Conexión a MySQL (mysql2 como lo tienes)
const pool = require("./config/db");

// Verificación de conexión
pool.getConnection()
  .then(conn => {
    console.log("✅ Conexión a MySQL establecida");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Error en MySQL:", err.message);
    process.exit(1);
  });

// 5. Inyectar conexión a DB en las rutas (para tus controladores existentes)
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// 6. Archivos estáticos (manteniendo tu estructura de carpetas)
app.use(express.static(path.join(__dirname, "../public")));

// 7. Rutas API (TODAS TUS RUTAS ACTUALES SIN MODIFICAR) ================

// 7.1 Auth Routes (las que ya tienes en authRoutes.js)
const authRoutes = require('./routes/authRoutes');
app.use("/api/auth", authRoutes);

// 7.2 Rutas protegidas (con tu middleware de autenticación actual)
const autenticarUsuario = require('./middlewares/auth');

// Vehículos (ejemplo - manteniendo tus rutas exactas)
const vehiculosRoutes = require('./routes/vehiculosRoutes');
app.use('/api/vehiculos', autenticarUsuario, vehiculosRoutes);

// Conductores (ejemplo - manteniendo tus rutas exactas)
const conductoresRoutes = require('./routes/conductoresRoutes');
app.use('/api/conductores', autenticarUsuario, conductoresRoutes);

// Despachos (ejemplo - manteniendo tus rutas exactas)
const despachosRoutes = require('./routes/despachosRoutes');
app.use('/api/despachos', autenticarUsuario, despachosRoutes);

// Notificaciones (ejemplo - manteniendo tus rutas exactas)
const notificacionesRoutes = require('./routes/notificacionesRoutes');
app.use('/api/notificaciones', autenticarUsuario, notificacionesRoutes);

// 8. Manejo de SPA para Railway (sin afectar tus APIs)
app.get(['/', '/login', '/register', '/reset-password', '/index', '/vehiculos', '/conductores', '/despachos', '/notificaciones'], (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/index.html"));
});

// 9. Manejo de errores (compatible con tus controladores)
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 10. Inicio del servidor (para Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ====================================
  🚀 Servidor funcionando en puerto ${PORT}
  🔗 Entorno: ${process.env.NODE_ENV || 'development'}
  📦 MySQL: ${process.env.DB_HOST}
  🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
  ====================================
  `);
});