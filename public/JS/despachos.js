document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Cargar vehículos
        const vehiculosResponse = await fetch('/api/vehiculos');
        if (!vehiculosResponse.ok) throw new Error("Error cargando vehículos");
        const vehiculos = await vehiculosResponse.json();
        
        const vehiculoSelect = document.getElementById('vehiculo');
        vehiculoSelect.innerHTML = vehiculos.map(v => 
            `<option value="${v.id_vehiculo}">${v.placa}</option>`
        ).join('');

        // Evento cambio vehículo
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

        // Cargar conductores
        const conductoresResponse = await fetch('/api/conductores');
        if (!conductoresResponse.ok) throw new Error("Error cargando conductores");
        const conductores = await conductoresResponse.json();
        
        const conductorSelect = document.getElementById('conductor');
        conductorSelect.innerHTML = conductores.map(c => 
            `<option value="${c.id_conductor}">${c.nombres} ${c.apellidos}</option>`
        ).join('');

    } catch (error) {
        console.error("Error inicial:", error);
        alert("Error al cargar datos iniciales");
    }
});

// Función para mostrar secciones
function mostrarSeccion(seccion) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
}

// Función para generar PDF
function generarPDF(despacho) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // logo PDF
    const logoURL = '../assets/metrasofftlogo.png';
    doc.addImage(logoURL, 'PNG', 11, 11, 31, 16);

    // configuracion fuentes y estilo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    // titulo del pdf
    doc.text("comprobante de despacho", 15, 40);

    //subtitulos con estilo
    doc.setFontSize(12);
    doc.setTextColor(108, 117, 125);
    doc.text("Detalles del despacho:", 15,50);

    //Datos del despacho
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0,);

    const detalles = [
        { label: "Codigo", value: despacho.codigo_despacho },
        { label: "Vehiculo", value: despacho.placa },
        { label: "Conductor", value: `${despacho.nombres} ${despacho.apellidos}` },
        { label: "Tipo de carga", value: despacho.tipo_carga },
        { label: "Destino", value: despacho.destino },
        { label: "Fecha y hora", value: `${despacho.fecha} ${despacho.hora}` },  
    ];

    // posicion inicial para detalles
    let yPos = 60;

    detalles.forEach((dato) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${dato.label}:`, 15, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(dato.value, 55, yPos);
        yPos += 10;
    });

    //linea decorativa
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos + 5, 195, yPos + 5);
    
    doc.save(`despacho_${despacho.codigo_despacho}.pdf`);
}

// Evento submit del formulario
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

        // Validar campos
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
        
        // Actualizar campo de código
        document.getElementById('codigo-despacho').value = despachoCreado.codigo_despacho;
        
        // Ocultar spinner y mostrar alerta
        loading.style.display = 'none';
        alert("Despacho creado: " + despachoCreado.codigo_despacho);
        
        // Generar PDF automáticamente
        generarPDF(despachoCreado);
        e.target.reset();

    } catch (error) {
        loading.style.display = 'none';
        alert("Error: " + error.message);
    }
});

// CONSULTAR DESPACHO
async function buscarDespacho() {
    const codigo = document.getElementById('codigo-consulta').value.trim();
    if (!codigo) return alert("Ingrese un código de despacho");

    try {
        const response = await fetch(`/api/despachos/${codigo}`);
        if (!response.ok) throw new Error("Despacho no encontrado");
        
        const despacho = await response.json();
        const resultado = document.getElementById('resultado-despacho');
        
        resultado.innerHTML = `
            <div class="alert alert-success">
                <p><strong>Código:</strong> ${despacho.codigo_despacho}</p>
                <p><strong>Vehículo:</strong> ${despacho.vehiculo_id}</p>
                <p><strong>Conductor:</strong> ${despacho.conductor_id}</p>
                <p><strong>Destino:</strong> ${despacho.destino}</p>
                <p><strong>Fecha:</strong> ${despacho.fecha} ${despacho.hora}</p>
            </div>
        `;
        resultado.style.display = 'block';

    } catch (error) {
        alert(error.message);
    }
}


// ELIMINAR DESPACHO
async function confirmarEliminacion() {
    const codigo = document.getElementById('codigo-eliminar').value.trim();
    if (!codigo) return alert("Ingrese un código de despacho");
    
    if (!confirm(`¿Eliminar el despacho ${codigo} permanentemente?`)) return;

    try {
        const response = await fetch(`/api/despachos/${codigo}`, { 
            method: 'DELETE' 
        });
        
        if (!response.ok) throw new Error("Error al eliminar");
        alert("Despacho eliminado correctamente");
        document.getElementById('resultado-eliminar').style.display = 'none';

    } catch (error) {
        alert(error.message);
    }
}