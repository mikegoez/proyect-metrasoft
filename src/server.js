process.on('uncaughtException', (err) => {
  console.error('⚠️ Error no capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('⚠️ Promesa rechazada no manejada:', err);
});

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authMiddleware = require('./middlewares/auth'); // <- Mover aquí

// Inicialización
const app = express();
app.set('trust proxy', 1);

// ================== CONFIGURACIONES INICIALES ==================
const publicPath = path.resolve(__dirname, '../public');
const htmlPath = path.join(publicPath, 'HTML');

// ================== MIDDLEWARES GLOBALES ==================
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  exposedHeaders: ['Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      "connect-src": ["'self'", process.env.FRONTEND_URL]
    },
  }
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ================== MIDDLEWARE DE REDIRECCIÓN GLOBAL ==================
app.get('*', authMiddleware.redirigirSiAutenticado); // <- Aplica a TODAS las rutas primero

// ================== ARCHIVOS ESTÁTICOS CON CONFIGURACIÓN ESPECÍFICA ==================

app.use('/assets', express.static(path.join(publicPath, 'assets')));

app.use('/CSS', express.static(path.join(publicPath, 'CSS'), (req, res, next) => {
  res.type('text/css');
  next();
}));

app.use('/JS', express.static(path.join(publicPath, 'JS'), (req, res, next) => {
  res.type('application/javascript');
  next();
}));


// ================== RUTAS ESPECÍFICAS ==================
// 1. Ruta raíz principal
app.get('/', (req, res) => {
  res.redirect('/HTML/login.html');
});

// 2. Rutas públicas
const rutasPublicas = [
  '/HTML/login.html',
  '/HTML/register.html',
  '/HTML/reset-password.html'
];

rutasPublicas.forEach(ruta => {
  app.get(ruta, (req, res) => {
    res.sendFile(path.join(publicPath, ruta));
  });
});

// 3. Rutas protegidas
const allowedFiles = [
  'index.html',
  'conductores.html',
  'vehiculos.html',
  'despachos.html',
  'notificaciones.html'
];

app.get('/HTML/*', authMiddleware.autenticarUsuario, (req, res) => {
  const requestedFile = req.path.replace('/HTML/', '');
  allowedFiles.includes(requestedFile) 
    ? res.sendFile(path.join(htmlPath, requestedFile))
    : res.redirect('/HTML/login.html');
});

// ================== CONFIGURACIÓN DE API ==================
const authRoutes = require('./routes/authRoutes');
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const conductoresRoutes = require('./routes/conductoresRoutes');
const despachosRoutes = require('./routes/despachosRoutes');
const notificacionesRoutes = require('./routes/notificacionesRoutes');

app.use("/api/auth", authRoutes);
app.use('/api/vehiculos', authMiddleware.autenticarUsuario, vehiculosRoutes);
app.use('/api/conductores', authMiddleware.autenticarUsuario, conductoresRoutes);
app.use('/api/despachos', authMiddleware.autenticarUsuario, despachosRoutes);
app.use('/api/notificaciones', authMiddleware.autenticarUsuario, notificacionesRoutes);

// ================== MANEJO DE ERRORES ==================
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ 
    error: "Error interno del servidor",
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// ================== INICIO DEL SERVIDOR ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
    ====================================
    🚀 Servidor Metrasoft iniciado
    ====================================
    Entorno: ${process.env.NODE_ENV || 'development'}
    Puerto: ${PORT}
    Ruta pública: ${publicPath}
    Login: ${process.env.FRONTEND_URL || 'http://localhost:' + PORT}/HTML/login.html
    ====================================
  `);
});