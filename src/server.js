const express = require('express');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const VehiculoRoutes = require('./routes/vehiculoRoutes');
const conductorRoutes = require('./routes/conductorRoutes');
const despachoRoutes = require('./routes/despachoRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');
const actualizacionRoutes = require('./routes/actualizacionRoutes');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas
app.use('/api/users', userRoutes);
app.use('/api/Vehiculos', VehiculoRoutes);
app.use('/api/conductores', conductorRoutes);
app.use('/api/despachos', despachoRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/actualizaciones', actualizacionRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});