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
const authMiddleware = require('./middlewares/auth');

// ================================================
// 1. INICIALIZACIÓN Y CONFIGURACIONES BÁSICAS
// ================================================
const app = express();
app.set('trust proxy', 1);

// Configuración de rutas
const publicPath = path.resolve(__dirname, '../public');
const htmlPath = path.join(publicPath, 'HTML');

// Lista de archivos protegidos (DEBE ESTAR ANTES DE SU USO)
const allowedFiles = [
  'index.html',
  'conductores.html',
  'vehiculos.html',
  'despachos.html',
  'notificaciones.html'
];

// ================================================
// 2. MIDDLEWARES GLOBALES (Orden crítico)
// ================================================

// -- Configuración CORS y seguridad --
app.use(cors({
  origin: 'https://proyect-metrasoft-production.up.railway.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'"],
      "connect-src": ["'self'", process.env.FRONTEND_URL]
    }
  }
}));

// Headers manuales para CORS (redundancia para entornos complejos)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://proyect-metrasoft-production.up.railway.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================================================
// 3. ARCHIVOS ESTÁTICOS (Deben ir ANTES de las rutas)
// ================================================
app.use('/assets', express.static(path.join(publicPath, 'assets')));
app.use('/CSS', express.static(path.join(publicPath, 'CSS')));
app.use('/JS', express.static(path.join(publicPath, 'JS')));

// ================================================
// 4. MANEJO DE RUTAS
// ================================================

// -- Redirección raíz --
app.get('/', (req, res) => {
  res.redirect('/HTML/login.html');
});

// -- Rutas públicas --
const rutasPublicas = [
  '/HTML/login.html',
  '/HTML/register.html',
  '/HTML/reset-password.html'
];

rutasPublicas.forEach(ruta => {
  app.get(ruta, (req, res) => {
    res.sendFile(path.join(htmlPath, ruta.split('/HTML/')[1])); // Usar htmlPath
  });
});

// -- Rutas protegidas --
app.get('/HTML/*', (req, res, next) => {
  const requestedFile = req.path.replace('/HTML/', '');
  
  if (allowedFiles.includes(requestedFile)) {
    // Sirve el archivo directamente después de autenticar
      authMiddleware.autenticarUsuario(req, res, () => {
      res.sendFile(path.join(htmlPath, requestedFile), (err) => {
        if (err) {
          console.error("Error al enviar archivo:", err);
          res.status(500).json({ error: "Error interno del servidor" });
        }
      });
    });
  } else {
    res.status(404).sendFile(path.join(htmlPath, '404.html'));
  }
});

// -- API Routes --
const authRoutes = require('./routes/authRoutes');
// ... otras rutas de API

app.use("/api/auth", authRoutes);
// ... otros usos de rutas de API

// ================================================
// 5. MANEJO DE ERRORES
// ================================================
app.use((err, req, res, next) => {
  console.error("🔥 Error crítico:", err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).sendFile(path.join(htmlPath, '404.html'));
});

// ================================================
// 6. INICIO DEL SERVIDOR
// ================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
    ====================================
    🚀 Servidor iniciado en puerto ${PORT}
    Entorno: ${process.env.NODE_ENV || 'development'}
    URL Frontend: ${process.env.FRONTEND_URL}
    ====================================
  `);
});