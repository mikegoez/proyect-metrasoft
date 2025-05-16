const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarioModel");

exports.registro = async (req, res) => {
  try {
    const { correo_electronico, contraseña, rol } = req.body;
    
    if (!correo_electronico || !contraseña || !rol) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const contraseñaHash = await bcrypt.hash(contraseña, 10);
    await Usuario.crear(correo_electronico, contraseñaHash, rol);
    
    res.status(201).json({ success: true });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo_electronico, contraseña } = req.body;
    const usuario = await Usuario.buscarPorEmail(correo_electronico);
    
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña_hash);
    if (!contraseñaValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    
    const token = jwt.sign(
      { 
        id: usuario.id_usuario, 
        email: usuario.correo_electronico, 
        rol: usuario.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

  
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.railway.app',
      maxAge: 86400000, // 24h en ms
      path: '/'
    });

    
    res.json({ 
      success: true, 
      token,
      user: {
        email: usuario.correo_electronico,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 //controlador para solicitudes reset de contraseña
exports.solicitarReset = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Correo recibido:", email);
    //verificar existencia de usuario
    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    //generar token seguro y guardarlo
    const token = crypto.randomBytes(20).toString("hex");
    await Usuario.guardarTokenReset(email, token);
    console.log("Token generado:", token);
    //enviar correo con enlace de recuperacion
    await enviarCorreoRecuperacion(email, token);
    res.json({ success: true });
    
  } catch (error) {
    console.error("Error en solicitar reset:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};
//controlador para actualizar contraseña
exports.restablecerContraseña = async (req, res) => {
  try {
    const { token, nuevaContraseña } = req.body;
    //validar token y obtener usuario
    const usuario = await Usuario.buscarPorToken(token);
    if (!usuario) return res.status(400).json({ error: "Token inválido o expirado" });
    // hashear y actualizar contraseña
    const contraseñaHash = await bcrypt.hash(nuevaContraseña, 10);
    await Usuario.actualizarContraseña(usuario.id_usuario, contraseñaHash);
    
    res.json({ success: true });
    
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
};

// En controllers/authController.js
exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    domain: '.railway.app', // Dominio de Railway
    secure: true, // Solo HTTPS
    sameSite: 'none', // Cross-site
    httpOnly: true
  });
  res.json({ success: true });
};