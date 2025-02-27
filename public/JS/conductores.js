function mostrarSubseccion(subseccion) {
    const subsecciones = document.querySelectorAll('.subsection');
    subsecciones.forEach(subsec => subsec.style.display = 'none');
    document.getElementById(subseccion).style.display = 'block';
}

document.getElementById('form-crear-conductor').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Conductor creado exitosamente.');
    this.reset();
});

function buscarConductor() {
    const documento = document.getElementById('documento-consulta').value;
    alert('Buscando conductor con documento: ' + documento);
    // Aquí iría la lógica para buscar el conductor en la base de datos
}

function buscarConductorEliminar() {
    const documento = document.getElementById('conductor-eliminar').value;
    alert('Buscando conductor para eliminar con documento: ' + documento);
    // Aquí iría la lógica para buscar y eliminar el conductor
}

