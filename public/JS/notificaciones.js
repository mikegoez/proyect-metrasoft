document.addEventListener('DOMContentLoaded', cargarNotificaciones);

async function cargarNotificaciones() {
    const container = document.getElementById('notificaciones-container');
    const tipo = document.getElementById('filtro-tipo').value;
    const url = tipo ? `/api/notificaciones?tipo=${tipo}` : '/api/notificaciones';

    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al cargar');
        const notificaciones = await response.json();

        container.innerHTML = notificaciones.map(notif => `
            <div class="alert alert-${getAlertType(notif.tipo)} ${notif.estado === 'pendiente' ? 'alert-unread' : ''}">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-${getAlertType(notif.tipo)}">
                                ${notif.tipo.toUpperCase()}
                            </span>
                            <small class="text-muted">${notif.fecha}</small>
                        </div>
                        <p class="mb-1">${notif.mensaje}</p>
                        ${notif.usuario_email ? 
                            `<small class="text-muted">Registrado por: ${notif.usuario_email}</small>` : 
                            '<small class="text-muted">Notificación del sistema</small>'}
                        ${notif.entidad_id ? 
                            `<small class="d-block mt-1">ID relacionado: ${notif.entidad_id}</small>` : ''}
                    </div>
                    <div class="btn-group-vertical">
                        ${notif.estado === 'pendiente' ? `
                            <button class="btn btn-sm btn-outline-success" 
                                    onclick="marcarLeida(${notif.id})"
                                    title="Marcar como leída">
                                <i class="bi bi-check2"></i>
                            </button>` : ''}
                        <button class="btn btn-sm btn-outline-danger" 
                                onclick="eliminarNotificacion(${notif.id})"
                                title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> Error al cargar notificaciones
            </div>
        `;
    }
}

// Funciones auxiliares
function getAlertType(tipo) {
    const types = {
        vencimiento: 'warning',
        creacion: 'success',
        eliminacion: 'danger',
        actualizacion: 'info'
    };
    return types[tipo] || 'primary';
}

window.marcarLeida = async (id) => {
    try {
        const token = localStorage.getItem('jwt');
        await fetch(`/api/notificaciones/${id}/leer`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        cargarNotificaciones();
    } catch (error) {
        alert('Error al marcar como leída');
    }
};

window.eliminarNotificacion = async (id) => {
    if (!confirm('¿Eliminar esta notificación permanentemente?')) return;
    
    try {
        const token = localStorage.getItem('jwt');
        await fetch(`/api/notificaciones/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        cargarNotificaciones();
    } catch (error) {
        alert('Error al eliminar');
    }
};

window.recargarNotificaciones = () => {
    cargarNotificaciones();
    alert('Notificaciones actualizadas');
};