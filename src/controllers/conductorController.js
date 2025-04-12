const pool = require("../config/db");

const crearNotificacion = async (tipo, mensaje, entidad_id, entidad_tipo) => {
    await pool.query(
        `INSERT INTO notificaciones 
        (tipo, mensaje, entidad_id, entidad_tipo)
        VALUES (?, ?, ?, ?)`,
        [tipo, mensaje, entidad_id.toString(), entidad_tipo]
    );
};

//Crear conductor 
exports.crearConductor = async (req, res) => {
    try {
      const { tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, fecha_vencimiento_licencia } = req.body;

        if (new Date(fecha_vencimiento_licencia) < new Date()) {
          return res.status(400).json({ error: "La licencia esta vencida" });
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
        result.insertId, // ID del nuevo conductor
        'conductor'
    );
    

     res.status(201).json({ success: true });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: "Placa ya registrada" });
        }
        res.status(500).json({ error: error.message });
    }
};


//obtenerConductores
exports.obtenerConductores = async (req, res) => {
    try {
        const [conductores] = await pool.query("SELECT id_conductor, nombres, apellidos FROM conductores");
        res.json(conductores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//buscar conductor por numero de documento
exports.obtenerConductor = async (req, res) => {
    try {
        const { numero_documento } = req.params;
        const [conductor] = await pool.query( "SELECT * FROM conductores WHERE numero_documento =?", [numero_documento]);

        if (!conductor.length) return res.status(400).json({ error: "Conductor no encontrado" });
        res.json(conductor[0]);
    }   catch (error)  {
        res.status(500).json({ error: error.message });
    }
};

//Actualizar conductor
exports.actualizarConductor = async (req, res) => {
    try {
        const { numero_documento} = req.params;
        const { fecha_vencimiento_licencia, telefono } = req.body;

        if (new Date( fecha_vencimiento_licencia) < new Date()) {
            return res.status(400).json({ error: "Licencia vencida"});
        }

        const [conductorExistente] = await pool.query(
            "SELECT id_conductor FROM conductores WHERE numero_documento = ?", 
            [numero_documento]
        );

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
    }   catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//Eliminar conductor 
exports.eliminarConductor = async (req, res) => {
    try {

        const { numero_documento } = req.params;

        const [conductor] = await pool.query(
            "SELECT id_conductor FROM conductores WHERE numero_documento = ?", 
            [numero_documento]
        );
        
        await crearNotificacion(
            'eliminacion',
            `Conductor ${numero_documento} eliminado`,
            conductor[0].id_conductor,
            'conductor'
        );

        await pool.query("DELETE FROM conductores WHERE numero_documento = ?", [numero_documento]);
        res.json({ success: true });
    }   catch (error) {
        res.status(500).json({ error: error.message });
    }
};
