//mostrar y ocultar secciones
function mostrarSeccion(seccion) {
    //ocultar todas las secciones 
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
}

//crear conductor
document.getElementById('form-crear').addEventListener('submit', async (e) => {
    e.preventDefault();
    // recopilacion de deatos del formulario
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
        //enviar datos al backend
        const response = await fetch('/api/conductores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("¡Conductor registrado!");
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

//consultar conductor
async function consultarConductor() {
    // obtiene y limpia el numero de documento ingreado
    const documento = document.getElementById('documento-consultar').value.trim();
    if (!documento) return alert("Ingrese un número de documento"); //validacion basica

    try {
        //obtener datos el conductor
        const response = await fetch(`/api/conductores/${documento}`);
        if (!response.ok) throw new Error("Conductor no encontrado");
        //mostrar resultados
        const conductor = await response.json();
        const resultado = document.getElementById('resultado-consultar');
        resultado.innerHTML = `
            <div class="alert alert-success">
                <p>Documento: ${conductor.numero_documento}</p>
                <p>Nombre: ${conductor.nombres} ${conductor.apellidos}</p>
                <p>Licencia vence: ${conductor.fecha_vencimiento_licencia}</p>
            </div>
        `;
        resultado.style.display = 'block'; // Muestra el contenedor de resultados
    } catch (error) {
        alert(error.message);
    }
}

//actualizar conductor
async function buscarParaActualizar() {
    //obtiene y valida documento
    const documento = document.getElementById('documento-actualizar').value.trim();
    if (!documento) return alert("Ingrese un documento");

    try {
        // para buscar conductor para actulizar 
        const response = await fetch(`/api/conductores/${documento}`);
        if (!response.ok) throw new Error("Conductor no encontrado");
        // para mostar formulario de actualizacion
        const conductor = await response.json();
        mostrarFormularioActualizacion(conductor);
    } catch (error) {
        alert(error.message);
    }
}

function mostrarFormularioActualizacion(conductor) {
    // genera el formulario de actualización con los valores actuales
    const contenedor = document.getElementById('formulario-actualizacion');
    contenedor.innerHTML = `
        <form onsubmit="actualizarConductor(event)">
            <div class="row g-3">
                <div class="col-md-6">
                    <label>Nueva fecha licencia</label>
                    <input type="date" class="form-control" id="nueva-fecha-licencia" 
                           value="${conductor.fecha_vencimiento_licencia}" required>
                </div>
                <div class="col-md-6">
                    <label>Nuevo teléfono</label>
                    <input type="tel" class="form-control" id="nuevo-telefono" 
                           value="${conductor.telefono}" pattern="[0-9]{10}" required>
                </div>
                <div class="col-12">
                    <button type="submit" class="btn btn-primary w-100">
                        <i class="bi bi-save"></i> Guardar cambios
                    </button>
                </div>
            </div>
        </form>
    `;
    contenedor.style.display = 'block'; //mujestra formulario
}

async function actualizarConductor(event) {
    event.preventDefault(); // Previene el envío tradicional del formulario
    // Obtiene los valores actualizados
    const documento = document.getElementById('documento-actualizar').value;
    const nuevaFechaLicencia = document.getElementById('nueva-fecha-licencia').value;
    const nuevoTelefono = document.getElementById('nuevo-telefono').value;

    try {
        //envia actualizacion al servidor
        const response = await fetch(`/api/conductores/${documento}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fecha_vencimiento_licencia: nuevaFechaLicencia,
                telefono: nuevoTelefono
            })
        });

        if (response.ok) {
            alert("¡Conductor actualizado!");
            document.getElementById('formulario-actualizacion').style.display = 'none';
            //oculta formulario
        }
    } catch (error) {
        alert("Error al actualizar");
    }
}

// eliminar conductor
async function eliminarConductor() {
    // Obtiene y valida documento
    const documento = document.getElementById('documento-eliminar').value.trim();
    if (!documento) return alert("Ingrese un documento");
    // confirmacion de seguridad
    if (!confirm(`¿Eliminar conductor ${documento} permanentemente?`)) return;

    try {
        // envia la solicitud de eliminacion
        const response = await fetch(`/api/conductores/${documento}`, { 
            method: 'DELETE' 
        });

        if (response.ok) {
            alert("Conductor eliminado");
            document.getElementById('documento-eliminar').value = ''; //limpia campo
        }
    } catch (error) {
        alert("Error al eliminar");
    }
}