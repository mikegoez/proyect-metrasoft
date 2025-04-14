const pool = require("../config/db");
const { generarCodigoConsecutivo } = require("../utils/generadores"); // Utilidad para generación de códigos

// Función auxiliar para registrar notificaciones en el sistema
const crearNotificacion = async (tipo, mensaje, entidad_id, entidad_tipo) => {
    await pool.query(
        `INSERT INTO notificaciones 
        (tipo, mensaje, entidad_id, entidad_tipo)
        VALUES (?, ?, ?, ?)`,
        [tipo, mensaje, entidad_id.toString(), entidad_tipo] // Conversión a string para compatibilidad
    );
};

// Controlador para creación de nuevos despachos
exports.crearDespacho = async (req, res) => {
    try {
        console.log("[DEBUG] Datos recibidos al crear despacho:", req.body);
        // Validar existencia de vehículo y conductor
        const [vehiculo] = await pool.query(
            "SELECT id_vehiculo FROM vehiculos WHERE id_vehiculo = ?", 
            [req.body.vehiculo_id]
        );
        
        const [conductor] = await pool.query(
            "SELECT id_conductor FROM conductores WHERE id_conductor = ?", 
            [req.body.conductor_id]
        );
        // Verificar que ambos recursos existan
        if (!vehiculo.length || !conductor.length) {
            return res.status(400).json({ error: "Vehículo o conductor no válido" });
        }
         // Generación de código único consecutivo
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

        console.log("[DEBUG] Despacho insertado:", despachoCompleto[0]);
        // Registro de notificación de creación
        await crearNotificacion(
            'creacion',
            `Despacho ${codigo_despacho} creado`,
            despachoCompleto[0].id_despacho,
            'despacho'
        );

        // Enviar respuesta única con todos los datos
        res.status(201).json(despachoCompleto[0]);

    } catch (error) {
        console.error("[ERROR] Error al crear despacho:", error.message);
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Código de despacho ya existe" });
        }
        res.status(500).json({ error: error.message });
    }
};


// Controlador para obtener detalles de un despacho
exports.obtenerDespacho = async (req, res) => {
    try {
        const { codigo } = req.params;
        const [despacho] = await pool.query(
            "SELECT * FROM despachos WHERE codigo_despacho = ?",
            [codigo]
        );
        
        if (!despacho.length) return res.status(404).json({ error: "Despacho no encontrado" });
        res.json(despacho[0]); // Devolver primer resultado
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Controlador para eliminar despacho
exports.eliminarDespacho = async (req, res) => {
    try {
        const { codigo } = req.params;
         // Obtener ID para la notificación antes de eliminar
        const [despacho] = await pool.query(
            "SELECT id_despacho FROM despachos WHERE codigo_despacho = ?",
            [codigo]
        );
        if (!despacho.length) {
            return res.status(404).json({ error: "Despacho no encontrado" });
        }
        const idDespacho = despacho[0].id_despacho;
         // Registrar notificación de eliminación
        await crearNotificacion(
            'eliminacion',
            `Despacho ${codigo} eliminado`,
            idDespacho,
            'despacho'
        );

          // Ejecutar eliminación
        await pool.query("DELETE FROM despachos WHERE codigo_despacho = ?", [codigo]);
        
        res.json({ success: true });
    } catch (error) {
        console.error("[ERROR] Al eliminar despacho:", error.message);
        res.status(500).json({ error: error.message });
    }
};