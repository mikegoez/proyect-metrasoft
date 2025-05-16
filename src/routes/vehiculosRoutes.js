const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');

// Configuración de rutas RESTful para vehículos

router.post('/', vehiculoController.crearVehiculo);
router.get("/:placa", vehiculoController.obtenerVehiculo);
router.get('/', vehiculoController.obtenerVehiculos); 
router.get('/by-id/:id', vehiculoController.obtenerVehiculoPorId);
router.put("/:placa", vehiculoController.actualizarVehiculo);
router.delete("/:placa", vehiculoController.eliminarVehiculo);
router.get('/contar', async (req, res) => {
  try {
    console.log('Consultando vehículos...');
    const [result] = await req.db.query('SELECT COUNT(*) AS total FROM vehiculos');
    res.json({ total: result[0].total });
  } catch (error) {
    console.error('Error SQL:', error.sqlMessage || error.message);
    res.status(500).json({ error: "Error al contar vehículos" });
  }
});

module.exports = router;