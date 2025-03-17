const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    // Crear un usuario
    static async create(correo_electronico, contraseña_hash, rol = 'usuario') {
        const sql = 'INSERT INTO usuarios (correo_electronico, contraseña_hash, rol) VALUES (?, ?, ?)';
        const [result] = await db.promise().execute(sql, [correo_electronico, contraseña_hash, rol]);
        return result.insertId;
    }

    // Buscar un usuario por correo electrónico
    static async findByEmail(correo_electronico) {
        const sql = 'SELECT * FROM usuarios WHERE correo_electronico = ?';
        const [rows] = await db.promise().execute(sql, [correo_electronico]);
        return rows[0];
    }

    // Comparar contraseñas
    static async comparePassword(contraseña, contraseña_hash) {
        return await bcrypt.compare(contraseña, contraseña_hash);
    }

    // Actualizar token de restablecimiento de contraseña
    static async updateResetToken(id_usuario, token_reset, token_expira) {
        const sql = 'UPDATE usuarios SET token_reset = ?, token_expira = ? WHERE id_usuario = ?';
        const [result] = await db.promise().execute(sql, [token_reset, token_expira, id_usuario]);
        return result.affectedRows > 0;
    }
}

module.exports = User;s