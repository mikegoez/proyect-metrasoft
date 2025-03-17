const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear una notificación
router.post('/', authMiddleware, notificacionController.crearNotificacion);

// Obtener todas las notificaciones
router.get('/', authMiddleware, notificacionController.obtenerNotificaciones);

// Obtener una notificación por ID
router.get('/:id', authMiddleware, notificacionController.obtenerNotificacionPorId);

// Actualizar el estado de una notificación
router.put('/:id', authMiddleware, notificacionController.actualizarEstadoNotificacion);

// Eliminar una notificación
router.delete('/:id', authMiddleware, notificacionController.eliminarNotificacion);

module.exports = router;