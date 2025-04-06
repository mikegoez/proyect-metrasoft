const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/registro", authController.registro);
router.post("/login", authController.login);
router.post("/solicitar-reset", authController.solicitarReset);
router.post("/restablecer-contraseña", authController.restablecerContraseña);

module.exports = router;