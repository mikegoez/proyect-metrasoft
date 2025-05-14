require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// 1. Inicialización
const app = express();

// 2. Configuración de rutas absolutas
const projectRoot = path.join(__dirname, '..'); // Retrocede un nivel desde src/
const publicPath = path.join(projectRoot, 'public');
const routesPath = path.join(projectRoot, 'src', 'routes');
const middlewaresPath = path.join(projectRoot, 'src', 'middlewares');

// 3. Middlewares básicos
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 4. Rate limiting
app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Demasiadas solicitudes desde esta IP"
}));

// 5. Conexión a MySQL
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

app.use((req, res, next) => {
  req.db = pool;
  next();
});

// 6. Archivos estáticos
app.use(express.static(publicPath));

// 7. Importación del middleware de autenticación (AÑADIDO)
const autenticarUsuario = require(path.join(middlewaresPath, 'auth'));

// 8. Carga segura de rutas
const loadRoute = (routeName) => {
  try {
    const routePath = path.join(routesPath, routeName);
    console.log(`🔄 Intentando cargar ruta: ${routePath}.js`);
    return require(routePath);
  } catch (err) {
    console.warn(`⚠️ Ruta ${routeName} no encontrada (${err.message})`);
    return null;
  }
};

// 9. Registro dinámico de rutas
const routeDefinitions = [
  { name: 'authRoutes', path: '/api/auth', protected: false },
  { name: 'vehiculosRoutes', path: '/api/vehiculos', protected: true },
  { name: 'conductoresRoutes', path: '/api/conductores', protected: true },
  { name: 'despachosRoutes', path: '/api/despachos', protected: true },
  { name: 'notificacionesRoutes', path: '/api/notificaciones', protected: true }
];

routeDefinitions.forEach(route => {
  const routeModule = loadRoute(route.name);
  if (routeModule) {
    const middleware = route.protected ? [autenticarUsuario, routeModule] : [routeModule];
    app.use(route.path, ...middleware);
    console.log(`✓ Ruta ${route.path} registrada correctamente`);
  }
});

// 10. Manejo de SPA
const spaPaths = ['/', '/login', '/register', '/reset-password', '/index'];
spaPaths.forEach(route => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(publicPath, 'HTML', 'index.html'));
  });
});

// 11. Manejo de errores
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ 
    error: "Error interno del servidor",
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 12. Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ====================================
  🚀 Servidor Metrasoft iniciado
  ====================================
  Entorno: ${process.env.NODE_ENV || 'development'}
  Puerto: ${PORT}
  Ruta de middlewares: ${middlewaresPath}
  ====================================
  `);
});