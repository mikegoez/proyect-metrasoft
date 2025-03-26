const db = require('../config/db');

class Vehiculo {
    // Crear un vehículo
    static async create({ placa, marca, modelo, ano, capacidad, tipo_carga, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica }) {
        const sql = `
            INSERT INTO vehiculos (placa, marca, modelo, ano, capacidad, tipo_carga, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.pool.promise().execute(sql, [
            placa,
            marca,
            modelo,
            ano,
            capacidad,
            tipo_carga,
            fecha_vencimiento_soat,
            fecha_vencimiento_tecnomecanica
        ]);
        return result.insertId;
    }

    // Obtener todos los vehículos
    static async findAll() {
        const sql = 'SELECT * FROM vehiculos';
        const [rows] = await db.pool.promise().execute(sql);
        return rows;
    }

    // Obtener un vehículo por ID
    static async findById(id_vehiculo) {
        const sql = 'SELECT * FROM vehiculos WHERE id_vehiculo = ?';
        const [rows] = await db.pool.promise().execute(sql, [id_vehiculo]);
        return rows[0];
    }

    // Actualizar un vehículo
    static async update(id_vehiculo, camposActualizados) {
        try {
            // Crear la consulta SQL dinámicamente
            const keys = Object.keys(camposActualizados);
            const values = Object.values(camposActualizados);
            const setClause = keys.map(key => `${key} = ?`).join(', ');

            const sql = `UPDATE vehiculos SET ${setClause} WHERE id_vehiculo = ?`;
            const [result] = await db.pool.promise().execute(sql, [...values, id_vehiculo]);

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Vehiculo.update:', error);
            throw error;
        }
    }

    // Eliminar un vehículo
    static async delete(id_vehiculo) {
        const sql = 'DELETE FROM vehiculos WHERE id_vehiculo = ?';
        const [result] = await db.pool.promise().execute(sql, [id_vehiculo]);
        return result.affectedRows > 0;
    }
}

module.exports = Vehiculo;