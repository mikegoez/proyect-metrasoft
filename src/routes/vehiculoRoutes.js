const express = require('express');
const router = express.Router();
const VehiculoController = require('../controllers/vehiculoController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear un vehículo
router.post('/', authMiddleware, vehiculoController.crearVehiculo);

// Obtener todos los vehículos
router.get('/', authMiddleware, vehiculoController.obtenerVehiculos);

// Obtener un vehículo por ID
router.get('/:id', authMiddleware, vehiculoController.obtenerVehiculoPorId);

// Actualizar un vehículo
router.put('/:id', authMiddleware, vehiculoController.actualizarVehiculo);

// Eliminar un vehículo
router.delete('/:id', authMiddleware, vehiculoController.eliminarVehiculo);

module.exports = router;