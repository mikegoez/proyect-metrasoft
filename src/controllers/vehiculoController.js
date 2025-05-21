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
    const { placa } = req.params;
    const { 
      fecha_vencimiento_soat, 
      fecha_vencimiento_tecnomecanica 
    } = req.body;

    console.log("📤 Solicitud PUT recibida:", { placa, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica }); // ✅ Log

    // ================================================
    // 2. ACTUALIZACIÓN EN BASE DE DATOS
    // ================================================
    const [result] = await pool.query(
      `UPDATE vehiculos 
      SET 
        fecha_vencimiento_soat = ?, 
        fecha_vencimiento_tecnomecanica = ? 
      WHERE placa = ?`,
      [fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica, placa]
    );

    console.log("Resultado de la actualización:", result);

    // Verificar si se afectó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    // ================================================
    // 3. REGISTRO DE NOTIFICACIÓN
    // ================================================
    const [vehiculo] = await pool.query(
      "SELECT id_vehiculo FROM vehiculos WHERE placa = ?",
      [placa]
    );

    if (!vehiculo.length) { // 👈 Validación crítica
      return res.status(404).json({ error: "Datos del vehículo inconsistentes" });
    }

     try {
      await crearNotificacion(
        'actualizacion',
        `Vehículo ${placa} actualizado`,
        vehiculo[0].id_vehiculo,
        'vehiculo'
      );
    } catch (notificacionError) {
      console.error("Error en notificación:", notificacionError);
    }

    // ================================================
    // 4. RESPUESTA EXITOSA
    // ================================================
    res.json({ 
      success: true,
      message: "Documentos actualizados correctamente",
      nuevos_valores: {
        soat: fecha_vencimiento_soat,
        tecnomecanica: fecha_vencimiento_tecnomecanica
      }
    });

  } catch (error) {
    // ================================================
    // 5. MANEJO DE ERRORES
    // ================================================
    console.error("Error en actualización:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      detalle: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};


// Eliminar vehículo del sistema
exports.eliminarVehiculo = async (req, res) => {
  try {
    const { placa } = req.params;

    // Buscar ID del vehículo
    const [vehiculo] = await pool.query("SELECT id_vehiculo FROM vehiculos WHERE placa = ?", [placa]);
    if (!vehiculo.length) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    const idVehiculo = vehiculo[0].id_vehiculo;

    // Verificar si hay despachos recientes (últimos 7 días)
    const [despachos] = await pool.query(`
      SELECT * FROM despachos 
      WHERE vehiculo_id = ? 
        AND fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `, [idVehiculo]);

    if (despachos.length > 0) {
      return res.status(400).json({ 
        error: "Este vehículo tiene despachos recientes y no puede eliminarse aún." 
      });
    }

    // Crear notificación antes de eliminar
    await crearNotificacion(
      'eliminacion',
      `Vehículo ${placa} eliminado`,
      idVehiculo,
      'vehiculo'
    );

    // Eliminar vehículo
    await pool.query("DELETE FROM vehiculos WHERE placa = ?", [placa]);
    
    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

