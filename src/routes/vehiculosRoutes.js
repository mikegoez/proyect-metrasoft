const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');
const pool = require("../config/db");
// Configuración de rutas RESTful para vehículos
router.get('/contar', vehiculoController.contarVehiculos);
router.post('/', vehiculoController.crearVehiculo);
router.get("/:placa", vehiculoController.obtenerVehiculo);
router.get('/', vehiculoController.obtenerVehiculos); 
router.get('/by-id/:id', vehiculoController.obtenerVehiculoPorId);
router.put("/:placa", vehiculoController.actualizarVehiculo);
router.delete("/:placa", vehiculoController.eliminarVehiculo);

module.exports = router;