// Generar código consecutivo DSP-0001
const pool = require("../config/db")
exports.generarCodigoConsecutivo = async () => {
    try {
        const [result] = await pool.query("SELECT MAX(id_despacho) AS last_id FROM despachos");
        const lastId = result[0].last_id ? result[0].last_id : 0; // Manejar NULL
        const nextId = lastId + 1;
        return `DSP-${String(nextId).padStart(4, '0')}`;
    } catch (error) {
        throw new Error("Error generando código: " + error.message);
    }
};