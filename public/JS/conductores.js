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

// conductores.js - Agregar después de las otras funciones

async function cargarDocumentosActualizar() {
    try {
        const response = await fetch('/api/conductores', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const conductores = await response.json();
        
        const select = document.getElementById('documento-actualizar');
        select.innerHTML = '<option value="">Seleccione un documento...</option>';
        
        conductores.forEach(conductor => {
            const option = document.createElement('option');
            option.value = conductor.id_conductor; // Usar numero_documento en lugar de id si prefieres
            option.textContent = `${conductor.nombres} ${conductor.apellidos} - ${conductor.numero_documento}`;
            select.appendChild(option);
        });
    } catch (error) {
        mostrarNotificacion('Error cargando conductores', 'danger');
    }
}

async function cargarDatosActualizar() {
    const select = document.getElementById('documento-actualizar');
    const idConductor = select.value;
    
    if (!idConductor) {
        document.getElementById('formulario-actualizacion').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`/api/conductores/${idConductor}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const conductor = await response.json();
        
        const formulario = `
            <form id="form-actualizar" class="row g-3">
                <div class="col-md-12">
                    <label class="form-label">Nueva fecha de vencimiento</label>
                    <input type="date" class="form-control" id="fecha-actualizar" 
                           value="${conductor.fecha_vencimiento_licencia}" required>
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-primary w-100">
                        <i class="bi bi-save"></i> Actualizar
                    </button>
                </div>
            </form>
        `;
        
        const contenedor = document.getElementById('formulario-actualizacion');
        contenedor.innerHTML = formulario;
        contenedor.style.display = 'block';
        
        document.getElementById('form-actualizar').addEventListener('submit', actualizarConductor);
    } catch (error) {
        mostrarNotificacion('Error cargando datos', 'danger');
    }
}

async function actualizarConductor(e) {
    e.preventDefault();
    const idConductor = document.getElementById('documento-actualizar').value;
    const nuevaFecha = document.getElementById('fecha-actualizar').value;

    try {
        const response = await fetch(`/api/conductores/${idConductor}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ fecha_vencimiento_licencia: nuevaFecha })
        });

        const data = await response.json();
        
        if (response.ok) {
            mostrarNotificacion('✅ Licencia actualizada', 'success');
            document.getElementById('formulario-actualizacion').style.display = 'none';
        } else {
            mostrarNotificacion(`❌ Error: ${data.error}`, 'danger');
        }
    } catch (error) {
        mostrarNotificacion('🔥 Error de conexión', 'danger');
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
