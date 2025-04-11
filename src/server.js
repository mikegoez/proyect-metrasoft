const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
//importar rutas modulos
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const conductoresRoutes = require('./routes/conductoresRoutes');
const despachosRoutes = require('./routes/despachosRoutes');

app.use(cors());
app.use(express.json());

// Middleware para archivos estáticos (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, "../public")));

// Rutas API
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/conductores', conductoresRoutes);
app.use('/api/despachos', despachosRoutes);

// Redirección al login si no autenticado
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/login.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));