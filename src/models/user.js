const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    // Crear un usuario
    static async create(correo_electronico, contraseña_hash, rol = 'usuario') {
        try {
            console.log('Creando usuario con:', { correo_electronico, contraseña_hash, rol });
            const sql = 'INSERT INTO usuarios (correo_electronico, authentication_string, rol) VALUES (?, ?, ?)';
            const [result] = await db.pool.promise().execute(sql, [correo_electronico, contraseña_hash, rol]);
            console.log('Usuario creado con ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('Error en User.create:', error);
            throw error;
        }
    }

    // Buscar usuario por email
    static async findByEmail(correo_electronico) {
        try {
            const sql = 'SELECT id_usuario, correo_electronico, authentication_string AS contraseña_hash, rol FROM usuarios WHERE correo_electronico = ?';
            const [rows] = await db.pool.promise().execute(sql, [correo_electronico]);
            console.log('Usuario encontrado:', rows[0] ? 'Sí' : 'No');
            return rows[0];
        } catch (error) {
            console.error('Error en User.findByEmail:', error);
            throw error;
        }
    }

    // Buscar usuario por ID
    static async findById(id_usuario) {
        try {
            const sql = 'SELECT id_usuario, correo_electronico, authentication_string AS contraseña_hash, rol FROM usuarios WHERE id_usuario = ?';
            const [rows] = await db.pool.promise().execute(sql, [id_usuario]);
            return rows[0];
        } catch (error) {
            console.error('Error en User.findById:', error);
            throw error;
        }
    }

    // Comparar contraseñas (opcional, ahora se hace directamente en el controlador)
    static async comparePassword(contraseña, contraseña_hash) {
        try {
            return await bcrypt.compare(contraseña, contraseña_hash);
        } catch (error) {
            console.error('Error en comparación:', error);
            throw error;
        }
    }

    // Actualizar token de recuperación
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