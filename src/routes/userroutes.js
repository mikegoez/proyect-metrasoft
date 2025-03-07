const express = require('express');
const router = express.Router();
const connection = require('../models/db'); // Corregir la ruta

// Ruta para registrar un nuevo usuario
router.post('/registrar', (req, res) => {
    const { nombre, email, contrasedia } = req.body;

    const query = 'INSERT INTO usuarios (nombre, email, contrasedia) VALUES (?, ?, ?)';
    connection.query(query, [nombre, email, contrasedia], (err, results) => {
        if (err) {
            console.error('Error insertando datos:', err);
            res.status(500).send('Error al registrar el usuario'); // Cambiar 360 a 500
            return;
        }
        res.status(200).send('Usuario registrado con éxito'); // Cambiar 360 a 200
    });
});

module.exports = router;