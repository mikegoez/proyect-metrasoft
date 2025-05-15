const jwt = require('jsonwebtoken');

const autenticarUsuario = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    if (req.path.startsWith('/api')) {
      return res.status(401).json({ error: "No autorizado" });
    }
    return res.redirect('/HTML/login.html');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.clearCookie('jwt');
    if (req.path.startsWith('/api')) {
      return res.status(401).json({ error: "Token inválido" });
    }
    return res.redirect('/HTML/login.html');
  }
};

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