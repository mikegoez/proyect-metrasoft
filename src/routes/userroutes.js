const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Registrar un usuario
router.post('/register', userController.register);

// Iniciar sesión
router.post('/login', userController.login);

// Obtener perfil del usuario (protegido)
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;