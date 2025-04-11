const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');
const pool = require("../config/db");

router.post('/', vehiculoController.crearVehiculo);
router.get("/:placa", vehiculoController.obtenerVehiculo);
router.get('/', vehiculoController.obtenerVehiculos); 
router.get('/by-id/:id', vehiculoController.obtenerVehiculoPorId);
router.put("/:placa", vehiculoController.actualizarVehiculo);
router.delete("/:placa", vehiculoController.eliminarVehiculo);

module.exports = router;