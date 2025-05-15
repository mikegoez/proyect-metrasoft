const jwt = require('jsonwebtoken');

// Middleware para autenticar usuarios (JWT)
const autenticarUsuario = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    if (req.accepts('html')) {
      return res.redirect('/HTML/login.html');
    }
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.clearCookie('jwt');
    if (req.accepts('html')) {
      return res.redirect('/HTML/login.html');
    }
    res.status(401).json({ error: "Token inválido" });
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