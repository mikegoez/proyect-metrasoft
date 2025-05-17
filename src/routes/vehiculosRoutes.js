const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');

// Configuración de rutas RESTful para vehículos

router.post('/', vehiculoController.crearVehiculo);
router.get("/:placa", vehiculoController.obtenerVehiculo);
router.get('/', vehiculoController.obtenerVehiculo); 
router.get('/by-id/:id', vehiculoController.obtenerVehiculoPorId);
router.put("/:placa", vehiculoController.actualizarVehiculo);
router.delete("/:placa", vehiculoController.eliminarVehiculo);


module.exports = router;