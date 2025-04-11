const pool = require("./config/db");

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión exitosa a MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
  }
})();