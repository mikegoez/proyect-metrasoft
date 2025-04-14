const pool = require("../config/db");
// Generar código consecutivo DSP-0001
exports.generarCodigoConsecutivo = async () => {
    try {
         // Obtener el último ID registrado
        const [result] = await pool.query("SELECT MAX(id_despacho) AS last_id FROM despachos");
         // Manejar caso de tabla vacía (last_id = null)
        const lastId = result[0].last_id ? result[0].last_id : 0;
        // Calcular siguiente consecutivo
        const nextId = lastId + 1;
        // Formatear código con padding de ceros
        return `DSP-${String(nextId).padStart(4, '0')}`;
    } catch (error) {
        throw new Error("Error generando código: " + error.message);
    }
};