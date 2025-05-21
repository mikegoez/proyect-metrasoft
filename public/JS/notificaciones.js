document.addEventListener('DOMContentLoaded', () => {
    const filtro = document.getElementById('filtro-tipo');
    filtro.addEventListener('change', cargarNotificaciones);
    cargarNotificaciones();
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
        container.innerHTML = '';

        notificaciones.forEach(notif => {
            const wrapper = document.createElement('div');
            wrapper.className = `alert alert-${getAlertType(notif.tipo)} ${notif.estado === 'pendiente' ? 'alert-unread' : ''}`;

            const content = `
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-${getAlertType(notif.tipo)}">${notif.tipo.toUpperCase()}</span>
                            <small class="text-muted">${notif.fecha}</small>
                        </div>
                        <p class="mb-1">${notif.mensaje}</p>
                        <small class="text-muted">${notif.usuario_email ? `Registrado por: ${notif.usuario_email}` : 'Notificación del sistema'}</small>
                        ${notif.entidad_id ? `<small class="d-block mt-1">ID relacionado: ${notif.entidad_id}</small>` : ''}
                    </div>
                    <div class="btn-group-vertical">
                        ${notif.estado === 'pendiente' ? `<button class="btn btn-sm btn-outline-success" data-id="${notif.id}" data-action="leer" title="Marcar como leída"><i class="bi bi-check2-all"></i></button>` : ''}
                        <button class="btn btn-sm btn-outline-danger" data-id="${notif.id}" data-action="eliminar" title="Eliminar"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            `;

            wrapper.innerHTML = content;
            container.appendChild(wrapper);
        });

        // Delegación de eventos
        container.querySelectorAll('button[data-action]').forEach(btn => {
            const id = btn.dataset.id;
            const action = btn.dataset.action;

            if (action === 'leer') {
                btn.addEventListener('click', () => marcarLeida(id));
            } else if (action === 'eliminar') {
                btn.addEventListener('click', () => eliminarNotificacion(id));
            }
        });

    } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> Error al cargar notificaciones
            </div>
        `;
    }
}

function getAlertType(tipo) {
    const types = {
        vencimiento: 'warning',
        creacion: 'success',
        eliminacion: 'danger',
        actualizacion: 'info'
    };
    return types[tipo] || 'primary';
}

async function marcarLeida(id) {
    try {
        const token = localStorage.getItem('jwt');
        await fetch(`/api/notificaciones/${id}/leer`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        cargarNotificaciones();
    } catch {
        alert('Error al marcar como leída');
    }
}

async function eliminarNotificacion(id) {
    if (!confirm('¿Eliminar esta notificación permanentemente?')) return;

    try {
        const token = localStorage.getItem('jwt');
        await fetch(`/api/notificaciones/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        cargarNotificaciones();
    } catch {
        alert('Error al eliminar');
    }
}