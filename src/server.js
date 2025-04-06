const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", require("./routes/authRoutes"));

// Middleware para archivos estáticos (HTML/CSS/JS)
app.use(express.static("public"));

// Redirección al login si no autenticado
app.get("*", (req, res) => {
  res.redirect("/HTML/login.html");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));