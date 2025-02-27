function mostrarSubseccion(subseccion) {
    const subsecciones = document.querySelectorAll('.subsection');
    subsecciones.forEach(subsec => subsec.style.display = 'none');
    document.getElementById(subseccion).style.display = 'block';
}

document.getElementById('form-crear-vehiculo').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Vehículo creado exitosamente.');
    this.reset();
});

function buscarVehiculo() {
    const placa = document.getElementById('placa-consulta').value;
    alert('Buscando vehículo con placa: ' + placa);
    // Aquí iría la lógica para buscar el vehículo en la base de datos
}

function buscarVehiculoEliminar() {
    const placa = document.getElementById('placa-eliminar').value;
    alert('Buscando vehículo para eliminar con placa: ' + placa);
    // Aquí iría la lógica para buscar y eliminar el vehículo
}
