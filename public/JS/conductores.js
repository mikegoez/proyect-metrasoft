// Funciones globales
window.mostrarSeccion = function(seccion) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
};

// Mapeo de botones a secciones
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-crear").addEventListener("click", () => mostrarSeccion('crear'));
    document.getElementById("btn-consultar").addEventListener("click", () => mostrarSeccion('consultar'));
    document.getElementById("btn-recargar").addEventListener("click", cargarDocumentosActualizar);

    document.getElementById("btn-actualizar").addEventListener("click", () => {
        mostrarSeccion('actualizar');
        cargarDocumentosActualizar();
    });
    document.getElementById("btn-eliminar").addEventListener("click", () => mostrarSeccion('eliminar'));

    // Listeners para formularios
    document.getElementById("form-crear").addEventListener("submit", crearConductor);
    document.getElementById("form-consultar").addEventListener("submit", consultarConductor);
    document.getElementById("form-eliminar").addEventListener("submit", eliminarConductor);

    document.getElementById('documento-actualizar').addEventListener('change', async (e) => {
        const documento = e.target.value;
        if (!documento) return;

        try {
            const response = await fetch(`/api/conductores/${documento}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (!response.ok) throw new Error('Error cargando conductor');
            
            const conductor = await response.json();
            mostrarFormularioActualizacion(conductor);
        } catch (error) {
            mostrarNotificacion(error.message, 'danger');
        }
    });
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

// Funciones auxiliares
async function cargarDocumentosActualizar() {
    try {
        const response = await fetch('/api/conductores', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (!response.ok) throw new Error('Error cargando documentos');
        
        const conductores = await response.json();
        const dropdown = document.getElementById('documento-actualizar');
        
        dropdown.innerHTML = '<option value="">Seleccione un documento...</option>';
        conductores.forEach(conductor => {
            const option = document.createElement('option');
            option.value = conductor.numero_documento;
            option.textContent = conductor.numero_documento;
            dropdown.appendChild(option);
        });
        
    } catch (error) {
        mostrarNotificacion(`Error: ${error.message}`, 'danger');
        console.error("Error carga documentos:", error);
    }
}

function mostrarFormularioActualizacion(conductor) {
    const contenedor = document.getElementById('formulario-actualizacion');
    const fechaLicencia = new Date(conductor.fecha_vencimiento_licencia).toISOString().split('T')[0];

    contenedor.innerHTML = `
        <form id="form-actualizar" class="row g-3 needs-validation" novalidate>
            <div class="col-md-6">
                <label class="form-label">Nueva fecha licencia</label>
                <input type="date" 
                       class="form-control" 
                       id="nueva-fecha-licencia" 
                       value="${fechaLicencia}" 
                       required>
                <div class="invalid-feedback">
                    Fecha de licencia obligatoria
                </div>
            </div>
            <div class="col-md-6">
                <label class="form-label">Nuevo teléfono</label>
                <input type="tel" 
                       class="form-control" 
                       id="nuevo-telefono" 
                       value="${conductor.telefono}" 
                       pattern="[0-9]{10}" 
                       required>
                <div class="invalid-feedback">
                    Teléfono válido de 10 dígitos
                </div>
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary w-100">
                    <i class="bi bi-save"></i> Guardar cambios
                </button>
            </div>
        </form>
    `;

    const form = document.getElementById('form-actualizar');
    form.addEventListener('submit', function(e) {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        actualizarConductor(e);
    });
    
    contenedor.style.display = 'block';
}

// Función de actualización (NUEVO - clave del cambio)
async function actualizarConductor(e) {
    e.preventDefault();
    const form = e.target;
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const documento = document.getElementById('documento-actualizar').value;
    const nuevosDatos = {
        fecha_vencimiento_licencia: document.getElementById('nueva-fecha-licencia').value,
        telefono: document.getElementById('nuevo-telefono').value
    };

    try {
        const response = await fetch(`/api/conductores/${documento}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(nuevosDatos)
        });

        const data = await response.json();
        
        if (response.ok) {
            mostrarNotificacion('✅ Conductor actualizado correctamente', 'success');
            form.reset();
            document.getElementById('formulario-actualizacion').style.display = 'none';
        } else {
            throw new Error(data.error || 'Error al actualizar');
        }
    } catch (error) {
        mostrarNotificacion(`⚠️ ${error.message}`, 'danger');
    }
}



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