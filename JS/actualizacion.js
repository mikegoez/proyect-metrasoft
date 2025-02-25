function mostrarSeccion(seccion) {
    const secciones = document.querySelectorAll('.section');
    secciones.forEach(sec => sec.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
}

function buscarVehiculo() {
    const placa = document.getElementById('placa-vehiculo').value;
    // Simulación de búsqueda en base de datos
    document.getElementById('detalle-vehiculo').innerHTML = `
        <p>Placa: ${placa}</p>
        <p>Marca: </p>
        <p>Modelo: </p>
        <p>Fecha Vencimiento SOAT: </p>
        <p>Fecha Vencimiento Tecnomecánica:</p>
    `;
    document.getElementById('resultado-vehiculo').style.display = 'block';
}

function buscarConductor() {
    const documento = document.getElementById('documento-conductor').value;
    // Simulación de búsqueda en base de datos
    document.getElementById('detalle-conductor').innerHTML = `
        <p>Documento: ${documento}</p>
        <p>Nombre: </p>
        <p>Teléfono: </p>
        <p>Dirección: </p>
        <p>Fecha Vencimiento Licencia:</p>
    `;
    document.getElementById('resultado-conductor').style.display = 'block';
}

document.getElementById('form-actualizar-vehiculo').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Información del vehículo actualizada exitosamente.');
    this.reset(); // Reinicia el formulario
});

document.getElementById('form-actualizar-conductor').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Información del conductor actualizada exitosamente.');
    this.reset(); // Reinicia el formulario
});
