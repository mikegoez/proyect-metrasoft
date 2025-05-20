// Funciones globales
window.mostrarSeccion = function(seccion) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
};

// Mapeo de botones a secciones
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-crear").addEventListener("click", () => mostrarSeccion('crear'));
    document.getElementById("btn-consultar").addEventListener("click", () => mostrarSeccion('consultar'));
    document.getElementById("btn-actualizar").addEventListener("click", () => {
        mostrarSeccion('actualizar');
        cargarPlacasActualizar();
    });
    document.getElementById("btn-eliminar").addEventListener("click", () => mostrarSeccion('eliminar'));

    // Listeners para formularios
    document.getElementById("form-crear").addEventListener("submit", crearVehiculo);
    document.getElementById("form-consultar").addEventListener("submit", consultarVehiculo);
    document.getElementById("form-eliminar").addEventListener("submit", eliminarVehiculo);

    document.getElementById('placa-actualizar').addEventListener('change', async (e) => {
        const placa = e.target.value;
        if (!placa) return;

        try {
            const response = await fetch(`/api/vehiculos/${placa}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const vehiculo = await response.json();
            mostrarFormularioActualizacion(vehiculo);
        } catch (error) {
            mostrarNotificacion('Error cargando vehículo', 'danger');
        }
    });
});

// Crear vehículo
async function crearVehiculo(e) {
    e.preventDefault();
    const formData = {
        placa: e.target.placa.value,
        marca: e.target.marca.value,
        modelo: e.target.modelo.value,
        ano: e.target.ano.value,
        tipo_carga: e.target.tipo_carga.value,
        capacidad_puestos: e.target.capacidad_puestos.value,
        capacidad_kg: e.target.capacidad_kg.value,
        fecha_vencimiento_soat: e.target.fecha_vencimiento_soat.value,
        fecha_vencimiento_tecnomecanica: e.target.fecha_vencimiento_tecnomecanica.value
    };

    try {
        const response = await fetch('/api/vehiculos', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            mostrarNotificacion('🚗 Vehículo creado exitosamente!', 'success');
            e.target.reset();
        } else {
            const error = await response.json();
            mostrarNotificacion(`❌ Error: ${error.error}`, 'danger');
        }
    } catch (error) {
        mostrarNotificacion('🔥 Error de conexión', 'danger');
    }
}

// Consultar vehículo
async function consultarVehiculo(e) {
    e.preventDefault();
    const formulario = e.target;
    const errorDiv = document.getElementById('error-consultar');

    if (!formulario.checkValidity()) {
        formulario.classList.add('was-validated');
        return;
    }

    const placa = document.getElementById('placa-consultar').value.trim().toUpperCase();
    try {
        const response = await fetch(`/api/vehiculos/${placa}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            mostrarNotificacion(`⚠️ ${errorData.error}`, 'danger');
            return;
        }

        const vehiculo = await response.json();
        const resultado = document.getElementById('resultado-consultar');
        resultado.innerHTML = `
            <div class="alert alert-success">
                <p>Placa: ${vehiculo.placa}</p>
                <p>Marca: ${vehiculo.marca}</p>
                <p>SOAT: ${vehiculo.fecha_vencimiento_soat}</p>
                <p>Tecnomecánica: ${vehiculo.fecha_vencimiento_tecnomecanica}</p>
            </div>
        `;
        resultado.style.display = 'block';
        errorDiv.style.display = 'none';
    } catch (error) {
        mostrarNotificacion('🌐 Error de conexión con el servidor', 'danger');
    }
}

// Actualizar vehículo
async function actualizarVehiculo(e) {
    e.preventDefault();
    const placa = document.getElementById('placa-actualizar').value;
    const nuevaFechaSOAT = document.getElementById('nueva-fecha-soat').value;
    const nuevaFechaTecno = document.getElementById('nueva-fecha-tecnomecanica').value;

    try {
        const response = await fetch(`/api/vehiculos/${placa}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                fecha_vencimiento_soat: nuevaFechaSOAT,
                fecha_vencimiento_tecnomecanica: nuevaFechaTecno
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            mostrarNotificacion('📅 Fechas actualizadas correctamente!', 'success');
            document.getElementById('formulario-actualizacion').style.display = 'none';
        } else {
            mostrarNotificacion(`⚠️ ${data.error}`, 'danger');
        }
    } catch (error) {
        mostrarNotificacion('🔥 Error de conexión', 'danger');
        console.error("Error en actualización:", error);
    }
}

// Eliminar vehículo
async function eliminarVehiculo(e) {
    e.preventDefault();
    const formulario = e.target;
    const errorDiv = document.getElementById('error-eliminar');

    if (!formulario.checkValidity()) {
        formulario.classList.add('was-validated');
        return;
    }

    const placa = document.getElementById('placa-eliminar').value.trim().toUpperCase();
    if (!confirm(`¿Eliminar vehículo ${placa} permanentemente?`)) return;

    try {
        const response = await fetch(`/api/vehiculos/${placa}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al eliminar");
        }

        mostrarNotificacion('🗑️ Vehículo eliminado correctamente', 'success');
        document.getElementById('placa-eliminar').value = '';
        errorDiv.style.display = 'none';
    } catch (error) {
        mostrarNotificacion(`⚠️ ${error.message}`, 'danger');
        errorDiv.style.display = 'block';
    }
}

// Funciones auxiliares
async function cargarPlacasActualizar() {
    try {
        const response = await fetch('/api/vehiculos', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const vehiculos = await response.json();
        const dropdown = document.getElementById('placa-actualizar');
        
        dropdown.innerHTML = '<option value="">Seleccione una placa...</option>';
        vehiculos.forEach(v => {
            dropdown.innerHTML += `<option value="${v.placa}">${v.placa}</option>`;
        });
    } catch (error) {
        mostrarNotificacion('Error cargando placas', 'danger');
    }
}

function mostrarFormularioActualizacion(vehiculo) {
    const contenedor = document.getElementById('formulario-actualizacion');
    const fechaSOAT = new Date(vehiculo.fecha_vencimiento_soat).toISOString().split('T')[0];
    const fechaTecno = new Date(vehiculo.fecha_vencimiento_tecnomecanica).toISOString().split('T')[0];

    contenedor.innerHTML = `
        <form id="form-actualizar" class="row g-3 needs-validation" novalidate>
            <div class="col-md-6">
                <label class="form-label">Nueva fecha SOAT</label>
                <input type="date" class="form-control" id="nueva-fecha-soat" 
                       value="${fechaSOAT}" required>
                <div class="invalid-feedback">Fecha SOAT obligatoria</div>
            </div>
            <div class="col-md-6">
                <label class="form-label">Nueva fecha Tecnomecánica</label>
                <input type="date" class="form-control" id="nueva-fecha-tecnomecanica" 
                       value="${fechaTecno}" required>
                <div class="invalid-feedback">Fecha Tecnomecánica obligatoria</div>
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
        actualizarVehiculo(e);
    });
    
    contenedor.style.display = 'block';
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