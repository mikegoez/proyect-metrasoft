const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');
const authMiddleware = require('../middlewares/auth');

// Configuración de rutas RESTful para vehículos

router.post('/', authMiddleware.vehiculoController.crearVehiculo);
router.get("/:placa", authMiddleware.vehiculoController.obtenerVehiculo);

router.put("/:placa", authMiddleware.vehiculoController.actualizarVehiculo);
router.delete("/:placa", authMiddleware.vehiculoController.eliminarVehiculo);


module.exports = router;