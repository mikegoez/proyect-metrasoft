const express = require('express');
const router = express.Router();
const despachoController = require('../controllers/despachoController');

router.post('/', despachoController.crearDespacho);
router.get('/:codigo', despachoController.obtenerDespacho);
router.delete('/:codigo', despachoController.eliminarDespacho);
// Exportar configuración de rutas
module.exports = router;