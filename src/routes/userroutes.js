const express = require('express');
const db = require('../models/DB');
const router = express.Router();
const bcrypt = require('bcrypt');

// Crear un usuario
router.post('/', (req, res) => {
    const { correo_electronico, contraseña, nombre } = req.body;
    const contraseña_hash = bcrypt.hashSync(contraseña, 10);

    db.query(`
        INSERT INTO usuarios (correo_electronico, contraseña_hash, nombre)
        VALUES (?, ?, ?)
    `, [correo_electronico, contraseña_hash, nombre], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el usuario' });
        }
        res.json({ mensaje: 'Usuario creado', id: resultados.insertId });
    });
});

// Obtener todos los usuarios
router.get('/', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
        res.json(resultados);
    });
});

// Actualizar un usuario
router.put('/:id', (req, res) => {
    const { nombre } = req.body;
    const { id } = req.params;

    db.query(`
        UPDATE usuarios
        SET nombre = ?
        WHERE id_usuario = ?
    `, [nombre, id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
        res.json({ mensaje: 'Usuario actualizado' });
    });
});

// Eliminar un usuario
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query(`
        DELETE FROM usuarios
        WHERE id_usuario = ?
    `, [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
        res.json({ mensaje: 'Usuario eliminado' });
    });
});

module.exports = router;