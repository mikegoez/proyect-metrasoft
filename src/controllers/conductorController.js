const pool = require("../config/db"); // Importa el pool de conexiones a la base de datos
// Función auxiliar para crear notificaciones
const crearNotificacion = async (tipo, mensaje, entidad_id, entidad_tipo) => {
    await pool.query(
        `INSERT INTO notificaciones 
        (tipo, mensaje, entidad_id, entidad_tipo)
        VALUES (?, ?, ?, ?)`,
        [tipo, mensaje, entidad_id.toString(), entidad_tipo] // Convierte el ID a string para compatibilidad
    );
};

//Controlador para crear conductores
exports.crearConductor = async (req, res) => {
    try {
         // Extraer datos del cuerpo de la solicitud
      const { tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, fecha_vencimiento_licencia } = req.body;

        // Validar fecha de vencimiento de la licencia
        if (new Date(fecha_vencimiento_licencia) < new Date()) {
          return res.status(400).json({ error: "La licencia esta vencida" });
        }
     // Insertar nuevo conductor en la base de datos
    const [result] = await pool.query(
        `INSERT INTO conductores
        (tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, fecha_vencimiento_licencia)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, fecha_vencimiento_licencia]
     );
     // Crear notificación de creación
     await crearNotificacion(
        'creacion',
        `Conductor ${numero_documento} registrado`,
        result.insertId, // ID del nuevo conductor
        'conductor'
    );
    

     res.status(201).json({ success: true });
    } catch (error) {
        // Manejar error de duplicidad de documento
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: "Placa ya registrada" });
        }
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener lista simplificada de conductores
exports.obtenerConductores = async (req, res) => {
    try {
        // Consulta para obtener datos básicos de todos los conductores
        const [conductores] = await pool.query("SELECT id_conductor, nombres, apellidos FROM conductores");
        res.json(conductores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener detalles completos de un conductor
exports.obtenerConductor = async (req, res) => {
    try {
        const { numero_documento } = req.params;
        
        // Validar que el documento no esté vacío
        if (!numero_documento || numero_documento === "undefined") {
            return res.status(400).json({ error: "Documento no proporcionado" });
        }

        const [conductor] = await pool.query(
            "SELECT * FROM conductores WHERE numero_documento = ?", 
            [numero_documento]
        );
        
        if (!conductor.length) {
            return res.status(404).json({ error: "Conductor no encontrado" });
        }
        
        res.json(conductor[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// ===== Controlador PUT (adaptado de vehículos) =====
exports.actualizarConductor = async (req, res) => {
    try {
        const { numero_documento } = req.params;
        const { fecha_vencimiento_licencia } = req.body;

        // Validación de fecha
        if (new Date(fecha_vencimiento_licencia) < new Date()) {
            return res.status(400).json({ error: "Licencia vencida" });
        }

        // Actualización directa por documento
        const [result] = await pool.query(
            `UPDATE conductores 
            SET fecha_vencimiento_licencia = ? 
            WHERE numero_documento = ?`,
            [fecha_vencimiento_licencia, numero_documento]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Conductor no encontrado" });
        }

        // Notificación
        const [conductor] = await pool.query(
            "SELECT id_conductor FROM conductores WHERE numero_documento = ?",
            [numero_documento]
        );
        
        await crearNotificacion(
            'actualizacion',
            `Conductor ${numero_documento} actualizado`,
            conductor[0].id_conductor,
            'conductor'
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ 
            error: "Error interno del servidor",
            detalle: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};


// Controlador para eliminar un conductor
exports.eliminarConductor = async (req, res) => {
    try {

        const { numero_documento } = req.params;
        // Obtener ID del conductor para la notificación
        const [conductor] = await pool.query(
            "SELECT id_conductor FROM conductores WHERE numero_documento = ?", 
            [numero_documento]
        );
        // Crear notificación de eliminación antes de borrar
        await crearNotificacion(
            'eliminacion',
            `Conductor ${numero_documento} eliminado`,
            conductor[0].id_conductor,
            'conductor'
        );
        // Eliminar conductor de la base de datos
        await pool.query("DELETE FROM conductores WHERE numero_documento = ?", [numero_documento]);
        res.json({ success: true });
    }   catch (error) {
        res.status(500).json({ error: error.message });
    }
};
