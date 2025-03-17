const express = require('express');
const router = express.Router();
const actualizacionController = require('../controllers/actualizacionController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear una actualización
router.post('/', authMiddleware, actualizacionController.crearActualizacion);

// Obtener todas las actualizaciones
router.get('/', authMiddleware, actualizacionController.obtenerActualizaciones);

// Obtener una actualización por ID
router.get('/:id', authMiddleware, actualizacionController.obtenerActualizacionPorId);

// Eliminar una actualización
router.delete('/:id', authMiddleware, actualizacionController.eliminarActualizacion);

module.exports = router;