require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Inicialización
const app = express();
app.set('trust proxy', 1); 

// ==============================================
// CONFIGURACIÓN DE RUTAS (VERSIÓN CORREGIDA)
// ==============================================
const publicPath = path.resolve(__dirname, 'public');
const htmlPath = path.join(publicPath, 'HTML');

// Verificación de rutas (para diagnóstico)
console.log('=== Rutas configuradas ===');
console.log('Directorio actual:', __dirname);
console.log('Ruta pública:', publicPath);
console.log('Ruta HTML:', htmlPath);
console.log('==========================');

// ==============================================
// MIDDLEWARES BÁSICOS
// ==============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  exposedHeaders: ['Authorization']
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"]
    }
  }
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ==============================================
// RATE LIMITING
// ==============================================
app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Demasiadas solicitudes desde esta IP",
  trustProxy: true
}));

// ==============================================
// CONEXIÓN A BASE DE DATOS
// ==============================================
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

// ==============================================
// ARCHIVOS ESTÁTICOS (CONFIGURACIÓN CORREGIDA)
// ==============================================
const staticOptions = {
  maxAge: '1y',
  etag: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  },
  fallthrough: false,
  index: false
};

app.use(express.static(publicPath, staticOptions));

// Manejo de errores para archivos estáticos
app.use((req, res, next) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(htmlPath, '404.html'));
  } else {
    next();
  }
});

// ==============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ==============================================
const authMiddleware = require('./middlewares/auth');

// ==============================================
// RUTAS DE LA APLICACIÓN
// ==============================================

// 1. Redirección raíz
app.get('/', authMiddleware.redirigirSiAutenticado, (req, res) => {
  res.redirect('/HTML/login.html');
});

// 2. Rutas públicas
const rutasPublicas = [
  '/HTML/login.html',
  '/HTML/register.html',
  '/HTML/reset-password.html'
];

rutasPublicas.forEach(ruta => {
  app.get(ruta, authMiddleware.redirigirSiAutenticado, (req, res) => {
    const filePath = path.join(htmlPath, ruta.split('/HTML/')[1]);
    console.log(`Intentando servir archivo: ${filePath}`); // Para diagnóstico
    res.sendFile(filePath);
  });
});

// 3. Rutas protegidas
const archivosPermitidos = [
  'index.html',
  'conductores.html',
  'vehiculos.html',
  'despachos.html',
  'notificaciones.html'
];

app.get('/HTML/*', authMiddleware.autenticarUsuario, (req, res) => {
  const archivoSolicitado = req.path.split('/HTML/')[1];
  
  if (archivosPermitidos.includes(archivoSolicitado)) {
    const rutaCompleta = path.join(htmlPath, archivoSolicitado);
    console.log(`Sirviendo archivo protegido: ${rutaCompleta}`); // Para diagnóstico
    res.sendFile(rutaCompleta);
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
app.use('/api/vehiculos', authMiddleware.autenticarUsuario, vehiculosRoutes);
app.use('/api/conductores', authMiddleware.autenticarUsuario, conductoresRoutes);
app.use('/api/despachos', authMiddleware.autenticarUsuario, despachosRoutes);
app.use('/api/notificaciones', authMiddleware.autenticarUsuario, notificacionesRoutes);

// ==============================================
// MANEJO DE ERRORES GLOBAL
// ==============================================
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ 
    error: "Error interno del servidor",
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// ==============================================
// INICIO DEL SERVIDOR
// ==============================================
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