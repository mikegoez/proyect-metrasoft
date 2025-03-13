const express = require('express');
const db = require('../models/DB'); // Importa la conexión a la base de datos
const router = express.Router();

// Ruta para obtener todos los vehículos
router.get('/', (req, res) => {
    db.query('SELECT * FROM vehiculos', (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los vehículos' });
        }
        res.json(resultados);
    });
});

// Ruta para crear un vehículo
router.post('/', (req, res) => {
    const { placa, marca, modelo, ano, capacidad, tipo_carga, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica } = req.body;

    db.query(`
        INSERT INTO vehiculos (placa, marca, modelo, ano, capacidad, tipo_carga, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [placa, marca, modelo, ano, capacidad, tipo_carga, fecha_vencimiento_soat, fecha_vencimiento_tecnomecanica], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el vehículo' });
        }
        res.json({ mensaje: 'Vehículo creado', id: resultados.insertId });
    });
});

// Ruta para actualizar un vehículo
router.put('/:id', (req, res) => {
    const { marca, modelo } = req.body;
    const { id } = req.params;

    db.query(`
        UPDATE vehiculos
        SET marca = ?, modelo = ?
        WHERE id_vehiculo = ?
    `, [marca, modelo, id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el vehículo' });
        }
        res.json({ mensaje: 'Vehículo actualizado' });
    });
});

// Ruta para eliminar un vehículo
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query(`
        DELETE FROM vehiculos
        WHERE id_vehiculo = ?
    `, [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el vehículo' });
        }
        res.json({ mensaje: 'Vehículo eliminado' });
    });
});

module.exports = router;