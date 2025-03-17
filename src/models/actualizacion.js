const db = require('../config/db');

class Actualizacion {
    // Crear una actualización
    static async create(usuario_id, tabla_actualizada, registro_id, campo, valor_anterior, valor_nuevo) {
        const sql = `
            INSERT INTO actualizaciones (usuario_id, tabla_actualizada, registro_id, campo, valor_anterior, valor_nuevo)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.promise().execute(sql, [usuario_id, tabla_actualizada, registro_id, campo, valor_anterior, valor_nuevo]);
        return result.insertId;
    }

    // Obtener todas las actualizaciones
    static async findAll() {
        const sql = 'SELECT * FROM actualizaciones';
        const [rows] = await db.promise().execute(sql);
        return rows;
    }

    // Obtener una actualización por ID
    static async findById(id_actualizacion) {
        const sql = 'SELECT * FROM actualizaciones WHERE id_actualizacion = ?';
        const [rows] = await db.promise().execute(sql, [id_actualizacion]);
        return rows[0];
    }

    // Eliminar una actualización
    static async delete(id_actualizacion) {
        const sql = 'DELETE FROM actualizaciones WHERE id_actualizacion = ?';
        const [result] = await db.promise().execute(sql, [id_actualizacion]);
        return result.affectedRows > 0;
    }
}

module.exports = Actualizacion;