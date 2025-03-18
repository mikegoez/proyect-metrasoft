const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'metrasoft',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('error', (err) => {
  console.error('Error en el pool de conexiones:', err);
});

const initializeDatabase = async () => {
  const connection = await pool.promise().getConnection();

  try {
    console.log('Conexión exitosa a la base de datos');

    // Crear tabla usuarios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario BIGINT PRIMARY KEY AUTO_INCREMENT,
        correo_electronico VARCHAR(50) NOT NULL UNIQUE,
        contraseña_hash VARCHAR(255) NOT NULL,
        rol ENUM('admin', 'usuario') DEFAULT 'usuario',
        token_reset VARCHAR(255),
        token_expira DATETIME
      );
    `);
    console.log('Tabla "usuarios" creada exitosamente');

    // Crear tabla vehiculos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vehiculos (
        id_vehiculo BIGINT PRIMARY KEY AUTO_INCREMENT,
        placa VARCHAR(10) NOT NULL UNIQUE,
        marca VARCHAR(50) NOT NULL,
        modelo VARCHAR(50) NOT NULL,
        ano YEAR NOT NULL,
        capacidad INT NOT NULL,
        tipo_carga ENUM('pasajeros', 'paqueteria', 'mixta') NOT NULL,
        fecha_vencimiento_soat DATE NOT NULL,
        fecha_vencimiento_tecnomecanica DATE NOT NULL,
        foto_soat LONGBLOB,
        foto_tecnomecanica LONGBLOB
      );
    `);
    console.log('Tabla "vehiculos" creada exitosamente');

    // Crear tabla conductores
    await connection.query(`
      CREATE TABLE IF NOT EXISTS conductores (
        id_conductor BIGINT PRIMARY KEY AUTO_INCREMENT,
        tipo_documento ENUM('CC', 'CE', 'pasaporte') NOT NULL,
        numero_documento VARCHAR(20) NOT NULL UNIQUE,
        nombres VARCHAR(50) NOT NULL,
        apellidos VARCHAR(50) NOT NULL,
        telefono VARCHAR(15) NOT NULL,
        direccion VARCHAR(100),
        foto_documento LONGBLOB,
        foto_licencia LONGBLOB,
        fecha_vencimiento_licencia DATE NOT NULL
      );
    `);
    console.log('Tabla "conductores" creada exitosamente');

    // Crear tabla despachos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS despachos (
        id_despacho BIGINT PRIMARY KEY AUTO_INCREMENT,
        codigo_despacho VARCHAR(20) NOT NULL UNIQUE,
        vehiculo_id BIGINT NOT NULL,
        conductor_id BIGINT NOT NULL,
        tipo_carga ENUM('masivo_pasajeros', 'paqueteria', 'mixta') NOT NULL,
        destino VARCHAR(100) NOT NULL,
        capacidad INT NOT NULL,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        creado_por BIGINT,
        FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id_vehiculo) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (conductor_id) REFERENCES conductores(id_conductor) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (creado_por) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
      );
    `);
    console.log('Tabla "despachos" creada exitosamente');

    // Crear tabla notificaciones
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id_notificacion BIGINT PRIMARY KEY AUTO_INCREMENT,
        usuario_id BIGINT,
        mensaje VARCHAR(255) NOT NULL,
        tipo ENUM('vencimiento', 'creacion', 'eliminacion', 'actualizacion') NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        estado ENUM('pendiente', 'leido') DEFAULT 'pendiente',
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
      );
    `);
    console.log('Tabla "notificaciones" creada exitosamente');

    // Crear tabla actualizaciones
    await connection.query(`
      CREATE TABLE IF NOT EXISTS actualizaciones (
        id_actualizacion BIGINT PRIMARY KEY AUTO_INCREMENT,
        usuario_id BIGINT,
        tabla_actualizada ENUM('vehiculos', 'conductores', 'despachos') NOT NULL,
        registro_id BIGINT NOT NULL,
        campo VARCHAR(50) NOT NULL,
        valor_anterior VARCHAR(255),
        valor_nuevo VARCHAR(255),
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
      );
    `);
    console.log('Tabla "actualizaciones" creada exitosamente');

  } catch (err) {
    console.error('Error al crear las tablas:', err);
  } finally {
    // Liberar la conexión
    connection.release();
  }
};

module.exports = {
  pool: pool.promise(),
  initializeDatabase
};