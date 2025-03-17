const express = require('express');
const router = express.Router();
const conductorController = require('../controllers/conductorController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear un conductor
router.post('/', authMiddleware, conductorController.crearConductor);

// Obtener todos los conductores
router.get('/', authMiddleware, conductorController.obtenerConductores);

// Obtener un conductor por ID
router.get('/:id', authMiddleware, conductorController.obtenerConductorPorId);

// Actualizar un conductor
router.put('/:id', authMiddleware, conductorController.actualizarConductor);

// Eliminar un conductor
router.delete('/:id', authMiddleware, conductorController.eliminarConductor);

module.exports = router;