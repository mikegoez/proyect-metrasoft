const jwt = require('jsonwebtoken');

const autenticarUsuario = async (req, res, next) => {
  try {
    // 1. Obtener token de headers, cookies o query params
    const token = req.headers.authorization?.split(' ')[1] || 
                 req.cookies.jwt || 
                 req.query.token;

    if (!token) {
      return res.status(401).json({ error: "Acceso no autorizado" });
    }

    // 2. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Adjuntar información del usuario a la solicitud
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };

    // 4. Continuar con la siguiente middleware/ruta
    next();
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

// Exportación CORRECTA (usando module.exports)
module.exports = {
  autenticarUsuario,
  redirigirSiAutenticado
};