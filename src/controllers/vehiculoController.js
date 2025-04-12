const pool = require("../config/db");

const crearNotificacion = async (tipo, mensaje, entidad_id, entidad_tipo) => {
  await pool.query(
      `INSERT INTO notificaciones 
      (tipo, mensaje, entidad_id, entidad_tipo)
      VALUES (?, ?, ?, ?)`,
      [tipo, mensaje, entidad_id.toString(), entidad_tipo]
  );
};
// Crear vehículo
exports.crearVehiculo = async (req, res) => {
  try {
    const { placa, marca, modelo, ano, tipo_carga, capacidad_puestos, capacidad_kg, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica } = req.body;

    if (new Date(fecha_vencimiento_soat) < new Date()) {
      return res.status(400).json({ error: "El SOAT está vencido" });
    }

    const [result] = await pool.query(
      `INSERT INTO vehiculos 
      (placa, marca, modelo, ano, tipo_carga, capacidad_puestos, capacidad_kg, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [placa, marca, modelo, ano, tipo_carga, capacidad_puestos, capacidad_kg, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica]
    );

    await crearNotificacion(
      'creacion',
      `Vehículo ${placa} registrado`,
      result.insertId, // ID del nuevo vehículo
      'vehiculo'
    );

    res.status(201).json({ success: true });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Placa ya registrada" });
    }
    res.status(500).json({ error: error.message });
  }
};


// obtenerVehículos
exports.obtenerVehiculos = async (req, res) => {
  try {
      const [vehiculos] = await pool.query(
          "SELECT id_vehiculo, placa FROM vehiculos"
      );
      res.json(vehiculos);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.obtenerVehiculoPorId = async (req, res) => {
  try {
      const { id } = req.params;
      const [vehiculo] = await pool.query(
          "SELECT tipo_carga, capacidad_kg, capacidad_puestos FROM vehiculos WHERE id_vehiculo = ?", 
          [id]
      );
      
      if (!vehiculo.length) return res.status(404).json({ error: "Vehículo no encontrado" });
      res.json(vehiculo[0]);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Buscar vehículo por placa
exports.obtenerVehiculo = async (req, res) => {
  try {
    const { placa } = req.params;
    const [vehiculo] = await pool.query("SELECT * FROM vehiculos WHERE placa = ?", [placa]);
    
    if (!vehiculo.length) return res.status(404).json({ error: "Vehículo no encontrado" });
    res.json(vehiculo[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Actualizar vehículo
exports.actualizarVehiculo = async (req, res) => {
  try {
 
    const { placa } = req.params;
    const { fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica } = req.body;

    if (new Date(fecha_vencimiento_soat) < new Date()) {
      return res.status(400).json({ error: "SOAT vencido" });
    }
    const [vehiculoExistente] = await pool.query(
      "SELECT id_vehiculo FROM vehiculos WHERE placa = ?",
      [placa]
  );

    await pool.query(
      `UPDATE vehiculos 
      SET fecha_vencimiento_soat = ?, 
          fecha_vencimiento_tecnomecanica = ? 
      WHERE placa = ?`,
      [fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica, placa]
    );

    await crearNotificacion(
      'actualizacion',
      `Vehículo ${placa} actualizado`,
      vehiculoExistente[0].id_vehiculo,
      'vehiculo'
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Eliminar vehículo
exports.eliminarVehiculo = async (req, res) => {
  try {
    const { placa } = req.params;

    const [vehiculo] = await pool.query("SELECT id_vehiculo FROM vehiculos WHERE placa = ?", [placa]);
    
    await crearNotificacion(
      'eliminacion',
      `Vehículo ${placa} eliminado`,
      vehiculo[0].id_vehiculo,
      'vehiculo'
    );

    await pool.query("DELETE FROM vehiculos WHERE placa = ?", [placa]);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};