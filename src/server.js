require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Inicialización
const app = express();

// Configuración de rutas
const projectRoot = path.join(__dirname, '..');
const publicPath = path.join(projectRoot, 'public');
const routesPath = path.join(projectRoot, 'src', 'routes');
const middlewaresPath = path.join(projectRoot, 'src', 'middlewares');

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Demasiadas solicitudes desde esta IP"
}));

// Conexión a MySQL
const pool = require("./config/db");
pool.getConnection()
  .then(conn => {
    console.log("✅ Conexión a MySQL establecida");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Error en MySQL:", err.message);
    process.exit(1);
  });

app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Archivos estáticos
app.use(express.static(publicPath));

// Middleware de autenticación
const autenticarUsuario = require(path.join(middlewaresPath, 'auth'));

// 1. Redirección raíz a login - NUEVO
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// 2. Configuración de rutas SPA - MODIFICADO
const spaPaths = [
  '/login',
  '/register',
  '/reset-password'
];

spaPaths.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(publicPath, 'HTML', 'index.html'));
  });
});

// 3. Ruta para index (protegida) - NUEVO
app.get('/index', autenticarUsuario, (req, res) => {
  res.sendFile(path.join(publicPath, 'HTML', 'index.html'));
});

// Carga de rutas API
const loadRoute = (routeName) => {
  try {
    return require(path.join(routesPath, routeName));
  } catch (err) {
    console.warn(`⚠️ Ruta ${routeName} no encontrada`);
    return null;
  }
};

// Rutas API
const routes = {
  authRoutes: loadRoute('authRoutes'),
  vehiculosRoutes: loadRoute('vehiculosRoutes'),
  conductoresRoutes: loadRoute('conductoresRoutes'),
  despachosRoutes: loadRoute('despachosRoutes'),
  notificacionesRoutes: loadRoute('notificacionesRoutes')
};

if (routes.authRoutes) app.use("/api/auth", routes.authRoutes);
if (routes.vehiculosRoutes) app.use('/api/vehiculos', autenticarUsuario, routes.vehiculosRoutes);
if (routes.conductoresRoutes) app.use('/api/conductores', autenticarUsuario, routes.conductoresRoutes);
if (routes.despachosRoutes) app.use('/api/despachos', autenticarUsuario, routes.despachosRoutes);
if (routes.notificacionesRoutes) app.use('/api/notificaciones', autenticarUsuario, routes.notificacionesRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ 
    error: "Error interno del servidor",
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ====================================
  🚀 Servidor Metrasoft iniciado
  ====================================
  Entorno: ${process.env.NODE_ENV || 'development'}
  Puerto: ${PORT}
  Login: ${process.env.FRONTEND_URL || 'http://localhost:' + PORT}/login
  ====================================
  `);
});