// Mostrar la sección seleccionada
function mostrarSeccion(seccion) {
    const secciones = document.querySelectorAll('.section');
    secciones.forEach(sec => sec.classList.remove('active'));
    document.getElementById(seccion).classList.add('active');
}

// Manejar el envío del formulario de creación de despacho
document.getElementById('form-crear-despacho').addEventListener('submit', function (event) {
    event.preventDefault();
    mostrarNotificacion('Despacho creado exitosamente.', 'exito');
    this.reset();
});

// Función para buscar despacho (simulación)
function buscarDespacho() {
    const codigo = document.getElementById('codigo-consulta').value;
    if (codigo) {
        // Simulación de búsqueda
        const despacho = {
            codigo: codigo,
            vehiculo: 'XYZ123',
            conductor: 'Juan Pérez',
            tipoCarga: 'Masivo Pasajeros',
            destino: 'Bogotá',
            capacidad: '50 pasajeros',
            fecha: '2023-11-25',
            hora: '08:00'
        };

        // Mostrar la información en la sección de resultados
        const resultadoDespacho = document.getElementById('resultado-despacho');
        resultadoDespacho.innerHTML = `
            <p><strong>Código:</strong> ${despacho.codigo}</p>
            <p><strong>Vehículo:</strong> ${despacho.vehiculo}</p>
            <p><strong>Conductor:</strong> ${despacho.conductor}</p>
            <p><strong>Tipo de Carga:</strong> ${despacho.tipoCarga}</p>
            <p><strong>Destino:</strong> ${despacho.destino}</p>
            <p><strong>Capacidad:</strong> ${despacho.capacidad}</p>
            <p><strong>Fecha:</strong> ${despacho.fecha}</p>
            <p><strong>Hora:</strong> ${despacho.hora}</p>
        `;
        resultadoDespacho.style.display = 'block';
    } else {
        mostrarNotificacion('Por favor, ingrese un código válido.', 'error');
    }
}

// Función para buscar despacho a eliminar (simulación)
function buscarDespachoEliminar() {
    const codigo = document.getElementById('codigo-eliminar').value;
    if (codigo) {
        // Simulación de búsqueda
        const despacho = {
            codigo: codigo,
            vehiculo: 'XYZ123',
            conductor: 'Juan Pérez',
            tipoCarga: 'Masivo Pasajeros',
            destino: 'Bogotá',
            capacidad: '50 pasajeros',
            fecha: '2023-11-25',
            hora: '08:00'
        };

        // Mostrar la información en la sección de resultados
        const resultadoEliminar = document.getElementById('resultado-eliminar');
        resultadoEliminar.innerHTML = `
            <p><strong>Código:</strong> ${despacho.codigo}</p>
            <p><strong>Vehículo:</strong> ${despacho.vehiculo}</p>
            <p><strong>Conductor:</strong> ${despacho.conductor}</p>
            <p><strong>Tipo de Carga:</strong> ${despacho.tipoCarga}</p>
            <p><strong>Destino:</strong> ${despacho.destino}</p>
            <p><strong>Capacidad:</strong> ${despacho.capacidad}</p>
            <p><strong>Fecha:</strong> ${despacho.fecha}</p>
            <p><strong>Hora:</strong> ${despacho.hora}</p>
            <button type="button" onclick="confirmarEliminacion()">Eliminar Despacho</button>
        `;
        resultadoEliminar.style.display = 'block';
    } else {
        mostrarNotificacion('Por favor, ingrese un código válido.', 'error');
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

// Funcionalidad para eliminar despacho (simulación)
function eliminarDespacho() {
    const password = document.getElementById('password-eliminar').value;
    if (password) {
        mostrarNotificacion('Despacho eliminado correctamente.', 'exito');
        document.getElementById('modal-eliminar').style.display = 'none';
    } else {
        mostrarNotificacion('Por favor, ingrese su contraseña.', 'error');
    }
}

// Cerrar modal de eliminación
function cerrarModalEliminar() {
    document.getElementById('modal-eliminar').style.display = 'none';
}