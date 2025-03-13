const express = require('express');
const db = require('../models/DB');
const router = express.Router();

// Crear un conductor
router.post('/', (req, res) => {
    const { tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, foto_documento, foto_licencia, fecha_vencimiento_licencia } = req.body;

    db.query(`
        INSERT INTO conductores (tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, foto_documento, foto_licencia, fecha_vencimiento_licencia)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [tipo_documento, numero_documento, nombres, apellidos, telefono, direccion, foto_documento, foto_licencia, fecha_vencimiento_licencia], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el conductor' });
        }
        res.json({ mensaje: 'Conductor creado', id: resultados.insertId });
    });
});

// Obtener todos los conductores
router.get('/', (req, res) => {
    db.query('SELECT * FROM conductores', (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los conductores' });
        }
        res.json(resultados);
    });
});

// Obtener un conductor por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM conductores WHERE id_conductor = ?', [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el conductor' });
        }
        res.json(resultados[0]);
    });
});

// Actualizar un conductor
router.put('/:id', (req, res) => {
    const { telefono, direccion } = req.body;
    const { id } = req.params;

    db.query(`
        UPDATE conductores
        SET telefono = ?, direccion = ?
        WHERE id_conductor = ?
    `, [telefono, direccion, id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el conductor' });
        }
        res.json({ mensaje: 'Conductor actualizado' });
    });
});

// Eliminar un conductor
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM conductores WHERE id_conductor = ?', [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el conductor' });
        }
        res.json({ mensaje: 'Conductor eliminado' });
    });
});

module.exports = router;