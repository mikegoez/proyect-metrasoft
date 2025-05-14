require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// 1. Inicialización
const app = express();

// 2. Configuración de rutas absolutas (CRUCIAL PARA RAILWAY)
const __dirname = path.resolve();
const publicPath = path.join(__dirname, 'public');
const routesPath = path.join(__dirname, 'src', 'routes');

// 3. Middlewares (EXACTAMENTE como los tienes)
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 4. Rate limiting (Tu configuración exacta)
app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Demasiadas solicitudes desde esta IP"
}));

// 5. Conexión a MySQL (Tu configuración exacta)
const pool = require("./config/db");

// Verificación de conexión mejorada
pool.getConnection()
  .then(conn => {
    console.log("✅ Conexión a MySQL establecida");
    console.log(`📊 Host: ${conn.config.host}`);
    console.log(`📦 Base de datos: ${conn.config.database}`);
    conn.release();
  })
  .catch(err => {
    console.error("❌ Error en MySQL:", err.message);
    console.error("ℹ️ Verifica tus variables de entorno DB_*");
    process.exit(1);
  });

app.use((req, res, next) => {
  req.db = pool;
  next();
});

// 6. Archivos estáticos (Ruta absoluta para Railway)
app.use(express.static(publicPath));

// 7. Importación DINÁMICA de rutas (Solución definitiva)
const loadRoute = (routeName) => {
  try {
    return require(path.join(routesPath, routeName));
  } catch (err) {
    console.error(`⚠️ Advertencia: Ruta ${routeName} no encontrada, pero el servidor continuará`);
    return null;
  }
};

// 8. Registro de rutas (TODAS las que tienes)
const routes = {
  authRoutes: loadRoute('authRoutes'),
  vehiculosRoutes: loadRoute('vehiculosRoutes'),
  conductoresRoutes: loadRoute('conductoresRoutes'),
  despachosRoutes: loadRoute('despachosRoutes'),
  notificacionesRoutes: loadRoute('notificacionesRoutes')
};

// 9. Configuración de rutas con verificación
const autenticarUsuario = require('./middlewares/auth');

if (routes.authRoutes) app.use("/api/auth", routes.authRoutes);
if (routes.vehiculosRoutes) app.use('/api/vehiculos', autenticarUsuario, routes.vehiculosRoutes);
if (routes.conductoresRoutes) app.use('/api/conductores', autenticarUsuario, routes.conductoresRoutes);
if (routes.despachosRoutes) app.use('/api/despachos', autenticarUsuario, routes.despachosRoutes);
if (routes.notificacionesRoutes) app.use('/api/notificaciones', autenticarUsuario, routes.notificacionesRoutes);

// 10. Manejo de SPA (Rutas absolutas)
const spaPaths = ['/', '/login', '/register', '/reset-password', '/index'];
spaPaths.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(publicPath, 'HTML', 'index.html'));
  });
});

// 11. Manejo de errores mejorado
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ 
    error: "Error interno del servidor",
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 12. Inicio del servidor con validación
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ====================================
  🚀 Servidor Metrasoft iniciado
  ====================================
  Entorno: ${process.env.NODE_ENV || 'development'}
  Puerto: ${PORT}
  MySQL: ${process.env.DB_HOST || 'localhost'}
  Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
  ====================================
  Rutas cargadas:
  - Auth: ${!!routes.authRoutes}
  - Vehículos: ${!!routes.vehiculosRoutes}
  - Conductores: ${!!routes.conductoresRoutes}
  - Despachos: ${!!routes.despachosRoutes}
  - Notificaciones: ${!!routes.notificacionesRoutes}
  ====================================
  `);
});