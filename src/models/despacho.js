const db = require('../config/db');

class Despacho {
    // Crear un despacho
    static async create(codigo_despacho, vehiculo_id, conductor_id, tipo_carga, destino, capacidad, fecha, hora, creado_por) {
        const sql = `
            INSERT INTO despachos (codigo_despacho, vehiculo_id, conductor_id, tipo_carga, destino, capacidad, fecha, hora, creado_por)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.promise().execute(sql, [codigo_despacho, vehiculo_id, conductor_id, tipo_carga, destino, capacidad, fecha, hora, creado_por]);
        return result.insertId;
    }

    // Obtener todos los despachos
    static async findAll() {
        const sql = 'SELECT * FROM despachos';
        const [rows] = await db.promise().execute(sql);
        return rows;
    }

    // Obtener un despacho por ID
    static async findById(id_despacho) {
        const sql = 'SELECT * FROM despachos WHERE id_despacho = ?';
        const [rows] = await db.promise().execute(sql, [id_despacho]);
        return rows[0];
    }

    // Actualizar un despacho
    static async update(id_despacho, destino, fecha) {
        const sql = 'UPDATE despachos SET destino = ?, fecha = ? WHERE id_despacho = ?';
        const [result] = await db.promise().execute(sql, [destino, fecha, id_despacho]);
        return result.affectedRows > 0;
    }

    // Eliminar un despacho
    static async delete(id_despacho) {
        const sql = 'DELETE FROM despachos WHERE id_despacho = ?';
        const [result] = await db.promise().execute(sql, [id_despacho]);
        return result.affectedRows > 0;
    }
}

module.exports = Despacho;