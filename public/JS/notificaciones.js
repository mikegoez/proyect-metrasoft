document.addEventListener('DOMContentLoaded', () => {
    const notificationsContainer = document.getElementById('notifications-list');
    
    // Cargar notificaciones
    function loadNotifications() {
        fetch('/api/notificaciones')
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    renderNotifications(data.data);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Renderizar notificaciones
    function renderNotifications(notifications) {
        notificationsContainer.innerHTML = '';
        
        notifications.forEach(notif => {
            const alertType = getAlertType(notif.tipo);
            const isNew = notif.estado === 'pendiente';
            
            const notificationElement = document.createElement('div');
            notificationElement.className = `alert ${alertType} d-flex justify-content-between align-items-center`;
            notificationElement.innerHTML = `
                <div>
                    <h5 class="alert-heading">${getIcon(notif.tipo)} ${notif.tipo.toUpperCase()}</h5>
                    <p class="mb-0">${notif.mensaje}</p>
                    <small class="text-muted">${new Date(notif.fecha).toLocaleDateString()}</small>
                </div>
                ${isNew ? `
                <button class="btn btn-sm btn-danger mark-as-read" data-id="${notif.id_notificacion}">
                    <i class="bi bi-x-lg"></i>
                </button>` : ''}
            `;
            
            notificationsContainer.appendChild(notificationElement);
        });

        // Agregar eventos a los botones
        document.querySelectorAll('.mark-as-read').forEach(button => {
            button.addEventListener('click', markAsRead);
        });
    }

    // Marcar como leído
    function markAsRead(e) {
        const notificationId = e.target.closest('button').dataset.id;
        
        fetch(`/api/notificaciones/${notificationId}`, {
            method: 'PUT'
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                e.target.closest('.alert').remove();
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Helpers
    function getAlertType(tipo) {
        const types = {
            vencimiento: 'alert-warning',
            creacion: 'alert-success',
            eliminacion: 'alert-danger',
            actualizacion: 'alert-info'
        };
        return types[tipo] || 'alert-primary';
    }

    function getIcon(tipo) {
        const icons = {
            vencimiento: 'bi-exclamation-triangle',
            creacion: 'bi-check-circle',
            eliminacion: 'bi-trash',
            actualizacion: 'bi-arrow-clockwise'
        };
        return `<i class="bi ${icons[tipo]}"></i>`;
    }

    // Cargar inicial
    loadNotifications();
    
    // Actualizar cada 5 minutos
    setInterval(loadNotifications, 300000);
});