document.addEventListener('DOMContentLoaded', function () {
    // Inicialización
    inicializarPanelNotificaciones();
    cargarContadores(); // Simulación de carga de datos
});

// Función para inicializar el panel de notificaciones
function inicializarPanelNotificaciones() {
    const panel = document.getElementById('notificaciones-panel');
    panel.style.display = 'none'; // Ocultar el panel por defecto

    // Cargar notificaciones al abrir el panel
    document.getElementById('btn-notificaciones').addEventListener('click', function () {
        if (panel.style.display === 'none') {
            cargarNotificaciones(); // Cargar notificaciones dinámicamente
        }
        panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
    });
}

// Función para cargar notificaciones dinámicamente
function cargarNotificaciones() {
    const listaNotificaciones = document.getElementById('lista-notificaciones');
    listaNotificaciones.innerHTML = ''; // Limpiar notificaciones anteriores

    // Simulación de una llamada a una API o base de datos
    const notificaciones = obtenerNotificacionesDesdeBackend();

    if (notificaciones.length === 0) {
        // Mostrar mensaje si no hay notificaciones
        listaNotificaciones.innerHTML = '<p class="sin-notificaciones">No tienes notificaciones nuevas.</p>';
    } else {
        // Mostrar notificaciones
        notificaciones.forEach(notificacion => {
            const div = document.createElement('div');
            div.className = 'notificacion';
            div.innerHTML = `
                <h4>${notificacion.titulo}</h4>
                <p>${notificacion.mensaje}</p>
            `;
            listaNotificaciones.appendChild(div);
        });
    }
}

// Función para simular la obtención de notificaciones desde un backend
function obtenerNotificacionesDesdeBackend() {
    // Simulación de datos (se va reemplazar esto con una llamada a una API real)
    return [
        { titulo: 'SOAT próximo a vencer', mensaje: 'Placa: XYZ123 - Fecha de vencimiento: 2023-11-25' },
        { titulo: 'Vehículo registrado exitosamente', mensaje: 'Placa: ABC456' }
    ];
}

// Función para cargar los contadores de vehículos y conductores
function cargarContadores() {
    // Simulación de datos (se va a reemplazar esto con una llamada a una API real)
    const totalVehiculos = 15; // Ejemplo: 15 vehículos registrados
    const totalConductores = 8; // Ejemplo: 8 conductores registrados

    // Actualizar los contadores en la interfaz
    document.getElementById('vehiculos-count').innerText = totalVehiculos;
    document.getElementById('conductores-count').innerText = totalConductores;
}