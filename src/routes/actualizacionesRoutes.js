const express = require('express');
const db = require('../models/DB');
const router = express.Router();

// Crear una actualización
router.post('/', (req, res) => {
    const { usuario_id, tabla_actualizada, registro_id, campo, valor_anterior, valor_nuevo } = req.body;

    db.query(`
        INSERT INTO actualizaciones (usuario_id, tabla_actualizada, registro_id, campo, valor_anterior, valor_nuevo)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [usuario_id, tabla_actualizada, registro_id, campo, valor_anterior, valor_nuevo], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear la actualización' });
        }
        res.json({ mensaje: 'Actualización creada', id: resultados.insertId });
    });
});

// Obtener todas las actualizaciones
router.get('/', (req, res) => {
    db.query('SELECT * FROM actualizaciones', (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener las actualizaciones' });
        }
        res.json(resultados);
    });
});

// Obtener una actualización por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM actualizaciones WHERE id_actualizacion = ?', [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener la actualización' });
        }
        res.json(resultados[0]);
    });
});

// Eliminar una actualización
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM actualizaciones WHERE id_actualizacion = ?', [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar la actualización' });
        }
        res.json({ mensaje: 'Actualización eliminada' });
    });
});

module.exports = router;