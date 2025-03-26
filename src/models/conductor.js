const db = require('../config/db');

class Conductor {
    // Crear un conductor
    static async create({ tipo_documento, numero_documento, nombres, apellidos, telefono, direccion = null, foto_documento = null, foto_licencia = null, fecha_vencimiento_licencia }) {
        const sql = `
            INSERT INTO conductores (tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, foto_documento, foto_licencia, fecha_vencimiento_licencia)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.pool.promise().execute(sql, [
            tipo_documento,
            numero_documento,
            nombres,
            apellidos,
            telefono,
            direccion,
            foto_documento,
            foto_licencia,
            fecha_vencimiento_licencia
        ]);
        return result.insertId;
    }

    // Obtener todos los conductores
    static async findAll() {
        const sql = 'SELECT * FROM conductores';
        const [rows] = await db.pool.promise().execute(sql);
        return rows;
    }

    // Obtener un conductor por ID
    static async findById(id_conductor) {
        const sql = 'SELECT * FROM conductores WHERE id_conductor = ?';
        const [rows] = await db.pool.promise().execute(sql, [id_conductor]);
        return rows[0];
    }

    // Actualizar un conductor
    static async update(id_conductor, camposActualizados) {
        try {
            // Crear la consulta SQL dinámicamente
            const keys = Object.keys(camposActualizados);
            const values = Object.values(camposActualizados);
            const setClause = keys.map(key => `${key} = ?`).join(', ');

            const sql = `UPDATE conductores SET ${setClause} WHERE id_conductor = ?`;
            const [result] = await db.pool.promise().execute(sql, [...values, id_conductor]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Conductor.update:', error);
            throw error;
        }
    }

    // Eliminar un conductor
    static async delete(id_conductor) {
        const sql = 'DELETE FROM conductores WHERE id_conductor = ?';
        const [result] = await db.pool.promise().execute(sql, [id_conductor]);
        return result.affectedRows > 0;
    }
}

module.exports = Conductor;