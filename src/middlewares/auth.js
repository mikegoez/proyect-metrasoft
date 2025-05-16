const jwt = require('jsonwebtoken');

const autenticarUsuario = async (req, res, next) => {
  try {
    // Obtener token SOLO del header (no de cookies)
    const token = req.headers.authorization?.replace('Bearer ', ''); // <- Cambia esto

    if (!token) {
      return res.status(401).json({ error: "Token no enviado" });
    }

  } catch (error) {
    console.error('Error en autenticación:', error.message);
    
    // Diferenciar entre token expirado y otros errores
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Sesión expirada" });
    }
    
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Middleware para redirigir usuarios ya logueados
const redirigirSiAutenticado = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
  
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect('/HTML/index.html');
    } catch (err) {
      res.clearCookie('jwt');
      next();
    }
  } else {
    next();
  }
};

module.exports = {
  autenticarUsuario,
  redirigirSiAutenticado
};