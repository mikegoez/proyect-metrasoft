document.addEventListener("DOMContentLoaded", () => {
  // Mapeo de botones a funciones
  document.getElementById("btn-crear").addEventListener("click", () => mostrarSeccion('crear'));
  document.getElementById("btn-consultar").addEventListener("click", () => mostrarSeccion('consultar'));
  document.getElementById("btn-actualizar").addEventListener("click", () => mostrarSeccion('actualizar'));
  document.getElementById("btn-eliminar").addEventListener("click", () => mostrarSeccion('eliminar'));
});
//mostar secciones

//crear vehiculo
// Escucha el evento submit del formulario de creación
document.getElementById('form-crear').addEventListener('submit', async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    //recopilacion de datos del formulario 
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
        //enviar datos al backend mediamndte POST
        const response = await fetch('/api/vehiculos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("¡Vehículo creado!");
            e.target.reset();  // limpia el formulario
        } else {
            // lee el error del servidor
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (error) { // captura errores de red
        alert("Error de conexión");
    }
});

//consultar vehiculo
async function consultarVehiculo() {
    // obtiene y limpia la placa ingresada
    const placa = document.getElementById('placa-consultar').value.trim();
    if (!placa) return alert("Ingresa una placa"); // validación básica

    try {
        //obtener datos del vehiculo por placa
        const response = await fetch(`/api/vehiculos/${placa}`);
        if (!response.ok) throw new Error("Vehículo no encontrado");
        //procesa y muestra los resultados
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
        resultado.style.display = 'block'; // Muestra el contenedor de resultados
    } catch (error) {
        alert(error.message); // Muestra el error al usuario
    }
}

//actualizar vehiculo
async function buscarParaActualizar() {
    // Obtiene y valida la placa
    const placa = document.getElementById('placa-actualizar').value.trim();
    if (!placa) return alert("Ingresa una placa");

    try {
        //para bucar vehiculo para actualizar
        const response = await fetch(`/api/vehiculos/${placa}`);
        if (!response.ok) throw new Error("Vehículo no encontrado");
        // para mostar formulario de actualizacion con los datos actuales
        const vehiculo = await response.json();
        mostrarFormularioActualizacion(vehiculo);
    } catch (error) {
        alert(error.message);
    }
}

function mostrarFormularioActualizacion(vehiculo) {
    // genera el formulario de actualización con los valores actuales
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
    contenedor.style.display = 'block'; //muestra el formulario
}

async function actualizarVehiculo(event) {
    event.preventDefault(); // Previene el envío tradicional del formulario
    // Obtiene los valores actualizados
    const placa = document.getElementById('placa-actualizar').value;
    const nuevaFechaSOAT = document.getElementById('nueva-fecha-soat').value;
    const nuevaFechaTecno = document.getElementById('nueva-fecha-tecnomecanica').value;

    try {
        //envia actualizacion al servidor
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
            //oculta formulario
        }
    } catch (error) {
        alert("Error al actualizar");
    }
}

// eliminar vehiculo
async function eliminarVehiculo() {
    // Obtiene y valida la placa
    const placa = document.getElementById('placa-eliminar').value.trim();
    if (!placa) return alert("Ingresa una placa");

    // Confirmación de seguridad
    if (!confirm(`¿Eliminar vehículo ${placa} permanentemente?`)) return;

    try {
        // Envía la solicitud de eliminación
        const response = await fetch(`/api/vehiculos/${placa}`, { 
            method: 'DELETE' 
        });

        if (response.ok) {
            alert("Vehículo eliminado");
            document.getElementById('placa-eliminar').value = ''; //limpia campo
        }
    } catch (error) {
        alert("Error al eliminar");
    }
}