const pool = require("../config/db");

class Usuario {
  static async buscarPorEmail(correo_electronico) {
    const [rows] = await pool.query(
      'SELECT id_usuario, correo_electronico, contraseña_hash, rol FROM usuarios WHERE correo_electronico = ?', 
      [correo_electronico]
    );
    return rows[0];
  }

  static async crear(correo_electronico, contraseña_hash, rol) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (correo_electronico, contraseña_hash, rol) VALUES (?, ?, ?)',
      [correo_electronico, contraseña_hash, rol]
    );
    return result;
  }

  static async buscarPorToken(token) {
    const [rows] = await pool.query(
      'SELECT id_usuario, correo_electronico FROM usuarios WHERE token_reset = ? AND token_expira > NOW()',
      [token]
    );
    return rows[0];
  }

  static async guardarTokenReset(correo_electronico, token) {
    await pool.query(
      'UPDATE usuarios SET token_reset = ?, token_expira = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE correo_electronico = ?',
      [token, correo_electronico]
    );
  }

  static async actualizarContraseña(id_usuario, contraseña_hash) {
    await pool.query(
      'UPDATE usuarios SET contraseña_hash = ?, token_reset = NULL, token_expira = NULL WHERE id_usuario = ?',
      [contraseña_hash, id_usuario]
    );
  }
}

module.exports = Usuario;