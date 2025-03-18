const express = require('express');
const router = express.Router();
const VehiculoController = require('../controllers/vehiculoController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear un vehículo
router.post('/', authMiddleware, VehiculoController.crearVehiculo);

// Obtener todos los vehículos
router.get('/', authMiddleware, VehiculoController.obtenerVehiculos);

// Obtener un vehículo por ID
router.get('/:id', authMiddleware, VehiculoController.obtenerVehiculoPorId);

// Actualizar un vehículo
router.put('/:id', authMiddleware, VehiculoController.actualizarVehiculo);

// Eliminar un vehículo
router.delete('/:id', authMiddleware, VehiculoController.eliminarVehiculo);

module.exports = router;