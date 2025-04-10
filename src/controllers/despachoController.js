const pool = require("../config/db");
const { generarCodigoConsecutivo } = require("../utils/generadores");

// Crear despacho con consecutivo
exports.crearDespacho = async (req, res) => {
    try {
        // Validar existencia de vehículo y conductor
        const [vehiculo] = await pool.query(
            "SELECT id_vehiculo FROM vehiculos WHERE id_vehiculo = ?", 
            [req.body.vehiculo_id]
        );
        
        const [conductor] = await pool.query(
            "SELECT id_conductor FROM conductores WHERE id_conductor = ?", 
            [req.body.conductor_id]
        );
        
        if (!vehiculo.length || !conductor.length) {
            return res.status(400).json({ error: "Vehículo o conductor no válido" });
        }
        
        const codigo_despacho = await generarCodigoConsecutivo();
        const { vehiculo_id, conductor_id, tipo_carga, destino, capacidad_kg, capacidad_puestos, fecha, hora } = req.body;

        // Insertar el despacho
        await pool.query(
            `INSERT INTO despachos 
            (codigo_despacho, vehiculo_id, conductor_id, tipo_carga, destino, capacidad_kg, capacidad_puestos, fecha, hora)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [codigo_despacho, vehiculo_id, conductor_id, tipo_carga, destino, capacidad_kg, capacidad_puestos, fecha, hora]
        );

        // Obtener el despacho recién creado con JOINs para vehículo y conductor
        const [despachoCompleto] = await pool.query(`
            SELECT d.*, v.placa, c.nombres, c.apellidos 
            FROM despachos d
            LEFT JOIN vehiculos v ON d.vehiculo_id = v.id_vehiculo
            LEFT JOIN conductores c ON d.conductor_id = c.id_conductor
            WHERE d.codigo_despacho = ?
        `, [codigo_despacho]);

        // Enviar respuesta única con todos los datos
        res.status(201).json(despachoCompleto[0]);

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Código de despacho ya existe" });
        }
        res.status(500).json({ error: error.message });
    }
};


// Consultar despacho
exports.obtenerDespacho = async (req, res) => {
    try {
        const { codigo } = req.params;
        const [despacho] = await pool.query(
            "SELECT * FROM despachos WHERE codigo_despacho = ?",
            [codigo]
        );
        
        if (!despacho.length) return res.status(404).json({ error: "Despacho no encontrado" });
        res.json(despacho[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar despacho
exports.eliminarDespacho = async (req, res) => {
    try {
        const { codigo } = req.params;
        await pool.query("DELETE FROM despachos WHERE codigo_despacho = ?", [codigo]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};