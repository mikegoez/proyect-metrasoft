function toggleNotificaciones() {
    const panel = document.getElementById('notificaciones-panel');
    panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('notificaciones-panel').style.display = 'none';
});
