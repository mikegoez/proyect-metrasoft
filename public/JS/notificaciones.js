// Función para cargar notificaciones dinámicamente (simulación)
document.addEventListener('DOMContentLoaded', function () {
    const notificaciones = []; // Array vacío para simular que no hay notificaciones
    const listaNotificaciones = document.getElementById('notificaciones');

    // Limpiar notificaciones existentes (si las hay)
    listaNotificaciones.innerHTML = '';

    if (notificaciones.length === 0) {
        // Mostrar el mensaje por defecto si no hay notificaciones
        const mensaje = document.createElement('p');
        mensaje.className = 'sin-notificaciones';
        mensaje.textContent = 'No hay notificaciones en este momento.';
        listaNotificaciones.appendChild(mensaje);
    } else {
        // Mostrar las notificaciones reales
        notificaciones.forEach(notificacion => {
            const div = document.createElement('div');
            div.className = `notificacion ${notificacion.tipo}`;
            div.innerHTML = `
                <h3>${notificacion.titulo}</h3>
                <p>${notificacion.mensaje}</p>
                <button class="btn-eliminar" onclick="eliminarNotificacion(this)">×</button>
            `;
            listaNotificaciones.appendChild(div);
        });
    }
});

// Función para eliminar una notificación
function eliminarNotificacion(boton) {
    const notificacion = boton.parentElement;
    notificacion.style.opacity = '0';
    setTimeout(() => {
        notificacion.remove();

        // Si no quedan notificaciones, mostrar el mensaje por defecto
        const listaNotificaciones = document.getElementById('notificaciones');
        if (listaNotificaciones.children.length === 0) {
            const mensaje = document.createElement('p');
            mensaje.className = 'sin-notificaciones';
            mensaje.textContent = 'No hay notificaciones en este momento.';
            listaNotificaciones.appendChild(mensaje);
        }
    }, 300);
}