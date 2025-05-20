// Funciones globales (ya deberían estar declaradas)
window.mostrarSeccion = function(seccion) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
};

// Mapeo de botones a secciones
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-crear").addEventListener("click", () => mostrarSeccion('crear'));

    document.getElementById("btn-consultar").addEventListener("click", () => mostrarSeccion('consultar'));

    document.getElementById("btn-actualizar").addEventListener("click", () => {
        mostrarSeccion('actualizar');
        cargarDocumentosActualizar();
    });
    
    document.getElementById("btn-eliminar").addEventListener("click", () => mostrarSeccion('eliminar'));   
    document.getElementById("form-crear").addEventListener('submit', crearConductor);
    document.getElementById("form-consultar").addEventListener("submit", consultarConductor);
    document.getElementById("form-eliminar").addEventListener("submit", eliminarConductor);

});


// Crear conductor
async function crearConductor(e) {
    e.preventDefault();
    const formData = {
        tipo_documento: e.target.tipo_documento.value,
        numero_documento: e.target.numero_documento.value,
        nombres: e.target.nombres.value,
        apellidos: e.target.apellidos.value,
        telefono: e.target.telefono.value,
        direccion: e.target.direccion.value,
        fecha_vencimiento_licencia: e.target.fecha_vencimiento_licencia.value
    };

    try {
        const response = await fetch('/api/conductores', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (response.ok) {
            mostrarNotificacion('🚗 Conductor registrado exitosamente!', 'success');
            e.target.reset();
        } else {
            mostrarNotificacion(`❌ Error: ${data.error}`, 'danger');
        }
    } catch (error) {
        mostrarNotificacion('🔥 Error de conexión', 'danger');
    }
}

// Consultar conductor
async function consultarConductor(e) {
    e.preventDefault();
    const formulario = e.target;
    const errorDiv = document.getElementById('error-consultar');

    if (!formulario.checkValidity()) {
        formulario.classList.add('was-validated');
        return;
    }

    const documento = document.getElementById('documento-consultar').value.trim().toUpperCase();
    try {
        const response = await fetch(`/api/conductores/${documento}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error en la consulta");
        }

        const conductor = await response.json();
        const resultado = document.getElementById('resultado-consultar');
        resultado.innerHTML = `
            <div class="alert alert-success">
                <p>Documento: ${conductor.numero_documento}</p>
                <p>Nombre: ${conductor.nombres} ${conductor.apellidos}</p>
                <p>Teléfono: ${conductor.telefono}</p>
                <p>Licencia vence: ${conductor.fecha_vencimiento_licencia}</p>
            </div>
        `;
        resultado.style.display = 'block';
        errorDiv.style.display = 'none';
    } catch (error) {
        mostrarNotificacion(`⚠️ ${error.message}`, 'danger');
    }
}

// Eliminar conductor
async function eliminarConductor(e) {
    e.preventDefault();
    const formulario = e.target;
    const errorDiv = document.getElementById('error-eliminar');

    if (!formulario.checkValidity()) {
        formulario.classList.add('was-validated');
        return;
    }

    const documento = document.getElementById('documento-eliminar').value.trim().toUpperCase();
    if (!confirm(`¿Eliminar conductor ${documento} permanentemente?`)) return;

    try {
        const response = await fetch(`/api/conductores/${documento}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al eliminar");
        }

        mostrarNotificacion('🗑️ Conductor eliminado correctamente', 'success');
        document.getElementById('documento-eliminar').value = '';
        errorDiv.style.display = 'none';
    } catch (error) {
        mostrarNotificacion(`⚠️ ${error.message}`, 'danger');
        errorDiv.style.display = 'block';
    }
}



// Función de notificaciones (asegúrate de tenerla)
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} alert-dismissible fade show mtr-notification`;
    notificacion.role = 'alert';
    notificacion.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.prepend(notificacion);
    
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => notificacion.remove(), 150);
    }, 3000);
}
