const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middlewares/auth');


// Todas las rutas requieren autenticación JWT
router.get('/', authMiddleware.autenticarUsuario, async (req, res) => {
  try {
      // Obtener filtro de tipo desde query params
      const tipo = req.query.tipo; 
      // Construir query dinámica con JOIN a usuarios
      let query = `
          SELECT 
              n.id_notificacion AS id,
              n.mensaje,
              n.tipo,
              DATE_FORMAT(n.fecha, '%d/%m/%Y %H:%i') AS fecha,
              n.estado,
              n.entidad_id,
              u.correo_electronico AS usuario_email
          FROM notificaciones n
          LEFT JOIN usuarios u ON n.usuario_origen = u.id_usuario
          ${tipo ? 'WHERE n.tipo = ?' : ''}
          ORDER BY n.fecha DESC
      `;
      // Ejecutar consulta con parámetros seguros
      const [notificaciones] = await db.query(query, tipo ? [tipo] : []);
      res.json(notificaciones);
  } catch (error) {
      res.status(500).json({ error: "Error al obtener notificaciones" });
  }
});
// Marcar como leída
router.put('/:id/leer', authMiddleware.autenticarUsuario, async (req, res) => {
    try {
        await db.query(`
            UPDATE notificaciones 
            SET estado = 'leido' 
            WHERE id_notificacion = ?
        `, [req.params.id]); // Usar parámetro para prevenir inyecciones SQL

        res.sendStatus(204); // Respuesta exitosa sin contenido
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

// Eliminar notificación
router.delete('/:id', authMiddleware.autenticarUsuario, async (req, res) => {
    try {
        await db.query(`
            DELETE FROM notificaciones 
            WHERE id_notificacion = ?
        `, [req.params.id]);

        res.sendStatus(204);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

module.exports = router;