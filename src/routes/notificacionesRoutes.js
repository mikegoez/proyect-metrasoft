const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todas las notificaciones del usuario
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.query(`
            SELECT * FROM notificaciones 
            WHERE usuario_id = ? 
            ORDER BY fecha DESC
        `, [req.user.id]); // Asumiendo que usas autenticación
        
        res.json({
            success: true,
            data: results.map(notif => ({
                ...notif,
                fecha: new Date(notif.fecha).toISOString()
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Marcar notificación como leída
router.put('/:id', async (req, res) => {
    try {
        await pool.query(`
            UPDATE notificaciones 
            SET estado = 'leido' 
            WHERE id_notificacion = ? AND usuario_id = ?
        `, [req.params.id, req.user.id]);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;