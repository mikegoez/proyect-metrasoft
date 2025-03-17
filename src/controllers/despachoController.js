const Despacho = require('../models/Despacho');

// Crear un despacho
exports.crearDespacho = async (req, res) => {
    try {
        const { codigo_despacho, vehiculo_id, conductor_id, tipo_carga, destino, capacidad, fecha, hora, creado_por } = req.body;

        // Validación básica
        if (!codigo_despacho || !vehiculo_id || !conductor_id || !tipo_carga || !destino || !capacidad || !fecha || !hora || !creado_por) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear un nuevo despacho
        const despachoId = await Despacho.create(codigo_despacho, vehiculo_id, conductor_id, tipo_carga, destino, capacidad, fecha, hora, creado_por);

        // Respuesta exitosa
        res.status(201).json({ message: 'Despacho creado exitosamente', despachoId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el despacho', error: error.message });
    }
};

// Obtener todos los despachos
exports.obtenerDespachos = async (req, res) => {
    try {
        const despachos = await Despacho.findAll();
        res.status(200).json(despachos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los despachos', error: error.message });
    }
};

// Obtener un despacho por ID
exports.obtenerDespachoPorId = async (req, res) => {
    try {
        const despacho = await Despacho.findById(req.params.id);
        if (!despacho) {
            return res.status(404).json({ message: 'Despacho no encontrado' });
        }
        res.status(200).json(despacho);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el despacho', error: error.message });
    }
};

// Actualizar un despacho
exports.actualizarDespacho = async (req, res) => {
    try {
        const { destino, fecha } = req.body;
        const { id } = req.params;

        const updated = await Despacho.update(id, destino, fecha);
        if (!updated) {
            return res.status(404).json({ message: 'Despacho no encontrado' });
        }

        res.status(200).json({ message: 'Despacho actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el despacho', error: error.message });
    }
};

// Eliminar un despacho
exports.eliminarDespacho = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Despacho.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Despacho no encontrado' });
        }

        res.status(200).json({ message: 'Despacho eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el despacho', error: error.message });
    }
};