const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
//definicion de endpoints de autentificacion
router.post("/registro", authController.registro); //registar nuevo usuario
router.post("/login", authController.login); //iniciar sesion
router.post("/solicitar-reset", authController.solicitarReset); 
router.post("/restablecer-contraseña", authController.restablecerContraseña);

module.exports = router;