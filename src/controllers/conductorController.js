const Conductor = require('../models/conductor');
const Actualizacion = require('../models/actualizacion');

// Crear un conductor
exports.crearConductor = async (req, res) => {
    try {
        const {
            tipo_documento,
            numero_documento,
            nombres,
            apellidos,
            telefono,
            direccion = null, // Valor por defecto si no se envía
            foto_documento = null, // Valor por defecto si no se envía
            foto_licencia = null, // Valor por defecto si no se envía
            fecha_vencimiento_licencia
        } = req.body;

        console.log('Datos recibidos:', {
            tipo_documento,
            numero_documento,
            nombres,
            apellidos,
            telefono,
            direccion,
            foto_documento,
            foto_licencia,
            fecha_vencimiento_licencia
        });

        // Validación básica
        if (!tipo_documento || !numero_documento || !nombres || !apellidos || !telefono || !fecha_vencimiento_licencia) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear un nuevo conductor
        const conductorId = await Conductor.create({
            tipo_documento,
            numero_documento,
            nombres,
            apellidos,
            telefono,
            direccion,
            foto_documento,
            foto_licencia,
            fecha_vencimiento_licencia
        });
        console.log('Conductor creado con ID:', conductorId);

        // Respuesta exitosa
        res.status(201).json({ message: 'Conductor creado exitosamente', conductorId });
    } catch (error) {
        console.error('Error al crear el conductor:', error);
        res.status(500).json({ message: 'Error al crear el conductor', error: error.message });
    }
};

// Obtener todos los conductores
exports.obtenerConductores = async (req, res) => {
    try {
        const conductores = await Conductor.findAll();
        console.log('Conductores obtenidos:', conductores);
        res.status(200).json(conductores);
    } catch (error) {
        console.error('Error al obtener los conductores:', error);
        res.status(500).json({ message: 'Error al obtener los conductores', error: error.message });
    }
};

// Obtener un conductor por ID
exports.obtenerConductorPorId = async (req, res) => {
    try {
        const conductor = await Conductor.findById(req.params.id);
        console.log('Conductor obtenido:', conductor);
        if (!conductor) {
            return res.status(404).json({ message: 'Conductor no encontrado' });
        }
        res.status(200).json(conductor);
    } catch (error) {
        console.error('Error al obtener el conductor:', error);
        res.status(500).json({ message: 'Error al obtener el conductor', error: error.message });
    }
};

// Actualizar un conductor
exports.actualizarConductor = async (req, res) => {
    try {
        const { id } = req.params;
        const camposActualizados = req.body; // Todos los campos que se desean actualizar
        const usuario_id = req.user.id; // ID del usuario que realiza la actualización

        // Obtener el conductor actual para comparar los valores
        const conductorActual = await Conductor.findById(id);
        if (!conductorActual) {
            return res.status(404).json({ message: 'Conductor no encontrado' });
        }

        // Actualizar el conductor
        const updated = await Conductor.update(id, camposActualizados);
        if (!updated) {
            return res.status(404).json({ message: 'Conductor no encontrado' });
        }

        // Registrar la actualización en la tabla de auditoría
        for (const [campo, valor_nuevo] of Object.entries(camposActualizados)) {
            const valor_anterior = conductorActual[campo];
            await Actualizacion.create(
                usuario_id,
                'conductores', // Nombre de la tabla
                id,            // ID del registro actualizado
                campo,         // Campo actualizado
                valor_anterior, // Valor anterior
                valor_nuevo    // Valor nuevo
            );
        }

        res.status(200).json({ message: 'Conductor actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el conductor:', error);
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