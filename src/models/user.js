const db = require('../config/db'); // Asegúrate de que la ruta sea correcta
const bcrypt = require('bcrypt');

class User {
    // Crear un usuario
    static async create(correo_electronico, contraseña_hash, rol = 'usuario') {
        try {
            console.log('Creando usuario con:', { correo_electronico, contraseña_hash, rol });
            const sql = 'INSERT INTO usuarios (correo_electronico, contraseña_hash, rol) VALUES (?, ?, ?)';
            console.log('SQL:', sql);
            const [result] = await db.pool.promise().execute(sql, [correo_electronico, contraseña_hash, rol]);
            console.log('Resultado de la inserción:', result);
            return result.insertId;
        } catch (error) {
            console.error('Error en User.create:', error);
            throw error;
        }
    }

    // Buscar un usuario por correo electrónico
    static async findByEmail(correo_electronico) {
        try {
            const sql = 'SELECT * FROM usuarios WHERE correo_electronico = ?';
            const [rows] = await db.pool.promise().execute(sql, [correo_electronico]);
            return rows[0];
        } catch (error) {
            console.error('Error en User.findByEmail:', error);
            throw error;
        }
    }

    // Buscar un usuario por ID
    static async findById(id_usuario) {
        try {
            const sql = 'SELECT * FROM usuarios WHERE id_usuario = ?';
            const [rows] = await db.pool.promise().execute(sql, [id_usuario]);
            return rows[0];
        } catch (error) {
            console.error('Error en User.findById:', error);
            throw error;
        }
    }

    // Comparar contraseñas
    static async comparePassword(contraseña, contraseña_hash) {
        return await bcrypt.compare(contraseña, contraseña_hash);
    }

    // Actualizar token de restablecimiento de contraseña
    static async updateResetToken(id_usuario, token_reset, token_expira) {
        try {
            const sql = 'UPDATE usuarios SET token_reset = ?, token_expira = ? WHERE id_usuario = ?';
            const [result] = await db.pool.promise().execute(sql, [token_reset, token_expira, id_usuario]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en User.updateResetToken:', error);
            throw error;
        }
    }
}

module.exports = User;