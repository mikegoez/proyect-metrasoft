const db = require('../config/db');

class Notificacion {
    // Crear una notificación
    static async create(usuario_id, mensaje, tipo, estado = 'pendiente') {
        const sql = `
            INSERT INTO notificaciones (usuario_id, mensaje, tipo, estado)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.promise().execute(sql, [usuario_id, mensaje, tipo, estado]);
        return result.insertId;
    }

    // Obtener todas las notificaciones
    static async findAll() {
        const sql = 'SELECT * FROM notificaciones';
        const [rows] = await db.promise().execute(sql);
        return rows;
    }

    // Obtener una notificación por ID
    static async findById(id_notificacion) {
        const sql = 'SELECT * FROM notificaciones WHERE id_notificacion = ?';
        const [rows] = await db.promise().execute(sql, [id_notificacion]);
        return rows[0];
    }

    // Actualizar el estado de una notificación
    static async updateEstado(id_notificacion, estado) {
        const sql = 'UPDATE notificaciones SET estado = ? WHERE id_notificacion = ?';
        const [result] = await db.promise().execute(sql, [estado, id_notificacion]);
        return result.affectedRows > 0;
    }

    // Eliminar una notificación
    static async delete(id_notificacion) {
        const sql = 'DELETE FROM notificaciones WHERE id_notificacion = ?';
        const [result] = await db.promise().execute(sql, [id_notificacion]);
        return result.affectedRows > 0;
    }
}

module.exports = Notificacion;