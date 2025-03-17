const express = require('express');
const router = express.Router();
const despachoController = require('../controllers/despachoController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear un despacho
router.post('/', authMiddleware, despachoController.crearDespacho);

// Obtener todos los despachos
router.get('/', authMiddleware, despachoController.obtenerDespachos);

// Obtener un despacho por ID
router.get('/:id', authMiddleware, despachoController.obtenerDespachoPorId);

// Actualizar un despacho
router.put('/:id', authMiddleware, despachoController.actualizarDespacho);

// Eliminar un despacho
router.delete('/:id', authMiddleware, despachoController.eliminarDespacho);

module.exports = router;