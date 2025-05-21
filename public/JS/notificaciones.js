// Cargar notificaciones al ingresar al módulo
document.addEventListener('DOMContentLoaded', () => {
    cargarNotificaciones();

    // Asignar evento al selector de filtro
    const filtroTipo = document.getElementById('filtro-tipo');
    filtroTipo.addEventListener('change', cargarNotificaciones);

    // Delegación de eventos para botones dentro del contenedor de notificaciones
    const container = document.getElementById('notificaciones-container');
    container.addEventListener('click', async (event) => {
        const target = event.target;
        const button = target.closest('button');
        if (!button) return;

        const id = button.getAttribute('data-id');
        if (button.classList.contains('marcar-leida')) {
            await marcarLeida(id);
        } else if (button.classList.contains('eliminar-notificacion')) {
            await eliminarNotificacion(id);
        }
    });
});

async function cargarNotificaciones() {
    const container = document.getElementById('notificaciones-container');
    const tipo = document.getElementById('filtro-tipo').value;
    const url = tipo ? `/api/notificaciones?tipo=${tipo}` : '/api/notificaciones';

    const token = localStorage.getItem('jwt');
    if (!token) {
        container.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-shield-lock"></i> No estás autenticado. Por favor, inicia sesión.
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> Sesión expirada o token inválido. Inicia sesión nuevamente.
                </div>
            `;
            localStorage.removeItem('jwt');
            setTimeout(() => window.location.href = '/login.html', 3000);
            return;
        }

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
                            <button class="btn btn-sm btn-outline-success marcar-leida" 
                                    data-id="${notif.id}"
                                    title="Marcar como leída">
                                <i class="bi bi-check2-all"></i>
                            </button>` : ''}
                        <button class="btn btn-sm btn-outline-danger eliminar-notificacion" 
                                data-id="${notif.id}"
                                title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> Error al cargar notificaciones
            </div>
        `;
    }
}

// Determina el tipo de alerta según el tipo de notificación
function getAlertType(tipo) {
    const types = {
        vencimiento: 'warning',
        creacion: 'success',
        eliminacion: 'danger',
        actualizacion: 'info'
    };
    return types[tipo] || 'primary';  // Default a 'primary' si no coincide
}

// Función para marcar notificación como leída
async function marcarLeida(id) {
    try {
        const token = localStorage.getItem('jwt');
        await fetch(`/api/notificaciones/${id}/leer`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        cargarNotificaciones(); // Recarga la lista
    } catch (error) {
        alert('Error al marcar como leída');
    }
}

// Función para eliminar notificación
async function eliminarNotificacion(id) {
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
}
