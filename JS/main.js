// main.js

document.addEventListener('DOMContentLoaded', function() {
    // Simulación de conteo de vehículos y conductores
    document.getElementById('vehiculos-count').innerText = 0; // Puedes reemplazar esto con una llamada a la API
    document.getElementById('conductores-count').innerText = 0; // Lo mismo aquí
});
// notificaciones
// Función para mostrar/ocultar el panel de notificaciones
function toggleNotificaciones() {
    const panel = document.getElementById('notificaciones-panel');
    panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
}

// Inicializa el panel de notificaciones como oculto
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('notificaciones-panel').style.display = 'none';
});
