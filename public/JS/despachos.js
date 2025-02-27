// Función para mostrar la sección seleccionada
function mostrarSeccion(seccion) {
    const secciones = document.querySelectorAll('.section');
    secciones.forEach(sec => sec.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
}

// Manejo del formulario de creación de despachos
document.getElementById('form-crear-despacho').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Despacho creado exitosamente.');
    this.reset(); // Reinicia el formulario
});

// Función para buscar un despacho (simulación)
function buscarDespacho() {
    const codigo = document.getElementById('codigo-consulta').value;
    // Simulación de la búsqueda
    document.getElementById('resultado-despacho').innerHTML = `<p>Información del despacho con código ${codigo}</p>`;
    document.getElementById('resultado-despacho').style.display = 'block';
}

// Función para buscar un despacho para eliminar (simulación)
function buscarDespachoEliminar() {
    const codigo = document.getElementById('codigo-eliminar').value;
    // Simulación de la búsqueda
    document.getElementById('resultado-eliminar').innerHTML = `<p>Información del despacho con código ${codigo}</p>`;
    document.getElementById('resultado-eliminar').style.display = 'block';
}

// Función para confirmar la eliminación de un despacho
function confirmarEliminacion() {
    if (confirm('¿Estás seguro de que deseas eliminar este despacho?')) {
        alert('Despacho eliminado exitosamente.');
        document.getElementById('resultado-eliminar').style.display = 'none';
    }
}
