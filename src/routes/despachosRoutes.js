const express = require('express');
const db = require('../models/DB');
const router = express.Router();

// Crear un despacho
router.post('/', (req, res) => {
    const { codigo_despacho, vehiculo_id, conductor_id, tipo_carga, destino, capacidad, fecha, hora, creado_por } = req.body;

    db.query(`
        INSERT INTO despachos (codigo_despacho, vehiculo_id, conductor_id, tipo_carga, destino, capacidad, fecha, hora, creado_por)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [codigo_despacho, vehiculo_id, conductor_id, tipo_carga, destino, capacidad, fecha, hora, creado_por], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el despacho' });
        }
        res.json({ mensaje: 'Despacho creado', id: resultados.insertId });
    });
});

// Obtener todos los despachos
router.get('/', (req, res) => {
    db.query('SELECT * FROM despachos', (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los despachos' });
        }
        res.json(resultados);
    });
});

// Obtener un despacho por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM despachos WHERE id_despacho = ?', [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el despacho' });
        }
        res.json(resultados[0]);
    });
});

// Actualizar un despacho
router.put('/:id', (req, res) => {
    const { destino, fecha } = req.body;
    const { id } = req.params;

    db.query(`
        UPDATE despachos
        SET destino = ?, fecha = ?
        WHERE id_despacho = ?
    `, [destino, fecha, id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el despacho' });
        }
        res.json({ mensaje: 'Despacho actualizado' });
    });
});

// Eliminar un despacho
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM despachos WHERE id_despacho = ?', [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el despacho' });
        }
        res.json({ mensaje: 'Despacho eliminado' });
    });
});

module.exports = router;