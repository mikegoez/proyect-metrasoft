const pool = require("../config/db");
const crearNotificacion = async (tipo, mensaje, entidad_id, entidad_tipo) => {
    await pool.query(
        `INSERT INTO notificaciones 
        (tipo, mensaje, entidad_id, entidad_tipo)
        VALUES (?, ?, ?, ?)`,
        [tipo, mensaje, entidad_id.toString(), entidad_tipo]
    );
};

// Controlador para crear conductores
exports.crearConductor = async (req, res) => {
    try {
        const { tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, fecha_vencimiento_licencia } = req.body;

        if (new Date(fecha_vencimiento_licencia) < new Date()) {
            return res.status(400).json({ error: "La licencia está vencida" });
        }

        const [result] = await pool.query(
            `INSERT INTO conductores
            (tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, fecha_vencimiento_licencia)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, fecha_vencimiento_licencia]
        );

        await crearNotificacion(
            'creacion',
            `Conductor ${numero_documento} registrado`,
            result.insertId,
            'conductor'
        );

        res.status(201).json({ success: true });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Documento ya registrado" });
        }
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener lista de conductores
exports.obtenerConductores = async (req, res) => {
    try {
        const [conductores] = await pool.query("SELECT id_conductor, nombres, apellidos FROM conductores");
        res.json(conductores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para obtener un conductor
exports.obtenerConductores = async (req, res) => {
    try {
        const [conductores] = await pool.query("SELECT id_conductor, numero_documento, nombres, apellidos FROM conductores"); // ✅ Añade numero_documento
        res.json(conductores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para actualizar conductor
exports.actualizarConductor = async (req, res) => {
    try {
        const { numero_documento } = req.params;
        
        // Validación clave 2: Documento inválido
        if (!numero_documento || numero_documento === "undefined") {
            return res.status(400).json({ error: "Documento inválido para actualización" });
        }

        const { fecha_vencimiento_licencia, telefono } = req.body;
        
        if (new Date(fecha_vencimiento_licencia) < new Date()) {
            return res.status(400).json({ error: "La licencia está vencida" });
        }

        const [conductorExistente] = await pool.query(
            "SELECT id_conductor FROM conductores WHERE numero_documento = ?", 
            [numero_documento]
        );

        if (!conductorExistente.length) {
            return res.status(404).json({ error: "Conductor no encontrado" });
        }

        await pool.query(
            `UPDATE conductores
            SET fecha_vencimiento_licencia = ?,
                telefono = ? 
            WHERE numero_documento = ?`,
            [fecha_vencimiento_licencia, telefono, numero_documento]
        );

        await crearNotificacion(
            'actualizacion',
            `Conductor ${numero_documento} actualizado`,
            conductorExistente[0].id_conductor,
            'conductor'
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para eliminar conductor
exports.eliminarConductor = async (req, res) => {
    try {
        const { numero_documento } = req.params;
        
        // Validación adicional para eliminación
        if (!numero_documento || numero_documento === "undefined") {
            return res.status(400).json({ error: "Documento inválido para eliminación" });
        }

        const [conductor] = await pool.query(
            "SELECT id_conductor FROM conductores WHERE numero_documento = ?", 
            [numero_documento]
        );

        if (!conductor.length) {
            return res.status(404).json({ error: "Conductor no encontrado" });
        }

        await crearNotificacion(
            'eliminacion',
            `Conductor ${numero_documento} eliminado`,
            conductor[0].id_conductor,
            'conductor'
        );

        await pool.query("DELETE FROM conductores WHERE numero_documento = ?", [numero_documento]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};