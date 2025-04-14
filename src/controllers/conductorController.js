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
        const { numero_documento } = req.params; // Obtener documento de los parámetros de ruta

        // Buscar conductor por número de documento
        const [conductor] = await pool.query( "SELECT * FROM conductores WHERE numero_documento =?", [numero_documento]);

        if (!conductor.length) return res.status(400).json({ error: "Conductor no encontrado" });
        res.json(conductor[0]); // Devolver primer resultado
    }   catch (error)  {
        res.status(500).json({ error: error.message });
    }
};
// Controlador para actualizar información del conductor
exports.actualizarConductor = async (req, res) => {
    try {
        const { numero_documento} = req.params;
        const { fecha_vencimiento_licencia, telefono } = req.body;
        // Validar fecha de licencia
        if (new Date( fecha_vencimiento_licencia) < new Date()) {
            return res.status(400).json({ error: "Licencia vencida"});
        }
        // Obtener ID del conductor para la notificación
        const [conductorExistente] = await pool.query(
            "SELECT id_conductor FROM conductores WHERE numero_documento = ?", 
            [numero_documento]
        );
         // Actualizar datos del conductor
        await pool.query(
            `UPDATE conductores
            SET fecha_vencimiento_licencia = ?,
                    telefono = ? 
            WHERE numero_documento = ?`,
            [fecha_vencimiento_licencia, telefono, numero_documento]
        );
        // Crear notificación de actualización
        await crearNotificacion(
            'actualizacion',
            `Conductor ${numero_documento} actualizado`,
            conductorExistente[0].id_conductor,
            'conductor'
        );

        res.json({ success: true });
    }   catch (error) {
        res.status(500).json({ error: error.message });
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
// Controlador para obtener el total de conductores registrados
exports.contarConductores = async (req, res) => {
    try {
        // Consulta para contar registros
        const [result] = await pool.query("SELECT COUNT(id_conductor) AS total FROM conductores");
        res.json({ total: result[0].total }); //decuelve el resultado numerico
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};