const Vehiculo = require('../models/vehiculo');
const Actualizacion = require('../models/actualizacion');

// Crear un vehículo
exports.crearVehiculo = async (req, res) => {
    try {
        const {
            placa,
            marca,
            modelo,
            ano,
            capacidad,
            tipo_carga,
            fecha_vencimiento_soat,
            fecha_vencimiento_tecnomecanica
        } = req.body;

        console.log('Datos recibidos:', {
            placa,
            marca,
            modelo,
            ano,
            capacidad,
            tipo_carga,
            fecha_vencimiento_soat,
            fecha_vencimiento_tecnomecanica
        });

        // Validación básica
        if (!placa || !marca || !modelo || !ano || !capacidad || !tipo_carga || !fecha_vencimiento_soat || !fecha_vencimiento_tecnomecanica) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear un nuevo vehículo
        const vehiculoId = await Vehiculo.create({
            placa,
            marca,
            modelo,
            ano,
            capacidad,
            tipo_carga,
            fecha_vencimiento_soat,
            fecha_vencimiento_tecnomecanica
        });
        console.log('Vehículo creado con ID:', vehiculoId);

        // Respuesta exitosa
        res.status(201).json({ message: 'Vehículo creado exitosamente', vehiculoId });
    } catch (error) {
        console.error('Error al crear el vehículo:', error);
        res.status(500).json({ message: 'Error al crear el vehículo', error: error.message });
    }
};

// Obtener todos los vehículos
exports.obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.findAll();
        console.log('Vehículos obtenidos:', vehiculos);
        res.status(200).json(vehiculos);
    } catch (error) {
        console.error('Error al obtener los vehículos:', error);
        res.status(500).json({ message: 'Error al obtener los vehículos', error: error.message });
    }
};

// Obtener un vehículo por ID
exports.obtenerVehiculoPorId = async (req, res) => {
    try {
        const vehiculo = await Vehiculo.findById(req.params.id);
        console.log('Vehículo obtenido:', vehiculo);
        if (!vehiculo) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }
        res.status(200).json(vehiculo);
    } catch (error) {
        console.error('Error al obtener el vehículo:', error);
        res.status(500).json({ message: 'Error al obtener el vehículo', error: error.message });
    }
};

// Actualizar un vehículo
exports.actualizarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const camposActualizados = req.body; // Todos los campos que se desean actualizar
        const usuario_id = req.user.id; // ID del usuario que realiza la actualización

        // Obtener el vehículo actual para comparar los valores
        const vehiculoActual = await Vehiculo.findById(id);
        if (!vehiculoActual) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        // Actualizar el vehículo
        const updated = await Vehiculo.update(id, camposActualizados);
        if (!updated) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        // Registrar la actualización en la tabla de auditoría
        for (const [campo, valor_nuevo] of Object.entries(camposActualizados)) {
            const valor_anterior = vehiculoActual[campo];
            await Actualizacion.create(
                usuario_id,
                'vehiculos', // Nombre de la tabla
                id,          // ID del registro actualizado
                campo,       // Campo actualizado
                valor_anterior, // Valor anterior
                valor_nuevo    // Valor nuevo
            );
        }

        res.status(200).json({ message: 'Vehículo actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el vehículo:', error);
        res.status(500).json({ message: 'Error al actualizar el vehículo', error: error.message });
    }
};

// Eliminar un vehículo
exports.eliminarVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Eliminando vehículo con ID:', id);

        const deleted = await Vehiculo.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        res.status(200).json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el vehículo:', error);
        res.status(500).json({ message: 'Error al eliminar el vehículo', error: error.message });
    }
};