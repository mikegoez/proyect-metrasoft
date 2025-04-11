//MOSTRAR SECCIONES
function mostrarSeccion(seccion) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
}

//CREAR CONDUCTOR
document.getElementById('form-crear').addEventListener('submit', async (e) => {
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("¡Conductor registrado!");
            e.target.reset();
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (error) {
        alert("Error de conexión");
    }
});

//CONSULTAR CONDUCTOR
async function consultarConductor() {
    const documento = document.getElementById('documento-consultar').value.trim();
    if (!documento) return alert("Ingrese un número de documento");

    try {
        const response = await fetch(`/api/conductores/${documento}`);
        if (!response.ok) throw new Error("Conductor no encontrado");
        
        const conductor = await response.json();
        const resultado = document.getElementById('resultado-consultar');
        resultado.innerHTML = `
            <div class="alert alert-success">
                <p>Documento: ${conductor.numero_documento}</p>
                <p>Nombre: ${conductor.nombres} ${conductor.apellidos}</p>
                <p>Licencia vence: ${conductor.fecha_vencimiento_licencia}</p>
            </div>
        `;
        resultado.style.display = 'block';
    } catch (error) {
        alert(error.message);
    }
}

//ACTUALIZAR CONDUCTOR
async function buscarParaActualizar() {
    const documento = document.getElementById('documento-actualizar').value.trim();
    if (!documento) return alert("Ingrese un documento");

    try {
        const response = await fetch(`/api/conductores/${documento}`);
        if (!response.ok) throw new Error("Conductor no encontrado");
        
        const conductor = await response.json();
        mostrarFormularioActualizacion(conductor);
    } catch (error) {
        alert(error.message);
    }
}

function mostrarFormularioActualizacion(conductor) {
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
    contenedor.style.display = 'block';
}

async function actualizarConductor(event) {
    event.preventDefault();
    const documento = document.getElementById('documento-actualizar').value;
    const nuevaFechaLicencia = document.getElementById('nueva-fecha-licencia').value;
    const nuevoTelefono = document.getElementById('nuevo-telefono').value;

    try {
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
        }
    } catch (error) {
        alert("Error al actualizar");
    }
}

// ELIMINAR CONDUCTOR
async function eliminarConductor() {
    const documento = document.getElementById('documento-eliminar').value.trim();
    if (!documento) return alert("Ingrese un documento");
    
    if (!confirm(`¿Eliminar conductor ${documento} permanentemente?`)) return;

    try {
        const response = await fetch(`/api/conductores/${documento}`, { 
            method: 'DELETE' 
        });

        if (response.ok) {
            alert("Conductor eliminado");
            document.getElementById('documento-eliminar').value = '';
        }
    } catch (error) {
        alert("Error al eliminar");
    }
}