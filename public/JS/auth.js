document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : window.location.origin;

  console.log("Conectando a API en:", API_URL); // Para depuración

  const safeRedirect = (path) => {
    if (process.env.NODE_ENV === "production") {
      window.location.href = path.startsWith("/") ? path.slice(1) : path;
    } else {
      window.location.href = path;
    }
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
        const response = await fetch(`${API_URL}/api/auth/registro`, { // URL dinámica
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            correo_electronico: correo, 
            contraseña: contraseña,
            rol: rol 
          }),
        });
        
        if (response.ok) {
          window.location.href = "HTML/login.html";
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
        const response = await fetch(`${API_URL}/api/auth/login`, { // URL dinámica
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
          
          const redirectPath = window.location.hostname === 'localhost' 
          ? 'HTML/index.html' 
          : '/HTML/index.html';
          
          window.location.href = redirectPath;
        } 
        else {
          alert(data.error || "Credenciales incorrectas");
        }
      } catch (error) {
        alert("Error al conectar con el servidor");
      }
    });
  }

  // ========== RECUPERACIÓN DE CONTRASEÑA ==========
  const requestResetForm = document.getElementById("requestResetForm");
  const resetPasswordForm = document.getElementById("resetPasswordForm");

  // Solicitar enlace de recuperación
  if (requestResetForm) {
    requestResetForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;

      try {
        const response = await fetch(`${API_URL}/api/auth/solicitar-reset`, { // URL dinámica
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          alert("Enlace de recuperación enviado a tu correo");
        } else {
          const errorData = await response.json();
          alert(errorData.error);
        }
      } catch (error) {
        alert("Error al procesar la solicitud");
      }
    });
  }

  // Restablecer contraseña con token
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
        const response = await fetch(`${API_URL}/api/auth/restablecer-contraseña`, { // URL dinámica
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            token: token,
            nuevaContraseña: newPassword 
          }),
        });

        if (response.ok) {
          alert("Contraseña actualizada correctamente");
          window.location.href = "HTML/login.html";
        } else {
          const errorData = await response.json();
          alert(errorData.error);
        }
      } catch (error) {
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