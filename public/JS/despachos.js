// Carga datos iniciales al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // cargar lista de vehículos disponibles
        const vehiculosResponse = await fetch('/api/vehiculos');
        if (!vehiculosResponse.ok) throw new Error("Error cargando vehículos");
        const vehiculos = await vehiculosResponse.json();
        const vehiculoSelect = document.getElementById('vehiculo');
        vehiculoSelect.innerHTML = vehiculos.map(v =>
            `<option value="${v.id_vehiculo}">${v.placa}</option>`
        ).join('');

        vehiculoSelect.addEventListener('change', async (e) => {
            const vehiculoId = e.target.value;
            if (!vehiculoId) return;

            try {
                const response = await fetch(`/api/vehiculos/by-id/${vehiculoId}`);
                if (!response.ok) throw new Error("Vehículo no encontrado");
                const vehiculo = await response.json();
                document.getElementById('tipo-carga-display').value = vehiculo.tipo_carga;
                document.getElementById('tipo-carga').value = vehiculo.tipo_carga;
                document.getElementById('capacidad-kg-display').value = vehiculo.capacidad_kg;
                document.getElementById('capacidad-kg').value = vehiculo.capacidad_kg;
                document.getElementById('capacidad-puestos-display').value = vehiculo.capacidad_puestos;
                document.getElementById('capacidad-puestos').value = vehiculo.capacidad_puestos;

            } catch (error) {
                console.error("Error:", error);
                alert("Error al cargar datos del vehículo");
            }
        });

        const conductoresResponse = await fetch('/api/conductores');
        if (!conductoresResponse.ok) throw new Error("Error cargando conductores");
        const conductores = await conductoresResponse.json();
        const conductorSelect = document.getElementById('conductor');
        conductorSelect.innerHTML = conductores.map(c =>
            `<option value="${c.id_conductor}">${c.nombres} ${c.apellidos}</option>`
        ).join('');

        // Listeners para navegación de secciones
        document.getElementById("btn-crear").addEventListener("click", () => mostrarSeccion('crear-despacho'));
   

        document.getElementById("btn-eliminar").addEventListener("click", () => {
            mostrarSeccion('eliminar-despacho');
            cargarDespachosParaEliminar(); //carga el listado
        });
    
        document.getElementById("btn-eliminar-despacho").addEventListener("click", confirmarEliminacion);

    } catch (error) {
        console.error("Error inicial:", error);
        alert("Error al cargar datos iniciales");
    }
});

function mostrarSeccion(seccion) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
}

function generarPDF(despacho) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const logoURL = '../assets/metrasofftlogo.png';
    doc.addImage(logoURL, 'PNG', 11, 11, 31, 16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text("comprobante de despacho", 15, 40);
    doc.setFontSize(12);
    doc.setTextColor(108, 117, 125);
    doc.text("Detalles del despacho:", 15, 50);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const detalles = [
        { label: "Codigo", value: despacho.codigo_despacho },
        { label: "Vehiculo", value: despacho.placa },
        { label: "Conductor", value: `${despacho.nombres} ${despacho.apellidos}` },
        { label: "Tipo de carga", value: despacho.tipo_carga },
        { label: "Destino", value: despacho.destino },
        { label: "Fecha y hora", value: `${despacho.fecha} ${despacho.hora}` },
    ];

    let yPos = 60;
    detalles.forEach(d => {
        doc.setFont("helvetica", "bold");
        doc.text(`${d.label}:`, 15, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(d.value, 55, yPos);
        yPos += 10;
    });

    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos + 5, 195, yPos + 5);
    doc.save(`despacho_${despacho.codigo_despacho}.pdf`);
}

document.getElementById('form-crear-despacho').addEventListener('submit', async (e) => {
    e.preventDefault();
    const loading = document.getElementById('loading');
    try {
        loading.style.display = 'block';
        const formData = {
            vehiculo_id: document.getElementById('vehiculo').value,
            conductor_id: document.getElementById('conductor').value,
            tipo_carga: document.getElementById('tipo-carga').value,
            destino: document.getElementById('destino').value.trim(),
            capacidad_kg: document.getElementById('capacidad-kg').value,
            capacidad_puestos: document.getElementById('capacidad-puestos').value,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value
        };

        if (!formData.vehiculo_id || !formData.conductor_id || !formData.destino) {
            throw new Error("Todos los campos son requeridos");
        }

        const response = await fetch('/api/despachos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error del servidor");
        }

        const despachoCreado = await response.json();
        document.getElementById('codigo-despacho').value = despachoCreado.codigo_despacho;
        loading.style.display = 'none';
        alert("Despacho creado: " + despachoCreado.codigo_despacho);
        generarPDF(despachoCreado);
        e.target.reset();

    } catch (error) {
        loading.style.display = 'none';
        alert("Error: " + error.message);
    }
});

async function cargarDespachosParaEliminar() {
    try {
        const response = await fetch('/api/despachos');
        if (!response.ok) throw new Error("Error al obtener despachos");
        const despachos = await response.json();
        const selector = document.getElementById('despacho-eliminar');

        selector.innerHTML = '<option value="">Seleccione un despacho...</option>';
        despachos.forEach(d => {
            const texto = `${d.codigo_despacho} - ${d.destino} (${d.fecha})`;
            selector.innerHTML += `<option value="${d.codigo_despacho}">${texto}</option>`;
        });

    } catch (error) {
        console.error("Error al cargar despachos:", error.message);
    }
}

async function confirmarEliminacion() {
    const codigo = document.getElementById('despacho-eliminar').value;
    if (!codigo) return alert("Seleccione un despacho para eliminar");

    if (!confirm(`¿Eliminar el despacho ${codigo} permanentemente?`)) return;

    try {
        const response = await fetch(`/api/despachos/${codigo}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Error al eliminar");

        alert("Despacho eliminado correctamente");
        document.getElementById('resultado-eliminar').style.display = 'none';
        await cargarDespachosParaEliminar(); // Recarga el listado

    } catch (error) {
        alert(error.message);
    }
}

