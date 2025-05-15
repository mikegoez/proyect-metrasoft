document.addEventListener("DOMContentLoaded", () => {
  // Configuración universal para desarrollo y producción
  const BASE_URL = window.location.origin;
  const API_URL = BASE_URL;
  const IS_PRODUCTION = window.location.hostname !== 'localhost';

  console.log(`Conectando a API en: ${API_URL} (${IS_PRODUCTION ? 'Producción' : 'Desarrollo'})`);

  // Redirección segura mejorada
  const safeRedirect = (path) => {
    // Normalizar la ruta eliminando duplicados y barras innecesarias
    let normalizedPath = path.startsWith('/') ? path : `/${path}`;
    normalizedPath = normalizedPath.replace(/\/+/g, '/').replace(/\/$/, '');
    
    // Construir URL completa
    const fullUrl = `${BASE_URL}${normalizedPath}`;
    console.log(`Redirigiendo a: ${fullUrl}`);
    window.location.href = fullUrl;
  };

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
        const response = await fetch(`${API_URL}/api/auth/registro`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            correo_electronico: correo, 
            contraseña: contraseña,
            rol: rol 
          }),
        });
        
        if (response.ok) {
          console.log("Registro exitoso, redirigiendo a login...");
          safeRedirect("/HTML/login.html");
        } else {
          const errorData = await response.json();
          console.error("Error en registro:", errorData);
          alert(errorData.error || "Error en el registro");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
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
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            correo_electronico: correo, 
            contraseña: contraseña 
          }),
        });

        const data = await response.json();
        
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("Login exitoso, redirigiendo a index...");
          safeRedirect("/HTML/index.html");
        } else {
          console.error("Credenciales incorrectas:", data.error);
          alert(data.error || "Credenciales incorrectas");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error al conectar con el servidor");
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          console.log("Correo de recuperación enviado");
          alert("Enlace de recuperación enviado a tu correo");
        } else {
          const errorData = await response.json();
          console.error("Error en solicitud de reset:", errorData);
          alert(errorData.error);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error al procesar la solicitud");
      }
    });
  }

  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const token = document.getElementById("token").value;

      if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/restablecer-contraseña`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            token: token,
            nuevaContraseña: newPassword 
          }),
        });

        if (response.ok) {
          console.log("Contraseña actualizada correctamente");
          alert("Contraseña actualizada correctamente");
          safeRedirect("/HTML/login.html");
        } else {
          const errorData = await response.json();
          console.error("Error al restablecer contraseña:", errorData);
          alert(errorData.error);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error al actualizar la contraseña");
      }
    });
  }

  // ========== MOSTRAR/OCULTAR CONTRASEÑA ==========
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
  window.location.origin = window.location.protocol + "//" + 
                         window.location.hostname + 
                         (window.location.port ? ':' + window.location.port : '');
}