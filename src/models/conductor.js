const db = require('../config/db');

class Conductor {
    // Crear un conductor
    static async create(tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, foto_documento, foto_licencia, fecha_vencimiento_licencia) {
        const sql = `
            INSERT INTO conductores (tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, foto_documento, foto_licencia, fecha_vencimiento_licencia)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.promise().execute(sql, [tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, foto_documento, foto_licencia, fecha_vencimiento_licencia]);
        return result.insertId;
    }

    // Obtener todos los conductores
    static async findAll() {
        const sql = 'SELECT * FROM conductores';
        const [rows] = await db.promise().execute(sql);
        return rows;
    }

    // Obtener un conductor por ID
    static async findById(id_conductor) {
        const sql = 'SELECT * FROM conductores WHERE id_conductor = ?';
        const [rows] = await db.promise().execute(sql, [id_conductor]);
        return rows[0];
    }

    // Actualizar un conductor
    static async update(id_conductor, telefono, direccion) {
        const sql = 'UPDATE conductores SET telefono = ?, direccion = ? WHERE id_conductor = ?';
        const [result] = await db.promise().execute(sql, [telefono, direccion, id_conductor]);
        return result.affectedRows > 0;
    }

    // Eliminar un conductor
    static async delete(id_conductor) {
        const sql = 'DELETE FROM conductores WHERE id_conductor = ?';
        const [result] = await db.promise().execute(sql, [id_conductor]);
        return result.affectedRows > 0;
    }
}

module.exports = Conductor;