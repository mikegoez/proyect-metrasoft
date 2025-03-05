// Mostrar la subsección seleccionada
function mostrarSubseccion(subseccion) {
    const subsecciones = document.querySelectorAll('.subsection');
    subsecciones.forEach(subsec => subsec.style.display = 'none');
    document.getElementById(subseccion).style.display = 'block';
}

// Manejar el envío del formulario de creación de vehículo
document.getElementById('form-crear-vehiculo').addEventListener('submit', function (event) {
    event.preventDefault();
    mostrarNotificacion('Vehículo creado exitosamente.', 'exito');
    this.reset();
});

// Función para buscar vehículo (simulación)
function buscarVehiculo() {
    const placa = document.getElementById('placa-consulta').value;
    if (placa) {
        mostrarNotificacion(`Buscando vehículo con placa: ${placa}`, 'exito');
        // Aquí iría la lógica para buscar el vehículo en la base de datos
    } else {
        mostrarNotificacion('Por favor, ingrese una placa válida.', 'error');
    }
}

// Función para buscar vehículo a eliminar (simulación)
function buscarVehiculoEliminar() {
    const placa = document.getElementById('placa-eliminar').value;
    if (placa) {
        mostrarNotificacion(`Buscando vehículo para eliminar con placa: ${placa}`, 'exito');
        // Aquí iría la lógica para buscar y eliminar el vehículo
    } else {
        mostrarNotificacion('Por favor, ingrese una placa válida.', 'error');
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

// Funcionalidad para eliminar vehículo (simulación)
function eliminarVehiculo() {
    const password = document.getElementById('password-eliminar').value;
    if (password) {
        mostrarNotificacion('Vehículo eliminado correctamente.', 'exito');
        document.getElementById('modal-eliminar').style.display = 'none';
    } else {
        mostrarNotificacion('Por favor, ingrese su contraseña.', 'error');
    }
}

// Cerrar modal de eliminación
function cerrarModalEliminar() {
    document.getElementById('modal-eliminar').style.display = 'none';
}

// Cerrar modal de información del vehículo
function cerrarModal() {
    document.getElementById('modal-vehiculo').style.display = 'none';
}

//simulaciones// ------------------
// Función para buscar vehículo (simulación)
function buscarVehiculo() {
    const placa = document.getElementById('placa-consulta').value;
    if (placa) {
        // Simulación de búsqueda
        const vehiculo = {
            placa: 'XYZ123',
            modelo: 'Toyota Corolla',
            tipoCarga: 'Pasajeros',
            capacidadPuestos: 5,
            capacidadKG: 500,
            tipoVehiculo: 'Transporte público de pasajeros',
            vencimientoSOAT: '2023-11-25',
            vencimientoTecnomecanica: '2024-01-15'
        };

        // Mostrar la información en el modal
        const detalleVehiculo = document.getElementById('detalle-vehiculo');
        detalleVehiculo.innerHTML = `
            <p><strong>Placa:</strong> ${vehiculo.placa}</p>
            <p><strong>Modelo:</strong> ${vehiculo.modelo}</p>
            <p><strong>Tipo de Carga:</strong> ${vehiculo.tipoCarga}</p>
            <p><strong>Capacidad Puestos:</strong> ${vehiculo.capacidadPuestos}</p>
            <p><strong>Capacidad KG:</strong> ${vehiculo.capacidadKG}</p>
            <p><strong>Tipo de Vehículo:</strong> ${vehiculo.tipoVehiculo}</p>
            <p><strong>Vencimiento SOAT:</strong> ${vehiculo.vencimientoSOAT}</p>
            <p><strong>Vencimiento Tecnomecánica:</strong> ${vehiculo.vencimientoTecnomecanica}</p>
        `;

        // Mostrar el modal
        document.getElementById('modal-vehiculo').style.display = 'block';
    } else {
        mostrarNotificacion('Por favor, ingrese una placa válida.', 'error');
    }
}

// Función para buscar vehículo a eliminar (simulación)
function buscarVehiculoEliminar() {
    const placa = document.getElementById('placa-eliminar').value;
    if (placa) {
        // Simulación de búsqueda
        const vehiculo = {
            placa: 'XYZ123',
            modelo: 'Toyota Corolla',
            tipoCarga: 'Pasajeros'
        };

        // Mostrar la información en la sección de resultados
        const resultadoEliminar = document.getElementById('resultado-eliminar');
        resultadoEliminar.innerHTML = `
            <p><strong>Placa:</strong> ${vehiculo.placa}</p>
            <p><strong>Modelo:</strong> ${vehiculo.modelo}</p>
            <p><strong>Tipo de Carga:</strong> ${vehiculo.tipoCarga}</p>
            <button type="button" onclick="confirmarEliminacion()">Eliminar Vehículo</button>
        `;
        resultadoEliminar.style.display = 'block';
    } else {
        mostrarNotificacion('Por favor, ingrese una placa válida.', 'error');
    }
}