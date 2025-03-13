const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Rutas de usuarios
const vehiculosRoutes = require('./routes/vehiculosRoutes'); // Rutas de vehículos
const conductoresRoutes = require('./routes/conductoresRoutes'); // Rutas de conductores
const despachosRoutes = require('./routes/despachosRoutes'); // Rutas de despachos
const actualizacionesRoutes = require('./routes/actualizacionesRoutes'); // Rutas de actualizaciones
const app = express();

app.use(express.json()); // Para parsear el cuerpo de las solicitudes JSON

// Usar las rutas
app.use('/usuarios', userRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/conductores', conductoresRoutes);
app.use('/despachos', despachosRoutes);
app.use('/actualizaciones', actualizacionesRoutes);

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});