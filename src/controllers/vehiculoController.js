const Vehiculo = require('../models/Vehiculo');

// Crear un vehículo
exports.crearVehiculo = async (req, res) => {
    try {
        const { placa, marca, modelo, ano, capacidad, tipo_carga, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica } = req.body;

        // Validación básica
        if (!placa || !marca || !modelo || !ano || !capacidad || !tipo_carga || !fecha_vencimiento_soat || !fecha_vencimiento_tecnomecanica) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear un nuevo vehículo
        const vehiculoId = await Vehiculo.create(placa, marca, modelo, ano, capacidad, tipo_carga, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica);

        // Respuesta exitosa
        res.status(201).json({ message: 'Vehículo creado exitosamente', vehiculoId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el vehículo', error: error.message });
    }
};

// Obtener todos los vehículos
exports.obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.findAll();
        res.status(200).json(vehiculos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los vehículos', error: error.message });
    }
};

// Obtener un vehículo por ID
exports.obtenerVehiculoPorId = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findById(req.params.id);
        if (!vehiculo) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.status(200).json(vehiculo);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el vehículo', error: error.message });
    }
};

// Actualizar un vehículo
exports.actualizarVehiculo = async (req, res) => {
    try {
        const { marca, modelo } = req.body;
        const { id } = req.params;

        const updated = await Vehiculo.update(id, marca, modelo);
        if (!updated) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        res.status(200).json({ message: 'Vehículo actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el vehículo', error: error.message });
    }
};

// Eliminar un vehículo
exports.eliminarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Vehiculo.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        res.status(200).json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el vehículo', error: error.message });
    }
};