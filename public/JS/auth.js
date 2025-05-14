document.addEventListener("DOMContentLoaded", function() {
    // 1. Configuración de la URL de la API
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : window.location.origin;

    console.log("Conectando a API en:", API_URL);

    // 2. Verificación inicial de autenticación
    verificarAutenticacion();

    // 3. Función para verificar estado de autenticación
    function verificarAutenticacion() {
        const token = localStorage.getItem('token');
        const rutaActual = window.location.pathname;
        
        // Rutas públicas que no requieren autenticación
        const rutasPublicas = [
            '/HTML/login.html',
            '/HTML/register.html',
            '/HTML/reset-password.html'
        ];

        // Si no hay token y no está en una ruta pública, redirigir a login
        if (!token && !rutasPublicas.includes(rutaActual)) {
            window.location.href = '/HTML/login.html';
            return;
        }

        // Si hay token y está en login/register, redirigir a index
        if (token && rutasPublicas.includes(rutaActual)) {
            window.location.href = '/HTML/index.html';
        }
    }

    // 4. Configuración del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Mostrar/ocultar contraseña
        const showPasswordCheckbox = document.getElementById('showPassword');
        const passwordInput = document.getElementById('password');
        
        if (showPasswordCheckbox && passwordInput) {
            showPasswordCheckbox.addEventListener('change', function(e) {
                passwordInput.type = e.target.checked ? 'text' : 'password';
            });
        }

        // Manejo del envío del formulario
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Mostrar estado de carga
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Validando...';
                submitBtn.disabled = true;

                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo_electronico: email,
                        contraseña: password
                    })
                });

                const data = await response.json();

                // Restaurar botón
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

                if (!response.ok) {
                    throw new Error(data.error || 'Credenciales incorrectas');
                }

                // Guardar token y redirigir
                localStorage.setItem('token', data.token);
                sessionStorage.setItem('userEmail', email);
                
                // Verificar si hay una ruta previa guardada
                const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/HTML/index.html';
                sessionStorage.removeItem('redirectAfterLogin');
                
                window.location.href = redirectPath;

            } catch (error) {
                console.error('Error en login:', error);
                mostrarAlerta('error', error.message || 'Error al iniciar sesión');
                
                // Restaurar botón en caso de error
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.innerHTML = 'Ingresar';
                    submitBtn.disabled = false;
                }
            }
        });
    }

    // 5. Configuración del formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('correo_electronico').value;
            const password = document.getElementById('contraseña').value;
            const confirmPassword = document.getElementById('confirmar_contraseña').value;
            const rol = document.getElementById('rol').value;

            // Validación básica
            if (password !== confirmPassword) {
                mostrarAlerta('error', 'Las contraseñas no coinciden');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/auth/registro`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo_electronico: email,
                        contraseña: password,
                        rol: rol
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Error en el registro');
                }

                mostrarAlerta('success', 'Registro exitoso. Redirigiendo...');
                setTimeout(() => {
                    window.location.href = '/HTML/login.html';
                }, 1500);

            } catch (error) {
                console.error('Error en registro:', error);
                mostrarAlerta('error', error.message || 'Error al registrar usuario');
            }
        });
    }

    // 6. Configuración del formulario de recuperación de contraseña
    const requestResetForm = document.getElementById('requestResetForm');
    if (requestResetForm) {
        requestResetForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;

            try {
                const response = await fetch(`${API_URL}/api/auth/solicitar-reset`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al solicitar recuperación');
                }

                mostrarAlerta('success', 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña');

            } catch (error) {
                console.error('Error en solicitud de reset:', error);
                mostrarAlerta('error', error.message || 'Error al procesar la solicitud');
            }
        });
    }

    // 7. Configuración del formulario de restablecimiento de contraseña
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const token = document.getElementById('token').value;

            if (newPassword !== confirmPassword) {
                mostrarAlerta('error', 'Las contraseñas no coinciden');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/auth/restablecer-contraseña`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        token: token,
                        nuevaContraseña: newPassword 
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al restablecer contraseña');
                }

                mostrarAlerta('success', 'Contraseña actualizada correctamente. Redirigiendo...');
                setTimeout(() => {
                    window.location.href = '/HTML/login.html';
                }, 1500);

            } catch (error) {
                console.error('Error en restablecimiento:', error);
                mostrarAlerta('error', error.message || 'Error al actualizar la contraseña');
            }
        });
    }

    // 8. Función para mostrar alertas
    function mostrarAlerta(tipo, mensaje) {
        // Eliminar alertas existentes
        const alertasExistentes = document.querySelectorAll('.alert-flotante');
        alertasExistentes.forEach(alerta => alerta.remove());

        // Crear nueva alerta
        const alerta = document.createElement('div');
        alerta.className = `alert-flotante alert alert-${tipo}`;
        alerta.textContent = mensaje;
        alerta.style.position = 'fixed';
        alerta.style.top = '20px';
        alerta.style.right = '20px';
        alerta.style.zIndex = '9999';
        alerta.style.minWidth = '300px';
        alerta.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';

        document.body.appendChild(alerta);

        // Auto-eliminación después de 5 segundos
        setTimeout(() => {
            alerta.style.opacity = '0';
            alerta.style.transition = 'opacity 0.5s ease';
            setTimeout(() => alerta.remove(), 500);
        }, 5000);
    }

    // 9. Manejo de logout
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('token');
            sessionStorage.removeItem('userEmail');
            window.location.href = '/HTML/login.html';
        });
    }

    // 10. Verificación de token en páginas protegidas
    const paginasProtegidas = [
        '/HTML/index.html',
        '/HTML/vehiculos.html',
        '/HTML/conductores.html',
        '/HTML/despachos.html',
        '/HTML/notificaciones.html'
    ];

    if (paginasProtegidas.includes(window.location.pathname)) {
        const token = localStorage.getItem('token');
        if (!token) {
            // Guardar la ruta actual para redirigir después del login
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            window.location.href = '/HTML/login.html';
        }
    }
});