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
    cargarPlacasActualizar(); // Cargar placas al mostrar la sección
});
    document.getElementById("btn-eliminar").addEventListener("click", () => mostrarSeccion('eliminar'));

    // Listeners para formularios
    document.getElementById("form-crear").addEventListener("submit", crearVehiculo);
    document.getElementById("form-consultar").addEventListener("submit", consultarVehiculo);

    document.getElementById('placa-actualizar').addEventListener('change', async (e) => {
    const placa = e.target.value;
    if (!placa) return;

    try {
        const response = await fetch(`/api/vehiculos/${placa}`);
        const vehiculo = await response.json();
        mostrarFormularioActualizacion(vehiculo);
    } catch (error) {
        console.error("Error cargando vehículo:", error);
    }
});
    document.getElementById("form-eliminar").addEventListener("submit", eliminarVehiculo);
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("¡Vehículo creado!");
            e.target.reset();
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (error) {
        alert("Error de conexión");
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
            errorDiv.textContent = `Error: ${errorData.error}`;
            errorDiv.style.display = 'block';
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
        errorDiv.textContent = "Error de conexión con el servidor";
        errorDiv.style.display = 'block';
    }
}

// Nueva función para cargar placas al entrar a la sección
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
        console.error("Error cargando placas:", error);
    }
}

// Cargar datos al seleccionar placa
async function cargarDatosVehiculo() {
    const placa = document.getElementById('placa-actualizar').value;
    const errorDiv = document.getElementById('error-actualizar');

    if (!placa) {
        errorDiv.textContent = "Selecciona una placa válida";
        errorDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`/api/vehiculos/${placa}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            errorDiv.textContent = "Error al cargar el vehículo";
            errorDiv.style.display = 'block';
            return;
        }

        const vehiculo = await response.json();
        mostrarFormularioActualizacion(vehiculo);
        errorDiv.style.display = 'none';
    } catch (error) {
        errorDiv.textContent = "Error de conexión";
        errorDiv.style.display = 'block';
    }
}


function mostrarFormularioActualizacion(vehiculo) {
    const contenedor = document.getElementById('formulario-actualizacion');
    
    // Convertir fechas ISO a formato yyyy-MM-dd
    const fechaSOAT = new Date(vehiculo.fecha_vencimiento_soat).toISOString().split('T')[0];
    const fechaTecno = new Date(vehiculo.fecha_vencimiento_tecnomecanica).toISOString().split('T')[0];

    contenedor.innerHTML = `
        <form id="form-actualizar" class="needs-validation" novalidate>
            <div class="row g-3">
                <div class="col-md-6">
                    <label>Nueva fecha SOAT</label>
                    <input type="date" class="form-control" id="nueva-fecha-soat" 
                           value="${fechaSOAT}" required>
                </div>
                <div class="col-md-6">
                    <label>Nueva fecha Tecnomecánica</label>
                    <input type="date" class="form-control" id="nueva-fecha-tecnomecanica" 
                           value="${fechaTecno}" required>
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-primary w-100">
                        <i class="bi bi-save"></i> Guardar cambios
                    </button>
                </div>
            </div>
        </form>
    `;

    document.getElementById('form-actualizar').addEventListener('submit', actualizarVehiculo);
    contenedor.style.display = 'block';
}

async function actualizarVehiculo(event) {
    event.preventDefault();
    const placa = document.getElementById('placa-actualizar').value.trim().toUpperCase();
    const nuevaFechaSOAT = document.getElementById('nueva-fecha-soat').value;
    const nuevaFechaTecno = document.getElementById('nueva-fecha-tecnomecanica').value;
    const errorDiv = document.getElementById('error-actualizar');

    // --- Validación 1: Campos requeridos ---
    if (!nuevaFechaSOAT || !nuevaFechaTecno) {
        errorDiv.textContent = "Ambas fechas son requeridas";
        errorDiv.style.display = 'block';
        return;
    }

    // --- Validación 2: Token JWT ---
    const token = localStorage.getItem('token');
    if (!token) {
        alert("¡Sesión expirada! Por favor inicia sesión nuevamente.");
        window.location.href = '/HTML/login.html'; // Redirigir al login
        return;
    }

    try {
        // --- Enviar solicitud PUT ---
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

        // --- Manejar respuesta del servidor ---
        if (!response.ok) {
            // Caso especial: Token expirado/inválido (401 Unauthorized)
            if (response.status === 401) {
                localStorage.removeItem('token'); // Limpiar token
                window.location.href = '/HTML/login.html';
                return;
            }
            
            // Otros errores
            const errorData = await response.json();
            throw new Error(errorData.error || "Error en la actualización");
        }

        // --- Éxito: Recargar página ---
        alert("¡Fechas actualizadas correctamente!");
        window.location.reload(); // Forzar recarga para ver cambios

    } catch (error) {
        // --- Manejar errores de red o del servidor ---
        console.error("Error en actualización:", error);
        errorDiv.textContent = `Error: ${error.message}`;
        errorDiv.style.display = 'block';
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

        alert("Vehículo eliminado");
        document.getElementById('placa-eliminar').value = '';
        errorDiv.style.display = 'none';
    } catch (error) {
        errorDiv.textContent = `Error: ${error.message}`;
        errorDiv.style.display = 'block';
    }
}