const pool = require("../config/db");

// Función auxiliar para crear notificaciones en el sistema
const crearNotificacion = async (tipo, mensaje, entidad_id, entidad_tipo) => {
  await pool.query(
      `INSERT INTO notificaciones 
      (tipo, mensaje, entidad_id, entidad_tipo)
      VALUES (?, ?, ?, ?)`,
      [tipo, mensaje, entidad_id.toString(), entidad_tipo] // Convertir ID a string
  );
};
// Controlador para crear nuevo vehículo
exports.crearVehiculo = async (req, res) => {
  try {
     // Extraer datos del cuerpo de la solicitud
    const { placa, marca, modelo, ano, tipo_carga, capacidad_puestos, capacidad_kg, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica } = req.body;
    // Validar fecha de vencimiento del SOAT
    if (new Date(fecha_vencimiento_soat) < new Date()) {
      return res.status(400).json({ error: "El SOAT está vencido" });
    }

    // Insertar vehículo en la base de datos
    const [result] = await pool.query(
      `INSERT INTO vehiculos 
      (placa, marca, modelo, ano, tipo_carga, capacidad_puestos, capacidad_kg, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [placa, marca, modelo, ano, tipo_carga, capacidad_puestos, capacidad_kg, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica]
    );
    // Crear notificación de creación
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


// Controlador para obtener lista básica de vehículos
exports.obtenerVehiculos = async (req, res) => {
  try {
    // Consultar solo ID y placa de todos los vehículos
      const [vehiculos] = await pool.query(
          "SELECT id_vehiculo, placa FROM vehiculos"
      );
      res.json(vehiculos); //devuelve lista
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
// Obtener detalles técnicos por ID de vehículo
exports.obtenerVehiculoPorId = async (req, res) => {
  try {
      const { id } = req.params; // Obtener ID de los parámetros
      // Consultar capacidades específicas
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

// Buscar vehículo completo por placa
exports.obtenerVehiculo = async (req, res) => {
  try {
    const { placa } = req.params;// Obtener placa de la URL
    // Consultar todos los campos
    const [vehiculo] = await pool.query("SELECT * FROM vehiculos WHERE placa = ?", [placa]);
    
    if (!vehiculo.length) return res.status(404).json({ error: "Vehículo no encontrado" });
    res.json(vehiculo[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar fechas de documentos del vehículo
exports.actualizarVehiculo = async (req, res) => {
  try {
 
    const { placa } = req.params;  // Placa del vehículo a actualizar
    const { fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica } = req.body;
     // Validar fecha del SOAT
    if (new Date(fecha_vencimiento_soat) < new Date()) {
      return res.status(400).json({ error: "SOAT vencido" });
    }
     // Obtener ID para la notificación
    const [vehiculoExistente] = await pool.query(
      "SELECT id_vehiculo FROM vehiculos WHERE placa = ?",
      [placa]
  );

   // Actualizar registros en BD
    await pool.query(
      `UPDATE vehiculos 
      SET fecha_vencimiento_soat = ?, 
          fecha_vencimiento_tecnomecanica = ? 
      WHERE placa = ?`,
      [fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica, placa]
    );
    // Registrar notificación de actualización
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


// Eliminar vehículo del sistema
exports.eliminarVehiculo = async (req, res) => {
  try {
    const { placa } = req.params; // placa a eliminar

    // Obtener ID para la notificación
    const [vehiculo] = await pool.query("SELECT id_vehiculo FROM vehiculos WHERE placa = ?", [placa]);
    // Crear notificación antes de eliminar
    await crearNotificacion(
      'eliminacion',
      `Vehículo ${placa} eliminado`,
      vehiculo[0].id_vehiculo,
      'vehiculo'
    );
    // Ejecutar eliminación
    await pool.query("DELETE FROM vehiculos WHERE placa = ?", [placa]);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Contar total de vehículos registrados
exports.contarVehiculos = async (req, res) => {
  try {
      // Consulta de conteo
      const [result] = await pool.query("SELECT COUNT(id_vehiculo) AS total FROM vehiculos");
      res.json({ total: result[0].total }); //devuelve numero 
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};