const Notificacion = require('../models/notificacion');

// Crear una notificación
exports.crearNotificacion = async (req, res) => {
    try {
        const { usuario_id, mensaje, tipo, estado = 'pendiente' } = req.body;

        // Validación básica
        if (!usuario_id || !mensaje || !tipo) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear una nueva notificación
        const notificacionId = await Notificacion.create(usuario_id, mensaje, tipo, estado);

        // Respuesta exitosa
        res.status(201).json({ message: 'Notificación creada exitosamente', notificacionId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la notificación', error: error.message });
    }
};

// Obtener todas las notificaciones
exports.obtenerNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.findAll();
        res.status(200).json(notificaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las notificaciones', error: error.message });
    }
};

// Obtener una notificación por ID
exports.obtenerNotificacionPorId = async (req, res) => {
    try {
        const notificacion = await Notificacion.findById(req.params.id);
        if (!notificacion) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }
        res.status(200).json(notificacion);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la notificación', error: error.message });
    }
};

// Actualizar el estado de una notificación
exports.actualizarEstadoNotificacion = async (req, res) => {
    try {
        const { estado } = req.body;
        const { id } = req.params;

        const updated = await Notificacion.updateEstado(id, estado);
        if (!updated) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        res.status(200).json({ message: 'Estado de la notificación actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado de la notificación', error: error.message });
    }
};

// Eliminar una notificación
exports.eliminarNotificacion = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Notificacion.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        res.status(200).json({ message: 'Notificación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la notificación', error: error.message });
    }
};