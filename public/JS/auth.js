document.addEventListener("DOMContentLoaded", () => {
    // ================== CONFIGURACIÓN GENERAL ==================
    const BASE_URL = window.location.origin;

    // ================== REGISTRO ==================
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const correo = document.getElementById("correo_electronico").value;
            const contraseña = document.getElementById("contraseña").value;
            const confirmarContraseña = document.getElementById("confirmar_contraseña").value;
            const rol = document.getElementById("rol").value;

            if (contraseña !== confirmarContraseña) {
                alert("Las contraseñas no coinciden");
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/api/auth/registro`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        correo_electronico: correo, 
                        contraseña: contraseña,
                        rol: rol 
                    }),
                });

                if (response.ok) {
                    window.location.href = "/HTML/login.html";
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || "Error en el registro");
                }
            } catch (error) {
                alert("Error de conexión con el servidor");
            }
        });
    }

    // ================== LOGIN ==================
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const correo = document.getElementById("email").value;
            const contraseña = document.getElementById("password").value;

            try {
                const response = await fetch(`${BASE_URL}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        correo_electronico: correo, 
                        contraseña: contraseña 
                    }),
                    credentials: 'include'
                });

                if (response.ok) {
                    window.location.href = "/HTML/index.html"; 
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || "Credenciales incorrectas");
                }
            } catch (error) {
                alert("Error de conexión con el servidor");
            }
        });
    }

    // ================== RECUPERACIÓN DE CONTRASEÑA ==================
    const requestResetForm = document.getElementById("requestResetForm");
    if (requestResetForm) {
        requestResetForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;

            try {
                const response = await fetch(`${BASE_URL}/api/auth/solicitar-reset`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    alert("Si el correo existe, recibirás un enlace de recuperación.");
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || "Error al procesar la solicitud");
                }
            } catch (error) {
                alert("Error de conexión con el servidor");
            }
        });
    }

    const resetPasswordForm = document.getElementById("resetPasswordForm");
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById("newPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const token = new URLSearchParams(window.location.search).get('token') || 
                         document.getElementById("token")?.value;

            if (!token) {
                alert("Token inválido");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/api/auth/restablecer-contraseña`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        token: token,
                        nuevaContraseña: newPassword 
                    }),
                });

                if (response.ok) {
                    alert("Contraseña actualizada correctamente");
                    window.location.href = "/HTML/login.html";
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || "Error al actualizar la contraseña");
                }
            } catch (error) {
                alert("Error de conexión con el servidor");
            }
        });
    }

    // ================== MOSTRAR/OCULTAR CONTRASEÑA ==================
    const showPasswordCheckbox = document.getElementById("showPassword");
    if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener("change", (e) => {
            const passwordInput = document.getElementById("password");
            passwordInput.type = e.target.checked ? "text" : "password";
        });
    }
});

// Polyfill para navegadores antiguos
if (!window.location.origin) {
    window.location.origin = `${window.location.protocol}//${window.location.host}`;
}
