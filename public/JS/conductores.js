// Mostrar la subsección seleccionada
function mostrarSubseccion(subseccion) {
    const subsecciones = document.querySelectorAll('.subsection');
    subsecciones.forEach(subsec => subsec.style.display = 'none');
    document.getElementById(subseccion).style.display = 'block';
}

// Manejar el envío del formulario de creación de conductor
document.getElementById('form-crear-conductor').addEventListener('submit', function (event) {
    event.preventDefault();
    mostrarNotificacion('Conductor creado exitosamente.', 'exito');
    this.reset();
});

// Función para buscar conductor (simulación)
function buscarConductor() {
    const tipoDocumento = document.getElementById('tipo-de-documento-consulta').value;
    const documento = document.getElementById('documento-consulta').value;

    if (tipoDocumento && documento) {
        // Simulación de búsqueda
        const conductor = {
            tipoDocumento: tipoDocumento,
            documento: documento,
            nombres: 'Juan Pérez',
            telefono: '1234567890',
            direccion: 'Calle 123 # 45-67',
            vencimientoLicencia: '2025-12-31'
        };

        // Mostrar la información en el modal
        const detalleConductor = document.getElementById('detalle-conductor');
        detalleConductor.innerHTML = `
            <p><strong>Tipo de Documento:</strong> ${conductor.tipoDocumento}</p>
            <p><strong>Número de Documento:</strong> ${conductor.documento}</p>
            <p><strong>Nombres y Apellidos:</strong> ${conductor.nombres}</p>
            <p><strong>Teléfono:</strong> ${conductor.telefono}</p>
            <p><strong>Dirección:</strong> ${conductor.direccion}</p>
            <p><strong>Vencimiento de Licencia:</strong> ${conductor.vencimientoLicencia}</p>
        `;

        // Mostrar el modal
        document.getElementById('modal-conductor').style.display = 'block';
    } else {
        mostrarNotificacion('Por favor, ingrese un tipo de documento y un número de documento válidos.', 'error');
    }
}

// Función para buscar conductor a eliminar (simulación)
function buscarConductorEliminar() {
    const documento = document.getElementById('conductor-eliminar').value;

    if (documento) {
        // Simulación de búsqueda
        const conductor = {
            tipoDocumento: 'CC',
            documento: documento,
            nombres: 'Juan Pérez',
            telefono: '1234567890',
            direccion: 'Calle 123 # 45-67',
            vencimientoLicencia: '2025-12-31'
        };

        // Mostrar la información en la sección de resultados
        const resultadoEliminar = document.getElementById('resultado-eliminar-conductor');
        resultadoEliminar.innerHTML = `
            <p><strong>Tipo de Documento:</strong> ${conductor.tipoDocumento}</p>
            <p><strong>Número de Documento:</strong> ${conductor.documento}</p>
            <p><strong>Nombres y Apellidos:</strong> ${conductor.nombres}</p>
            <p><strong>Teléfono:</strong> ${conductor.telefono}</p>
            <p><strong>Dirección:</strong> ${conductor.direccion}</p>
            <p><strong>Vencimiento de Licencia:</strong> ${conductor.vencimientoLicencia}</p>
            <button type="button" onclick="confirmarEliminacion()">Eliminar Conductor</button>
        `;
        resultadoEliminar.style.display = 'block';
    } else {
        mostrarNotificacion('Por favor, ingrese un número de documento válido.', 'error');
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Funcionalidad para confirmar eliminación
function confirmarEliminacion() {
    document.getElementById('modal-eliminar').style.display = 'block';
}

// Funcionalidad para eliminar conductor (simulación)
function eliminarConductor() {
    const password = document.getElementById('password-eliminar').value;
    if (password) {
        mostrarNotificacion('Conductor eliminado correctamente.', 'exito');
        document.getElementById('modal-eliminar').style.display = 'none';
    } else {
        mostrarNotificacion('Por favor, ingrese su contraseña.', 'error');
    }
}

// Cerrar modal de eliminación
function cerrarModalEliminar() {
    document.getElementById('modal-eliminar').style.display = 'none';
}

// Cerrar modal de información del conductor
function cerrarModal() {
    document.getElementById('modal-conductor').style.display = 'none';
}