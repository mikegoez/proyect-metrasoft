// Funciones globales
window.mostrarSeccion = function(seccion) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
};

// Mapeo de botones a secciones y eventos
document.addEventListener("DOMContentLoaded", () => {
    // Navegación
    document.getElementById("btn-crear").addEventListener("click", () => mostrarSeccion('crear'));
    document.getElementById("btn-consultar").addEventListener("click", () => mostrarSeccion('consultar'));
    document.getElementById("btn-actualizar").addEventListener("click", () => {
        mostrarSeccion('actualizar');
        cargarDocumentosActualizar(); // Cargar lista al entrar
    });
    document.getElementById("btn-eliminar").addEventListener("click", () => mostrarSeccion('eliminar'));

    // Formularios
    document.getElementById("form-crear").addEventListener('submit', crearConductor);
    document.getElementById("form-consultar").addEventListener("submit", consultarConductor);
    document.getElementById("form-eliminar").addEventListener("submit", eliminarConductor);

    // Actualizar: Botón "Cargar"
    document.getElementById("btn-cargar-conductor").addEventListener("click", () => {
        const documento = document.getElementById('documento-actualizar').value;
        if (documento) cargarDatosActualizar(documento);
    });
});

// ========================
// LÓGICA DE ACTUALIZACIÓN 
// ========================

// 1. Cargar lista de documentos en el dropdown
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
            option.value = conductor.numero_documento;
            option.textContent = `${conductor.nombres} ${conductor.apellidos} - ${conductor.numero_documento}`;
            select.appendChild(option);
        });
    } catch (error) {
        mostrarNotificacion('❌ Error cargando conductores', 'danger');
    }
}

// 2. Cargar datos del conductor seleccionado
async function cargarDatosActualizar(numeroDocumento) {
    try {
        const response = await fetch(`/api/conductores/${numeroDocumento}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (!response.ok) {
            document.getElementById('error-actualizar').style.display = 'block';
            document.getElementById('error-actualizar').textContent = 'Conductor no encontrado';
            return;
        }

        const conductor = await response.json();
        const contenedor = document.getElementById('formulario-actualizacion');
        
        contenedor.innerHTML = `
            <form id="form-actualizar" class="row g-3">
                <div class="col-md-12">
                    <label class="form-label">Nueva fecha de vencimiento</label>
                    <input type="date" class="form-control" 
                           id="fecha-actualizar" 
                           value="${conductor.fecha_vencimiento_licencia.split('T')[0]}"
                           required>
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-primary w-100">
                        <i class="bi bi-save"></i> Actualizar
                    </button>
                </div>
            </form>
        `;
        
        contenedor.style.display = 'block';
        document.getElementById('form-actualizar').addEventListener('submit', actualizarConductor);
    } catch (error) {
        mostrarNotificacion('❌ Error cargando datos del conductor', 'danger');
    }
}

// 3. Enviar actualización al servidor
async function actualizarConductor(e) {
    e.preventDefault();
    const numeroDocumento = document.getElementById('documento-actualizar').value;
    const nuevaFecha = document.getElementById('fecha-actualizar').value;

    try {
        const response = await fetch(`/api/conductores/${numeroDocumento}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ fecha_vencimiento_licencia: nuevaFecha })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error en la actualización");
        }

        mostrarNotificacion('✅ Licencia actualizada exitosamente', 'success');
        document.getElementById('formulario-actualizacion').style.display = 'none';
        cargarDocumentosActualizar(); // Actualizar lista
    } catch (error) {
        mostrarNotificacion(`❌ ${error.message}`, 'danger');
    }
}

// ========================
// FUNCIONES COMUNES
// ========================

// Crear conductor
async function crearConductor(e) {
    e.preventDefault();
    const formData = {
        tipo_documento: e.target.tipo_documento.value,
        numero_documento: e.target.numero_documento.value.toUpperCase(),
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
        response.ok ? mostrarNotificacion('🚗 Conductor registrado', 'success') : mostrarNotificacion(`❌ ${data.error}`, 'danger');
        e.target.reset();
    } catch (error) {
        mostrarNotificacion('🔥 Error de conexión', 'danger');
    }
}

// Consultar conductor
async function consultarConductor(e) {
    e.preventDefault();
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
        document.getElementById('resultado-consultar').innerHTML = `
            <div class="alert alert-success">
                <p>Documento: ${conductor.numero_documento}</p>
                <p>Nombre: ${conductor.nombres} ${conductor.apellidos}</p>
                <p>Teléfono: ${conductor.telefono}</p>
                <p>Licencia vence: ${conductor.fecha_vencimiento_licencia}</p>
            </div>
        `;
        document.getElementById('resultado-consultar').style.display = 'block';
    } catch (error) {
        mostrarNotificacion(`⚠️ ${error.message}`, 'danger');
    }
}

// Eliminar conductor
async function eliminarConductor(e) {
    e.preventDefault();
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

        mostrarNotificacion('🗑️ Conductor eliminado', 'success');
        document.getElementById('documento-eliminar').value = '';
    } catch (error) {
        mostrarNotificacion(`⚠️ ${error.message}`, 'danger');
    }
}

// Sistema de notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} alert-dismissible fade show mtr-notification`;
    notificacion.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.prepend(notificacion);
    setTimeout(() => notificacion.remove(), 3000);
}
