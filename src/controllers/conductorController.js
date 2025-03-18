const Conductor = require('../models/conductor');

// Crear un conductor
exports.crearConductor = async (req, res) => {
    try {
        const { tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, foto_documento, foto_licencia, fecha_vencimiento_licencia } = req.body;

        // Validación básica
        if (!tipo_documento || !numero_documento || !nombres || !apellidos || !telefono || !fecha_vencimiento_licencia) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear un nuevo conductor
        const conductorId = await Conductor.create(tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, foto_documento, foto_licencia, fecha_vencimiento_licencia);

        // Respuesta exitosa
        res.status(201).json({ message: 'Conductor creado exitosamente', conductorId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el conductor', error: error.message });
    }
};

// Obtener todos los conductores
exports.obtenerConductores = async (req, res) => {
    try {
        const conductores = await Conductor.findAll();
        res.status(200).json(conductores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los conductores', error: error.message });
    }
};

// Obtener un conductor por ID
exports.obtenerConductorPorId = async (req, res) => {
    try {
        const conductor = await Conductor.findById(req.params.id);
        if (!conductor) {
            return res.status(404).json({ message: 'Conductor no encontrado' });
        }
        res.status(200).json(conductor);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el conductor', error: error.message });
    }
};

// Actualizar un conductor
exports.actualizarConductor = async (req, res) => {
    try {
        const { telefono, direccion } = req.body;
        const { id } = req.params;

        const updated = await Conductor.update(id, telefono, direccion);
        if (!updated) {
            return res.status(404).json({ message: 'Conductor no encontrado' });
        }

        res.status(200).json({ message: 'Conductor actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el conductor', error: error.message });
    }
};

// Eliminar un conductor
exports.eliminarConductor = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Conductor.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Conductor no encontrado' });
        }

        res.status(200).json({ message: 'Conductor eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el conductor', error: error.message });
    }
};