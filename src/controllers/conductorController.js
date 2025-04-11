const pool = require("../config/db");

//Crear conductor 
exports.crearConductor = async (req, res) => {
    try {
      const { tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, fecha_vencimiento_licencia } = req.body;

        if (new Date(fecha_vencimiento_licencia) < new Date()) {
          return res.status(400).json({ error: "La licencia esta vencida" });
        }

    await pool.query(
        `INSERT INTO conductores
        (tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, fecha_vencimiento_licencia)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, fecha_vencimiento_licencia]
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

        await pool.query(
            `UPDATE conductores
            SET fecha_vencimiento_licencia = ?,
                    telefono = ? 
            WHERE numero_documento = ?`,
            [fecha_vencimiento_licencia, telefono, numero_documento]
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
        await pool.query("DELETE FROM conductores WHERE numero_documento = ?", [numero_documento]);
        res.json({ success: true });
    }   catch (error) {
        res.status(500).json({ error: error.message });
    }
};
