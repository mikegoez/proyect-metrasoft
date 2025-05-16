const express = require('express');
const router = express.Router();
const conductorController = require('../controllers/conductorController');
const pool = require("../config/db");
// Configuración de rutas para el recurso 'conductores'

router.post('/', conductorController.crearConductor);
router.get('/:numero_documento', conductorController.obtenerConductor);
router.get('/', conductorController.obtenerConductores);
router.put('/:numero_documento', conductorController.actualizarConductor);
router.delete('/:numero_documento', conductorController.eliminarConductor);
router.get('/contar', async (req, res) => {
  try {
    const [result] = await req.db.query('SELECT COUNT(*) AS total FROM conductores');
    res.json({ total: result[0].total });
  } catch (error) {
    res.status(500).json({ error: "Error al contar conductores" });
  }
});

module.exports = router;