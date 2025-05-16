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
router.get('/contar', async (req, res) => {
  try {
    const [result] = await req.db.query('SELECT COUNT(*) AS total FROM vehiculos');
    res.json({ total: result[0].total });
  } catch (error) {
    res.status(500).json({ error: "Error al contar vehículos" });
  }
});

module.exports = router;