const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");
//definicion de endpoints de autentificacion
router.post("/registro", authController.registro); //registar nuevo usuario
router.post("/login", authController.login); //iniciar sesion
router.post("/solicitar-reset", authController.solicitarReset); 
router.post("/restablecer-contraseña", authController.restablecerContraseña);
router.get("/verify", authMiddleware.autenticarUsuario, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      email: req.user.email,
      rol: req.user.rol 
    }
  });
});
router.post('/logout', authController.logout);

module.exports = router;