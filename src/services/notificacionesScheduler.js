const cron = require('node-cron');
const db = require('../config/db');
// Verificar documentos próximos a vencer
const checkDocuments = async () => {
    try {
        // Verificar SOAT y Tecnomecánica
        const [vehiculos] = await db.query(`
            SELECT 
                placa,
                DATEDIFF(fecha_vencimiento_soat, CURDATE()) AS dias_soat,
                DATEDIFF(fecha_vencimiento_tecnomecanica, CURDATE()) AS dias_tecnomecanica
            FROM vehiculos
            WHERE 
                fecha_vencimiento_soat BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
                OR fecha_vencimiento_tecnomecanica BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        `); // Solo documentos que vencerán en los próximos 30 días

        // Procesar cada vehículo con for...of para soportar await
        for (const v of vehiculos) {
            if (v.dias_soat <= 30) {
                await db.query(`
                    INSERT INTO notificaciones 
                    (mensaje, tipo, entidad_id)
                    VALUES (?, 'vencimiento', ?)
                `, [`Vehículo ${v.placa}: SOAT vence en ${v.dias_soat} días`, v.placa]);
            }
            if (v.dias_tecnomecanica <= 30) {
                await db.query(`
                    INSERT INTO notificaciones 
                    (mensaje, tipo, entidad_id)
                    VALUES (?, 'vencimiento', ?)
                `, [`Vehículo ${v.placa}: Tecnomecánica vence en ${v.dias_tecnomecanica} días`, v.placa]);
            }
        }

        // 2. Verificar licencias de conductores
        const [conductores] = await db.query(`
            SELECT 
                numero_documento,
                DATEDIFF(fecha_vencimiento_licencia, CURDATE()) AS dias_licencia
            FROM conductores
            WHERE fecha_vencimiento_licencia BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        `);

        for (const c of conductores) {
            await db.query(`
                INSERT INTO notificaciones 
                (mensaje, tipo, entidad_id)
                VALUES (?, 'vencimiento', ?)
            `, [`Conductor ${c.numero_documento}: Licencia vence en ${c.dias_licencia} días`, c.numero_documento]);
        }

        console.log('[Scheduler] Notificaciones generadas:', new Date().toISOString());
    } catch (error) {
        console.error('Error en scheduler:', error);
    }
};

// Función wrapper para manejo de errores
const iniciarScheduler = () => {
    // Programar ejecución diaria a las 8:00 AM
    cron.schedule('0 8 * * *', async () => {
        await checkDocuments();
    });
};
// Evitar ejecución en entorno de pruebas
if (process.env.NODE_ENV !== 'test') {
    iniciarScheduler();
}

module.exports = checkDocuments; // Para testing