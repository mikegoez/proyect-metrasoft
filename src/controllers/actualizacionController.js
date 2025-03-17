const Actualizacion = require('../models/Actualizacion');

// Crear una actualización
exports.crearActualizacion = async (req, res) => {
    try {
        const { usuario_id, tabla_actualizada, registro_id, campo, valor_anterior, valor_nuevo } = req.body;

        // Validación básica
        if (!usuario_id || !tabla_actualizada || !registro_id || !campo || !valor_anterior || !valor_nuevo) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear una nueva actualización
        const actualizacionId = await Actualizacion.create(usuario_id, tabla_actualizada, registro_id, campo, valor_anterior, valor_nuevo);

        // Respuesta exitosa
        res.status(201).json({ message: 'Actualización creada exitosamente', actualizacionId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la actualización', error: error.message });
    }
};

// Obtener todas las actualizaciones
exports.obtenerActualizaciones = async (req, res) => {
    try {
        const actualizaciones = await Actualizacion.findAll();
        res.status(200).json(actualizaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las actualizaciones', error: error.message });
    }
};

// Obtener una actualización por ID
exports.obtenerActualizacionPorId = async (req, res) => {
    try {
        const actualizacion = await Actualizacion.findById(req.params.id);
        if (!actualizacion) {
            return res.status(404).json({ message: 'Actualización no encontrada' });
        }
        res.status(200).json(actualizacion);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la actualización', error: error.message });
    }
};

// Eliminar una actualización
exports.eliminarActualizacion = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Actualizacion.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Actualización no encontrada' });
        }

        res.status(200).json({ message: 'Actualización eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la actualización', error: error.message });
    }
};