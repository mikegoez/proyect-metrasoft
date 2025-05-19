const jwt = require('jsonwebtoken');

const autenticarUsuario = async (req, res, next) => {
  try {
    // Obtener token del header (Bearer) o cookie
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Acceso no autorizado" });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adjuntar datos del usuario a la solicitud
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };

    next();

  } catch (error) {
    console.error('Error en autenticación:', error.message);

    // Manejar solo token expirado o inválido
    if (error.name === 'TokenExpiredError') {
      res.clearCookie('jwt'); // Limpiar cookie solo si el token expiró
      return res.status(401).json({ error: "Sesión expirada" });
    } else if (error.name === 'JsonWebTokenError') {
      res.clearCookie('jwt'); // Limpiar cookie si el token es inválido
      return res.status(401).json({ error: "Token inválido" });
    }

    // No limpiar la cookie en otros errores (ej: errores de servidor)
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

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