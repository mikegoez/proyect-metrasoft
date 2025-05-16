const jwt = require('jsonwebtoken');

const autenticarUsuario = async (req, res, next) => {
  try {
    // Obtener token SOLO del header (no de cookies)
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({ error: "Acceso no autorizado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };
    next();

  } catch (error) {
    console.error('Error en autenticación:', error.message);
    
    // Diferenciar entre token expirado y otros errores
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Sesión expirada" });
    }
    res.clearCookie('jwt');
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Middleware para redirigir usuarios ya logueados
const redirigirSiAutenticado = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next();
  
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      res.clearCookie('jwt');
      return next();
    }
    res.redirect('/HTML/index.html'); // Token válido → redirige
  });
};


module.exports = {
  autenticarUsuario,
  redirigirSiAutenticado
};