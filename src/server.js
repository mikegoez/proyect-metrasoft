require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Inicialización
const app = express();

// Configuración de rutas absolutas
const publicPath = path.join(__dirname, '../public');
const htmlPath = path.join(publicPath, 'HTML');

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
const authMiddleware = require('./middlewares/auth');

// 1. Ruta raíz redirige a login
app.get('/', redirigirSiAutenticado, (req, res) => {
  res.redirect('/HTML/login.html');
});

// 2. Rutas públicas (login, registro, recuperación)
const rutasPublicas = [
  '/HTML/login.html',
  '/HTML/register.html',
  '/HTML/reset-password.html'
];

rutasPublicas.forEach(ruta => {
  app.get(ruta, redirigirSiAutenticado, (req, res) => {
    res.sendFile(path.join(publicPath, ruta));
  });
});

// 3. Rutas protegidas (todas las demás HTML)
app.get('/HTML/*', autenticarUsuario, (req, res) => {
  const requestedFile = req.path.replace('/HTML/', '');
  const allowedFiles = [
    'index.html',
    'conductores.html',
    'vehiculos.html',
    'despachos.html',
    'notificaciones.html'
  ];
  
  if (allowedFiles.includes(requestedFile)) {
    res.sendFile(path.join(htmlPath, requestedFile));
  } else {
    res.status(404).sendFile(path.join(htmlPath, '404.html'));
  }
});

// 4. Rutas API
const authRoutes = require('./routes/authRoutes');
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const conductoresRoutes = require('./routes/conductoresRoutes');
const despachosRoutes = require('./routes/despachosRoutes');
const notificacionesRoutes = require('./routes/notificacionesRoutes');

app.use("/api/auth", authRoutes);
app.use('/api/vehiculos', autenticarUsuario, vehiculosRoutes);
app.use('/api/conductores', autenticarUsuario, conductoresRoutes);
app.use('/api/despachos', autenticarUsuario, despachosRoutes);
app.use('/api/notificaciones', authMiddleware.autenticarUsuario, notificacionesRoutes);

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
  Ruta pública: ${publicPath}
  Login: ${process.env.FRONTEND_URL || 'http://localhost:' + PORT}/HTML/login.html
  ====================================
  `);
});