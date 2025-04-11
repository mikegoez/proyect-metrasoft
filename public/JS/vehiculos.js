//MOSTRAR SECCIONES
function mostrarSeccion(seccion) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
}

//CREAR VEHÍCULO
document.getElementById('form-crear').addEventListener('submit', async (e) => {
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
});

//CONSULTAR VEHÍCULO 
async function consultarVehiculo() {
    const placa = document.getElementById('placa-consultar').value.trim();
    if (!placa) return alert("Ingresa una placa");

    try {
        const response = await fetch(`/api/vehiculos/${placa}`);
        if (!response.ok) throw new Error("Vehículo no encontrado");
        
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
    } catch (error) {
        alert(error.message);
    }
}

//ACTUALIZAR VEHÍCULO
async function buscarParaActualizar() {
    const placa = document.getElementById('placa-actualizar').value.trim();
    if (!placa) return alert("Ingresa una placa");

    try {
        const response = await fetch(`/api/vehiculos/${placa}`);
        if (!response.ok) throw new Error("Vehículo no encontrado");
        
        const vehiculo = await response.json();
        mostrarFormularioActualizacion(vehiculo);
    } catch (error) {
        alert(error.message);
    }
}

function mostrarFormularioActualizacion(vehiculo) {
    const contenedor = document.getElementById('formulario-actualizacion');
    contenedor.innerHTML = `
        <form onsubmit="actualizarVehiculo(event)">
            <div class="row g-3">
                <div class="col-md-6">
                    <label>Nueva fecha SOAT</label>
                    <input type="date" class="form-control" id="nueva-fecha-soat" 
                           value="${vehiculo.fecha_vencimiento_soat}" required>
                </div>
                <div class="col-md-6">
                    <label>Nueva fecha Tecnomecánica</label>
                    <input type="date" class="form-control" id="nueva-fecha-tecnomecanica" 
                           value="${vehiculo.fecha_vencimiento_tecnomecanica}" required>
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-primary w-100">
                        <i class="bi bi-save"></i> Guardar cambios
                    </button>
                </div>
            </div>
        </form>
    `;
    contenedor.style.display = 'block';
}

async function actualizarVehiculo(event) {
    event.preventDefault();
    const placa = document.getElementById('placa-actualizar').value;
    const nuevaFechaSOAT = document.getElementById('nueva-fecha-soat').value;
    const nuevaFechaTecno = document.getElementById('nueva-fecha-tecnomecanica').value;

    try {
        const response = await fetch(`/api/vehiculos/${placa}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fecha_vencimiento_soat: nuevaFechaSOAT,
                fecha_vencimiento_tecnomecanica: nuevaFechaTecno
            })
        });

        if (response.ok) {
            alert("¡Vehículo actualizado!");
            document.getElementById('formulario-actualizacion').style.display = 'none';
        }
    } catch (error) {
        alert("Error al actualizar");
    }
}

// ELIMINAR VEHÍCULO 
async function eliminarVehiculo() {
    const placa = document.getElementById('placa-eliminar').value.trim();
    if (!placa) return alert("Ingresa una placa");
    
    if (!confirm(`¿Eliminar vehículo ${placa} permanentemente?`)) return;

    try {
        const response = await fetch(`/api/vehiculos/${placa}`, { 
            method: 'DELETE' 
        });

        if (response.ok) {
            alert("Vehículo eliminado");
            document.getElementById('placa-eliminar').value = '';
        }
    } catch (error) {
        alert("Error al eliminar");
    }
}