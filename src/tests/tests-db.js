const pool = require("../src/config/db"); // Ruta relativa correcta

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión exitosa a MySQL");
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    process.exit(1);
  }
})();