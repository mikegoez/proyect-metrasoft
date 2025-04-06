const pool = require("../config/db");

class Usuario {
  static async crear(correo, contraseñaHash, rol) {
    const [result] = await pool.query(
      "INSERT INTO usuarios (correo_electronico, contraseña_hash, rol) VALUES (?, ?, ?)",
      [correo, contraseñaHash, rol]
    );
    return result.insertId;
  }

  static async buscarPorEmail(correo) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo_electronico = ?", [correo]);
    return rows[0];
  }
  static async guardarTokenReset(email, token) {
    const [result] = await pool.query(
      "UPDATE usuarios SET token_reset = ?, token_expira = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE correo_electronico = ?",
      [token, email]
    );
    return result.affectedRows > 0;
  }
  
  static async buscarPorToken(token) {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE token_reset = ? AND token_expira > NOW()",
      [token]
    );
    return rows[0];
  }
  
  static async actualizarContraseña(idUsuario, nuevaContraseñaHash) {
    const [result] = await pool.query(
      "UPDATE usuarios SET contraseña_hash = ?, token_reset = NULL, token_expira = NULL WHERE id_usuario = ?",
      [nuevaContraseñaHash, idUsuario]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Usuario;