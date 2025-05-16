document.addEventListener("DOMContentLoaded", () => {
  // 1. Configuración de URLs y entorno
  const BASE_URL = window.location.origin;
  const API_URL = BASE_URL; // Usamos la misma URL para API y frontend
  const IS_PRODUCTION = window.location.hostname !== 'localhost';

  console.log(`Conectando a API en: ${API_URL} (${IS_PRODUCTION ? 'Producción' : 'Desarrollo'})`);

  // 2. Función mejorada de redirección
  const safeRedirect = (path) => {
    // Normalización robusta de rutas:
    // - Elimina múltiples barras consecutivas
    // - Asegura que empiece con una barra
    // - Maneja correctamente parámetros de query
    let normalizedPath = path.startsWith('/') ? path : `/${path}`;
    normalizedPath = normalizedPath
      .replace(/\/+/g, '/')
      .replace(/\/$/, '');
    
    // Construcción segura de URL
    const fullUrl = new URL(normalizedPath, BASE_URL).href;
    console.log(`Redirigiendo a: ${fullUrl}`);
    window.location.href = fullUrl;
  };

  // ================== REGISTRO ==================
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // 3. Obtención de valores del formulario
      const correo = document.getElementById("correo_electronico").value;
      const contraseña = document.getElementById("contraseña").value;
      const confirmarContraseña = document.getElementById("confirmar_contraseña").value;
      const rol = document.getElementById("rol").value;

      // 4. Validación básica del cliente
      if (contraseña !== confirmarContraseña) {
        alert("Las contraseñas no coinciden");
        return;
      }

      try {
        // 5. Petición al endpoint de registro
        const response = await fetch(`${API_URL}/api/auth/registro`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ 
            correo_electronico: correo, 
            contraseña: contraseña,
            rol: rol 
          }),
        });
        
        // 6. Manejo de la respuesta
        if (response.ok) {
          console.log("Registro exitoso, redirigiendo a login...");
          safeRedirect("/HTML/login.html");
        } else {
          // Manejo detallado de errores
          const errorData = await response.json().catch(() => ({}));
          console.error("Error en registro:", errorData);
          alert(errorData.error || "Error en el registro. Código: " + response.status);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor. Verifica tu conexión a internet.");
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
        // 7. Petición al endpoint de login con credenciales
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ 
            correo_electronico: correo, 
            contraseña: contraseña 
          }),
          credentials: 'include' // Importante para cookies en producción
        });

        // 8. Manejo de la respuesta de login
        const data = await response.json().catch(() => null);
        
        if (data?.token) {
          // 9. Almacenamiento seguro de credenciales
          localStorage.setItem("jwt", data.token);
          document.cookie = `jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`; // Borra cookie vieja si existe
          localStorage.setItem("userEmail", data.user?.email || correo);
          sessionStorage.setItem("userEmail", data.user?.email || correo);

          console.log("Login exitoso, redirigiendo a index...");
          safeRedirect("/HTML/index.html");
        } else {
          const errorMsg = data?.error || "Credenciales incorrectas";
          console.error("Error en login:", errorMsg);
          alert(errorMsg);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error al conectar con el servidor. Intenta nuevamente.");
      }
    });
  }

  // ========== RECUPERACIÓN DE CONTRASEÑA ==========
  const requestResetForm = document.getElementById("requestResetForm");
  const resetPasswordForm = document.getElementById("resetPasswordForm");

  if (requestResetForm) {
    requestResetForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;

      try {
        const response = await fetch(`${API_URL}/api/auth/solicitar-reset`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          console.log("Correo de recuperación enviado");
          alert("Si el correo existe, recibirás un enlace de recuperación.");
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Error en solicitud de reset:", errorData);
          alert(errorData.error || "Error al procesar la solicitud");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error al procesar la solicitud. Intenta nuevamente.");
      }
    });
  }

  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const token = new URLSearchParams(window.location.search).get('token') || 
                   document.getElementById("token")?.value;

      if (!token) {
        alert("Token de recuperación no válido");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/restablecer-contraseña`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ 
            token: token,
            nuevaContraseña: newPassword 
          }),
        });

        if (response.ok) {
          console.log("Contraseña actualizada correctamente");
          alert("Contraseña actualizada correctamente. Puedes iniciar sesión.");
          safeRedirect("/HTML/login.html");
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Error al restablecer contraseña:", errorData);
          alert(errorData.error || "Error al actualizar la contraseña");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error al actualizar la contraseña. Intenta nuevamente.");
      }
    });
  }

  // ========== MOSTRAR/OCULTAR CONTRASEÑA ==========
  const showPasswordCheckbox = document.getElementById("showPassword");
  if (showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener("change", (e) => {
      const passwordInput = document.getElementById("password");
      if (passwordInput) {
        passwordInput.type = e.target.checked ? "text" : "password";
      }
    });
  }
});

// Polyfill para navegadores antiguos que no soportan window.location.origin
if (!window.location.origin) {
  window.location.origin = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
}