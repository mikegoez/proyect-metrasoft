const jwt = require('jsonwebtoken');

const autenticarUsuario = (req, res, next) => {
  // Obtener token de 2 posibles lugares
  const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies.jwt;
  console.log("🔑 Token recibido:", token);
  
  if (!token) {
    console.log("Error: Token no encontrado");
    return res.status(401).json({ 
      error: "Acceso denegado. No se proporcionó token de autenticación." 
    });
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    console.log(" Token decodificado:", decodificado);
    req.usuario = decodificado;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);
    res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = autenticarUsuario;