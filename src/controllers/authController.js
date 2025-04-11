const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarioModel");
const { enviarCorreoRecuperacion } = require("../config/email");
const crypto = require("crypto");

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
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo_electronico, contraseña } = req.body;
    const usuario = await Usuario.buscarPorEmail(correo_electronico);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña_hash);
    if (!contraseñaValida) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario.id_usuario }, 
      process.env.JWT_SECRET, // Usar variable de entorno
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.solicitarReset = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Correo recibido:", email);

    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    await Usuario.guardarTokenReset(email, token);
    console.log("Token generado:", token);

    await enviarCorreoRecuperacion(email, token);
    res.json({ success: true });
    
  } catch (error) {
    console.error("Error en solicitar reset:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};

exports.restablecerContraseña = async (req, res) => {
  try {
    const { token, nuevaContraseña } = req.body;
    const usuario = await Usuario.buscarPorToken(token);
    
    if (!usuario) return res.status(400).json({ error: "Token inválido o expirado" });
    
    const contraseñaHash = await bcrypt.hash(nuevaContraseña, 10);
    await Usuario.actualizarContraseña(usuario.id_usuario, contraseñaHash);
    
    res.json({ success: true });
    
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
};