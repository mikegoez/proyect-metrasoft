const express = require('express');
const router = express.Router();
const conductorController = require('../controllers/conductorController');

// Configuración de rutas para el recurso 'conductores'

router.post('/', conductorController.crearConductor);
router.get('/:numero_documento', conductorController.obtenerConductor);
router.get('/', conductorController.obtenerConductores);
router.put('/:numero_documento', conductorController.actualizarConductor);
router.delete('/:numero_documento', conductorController.eliminarConductor);


module.exports = router;