document.addEventListener("DOMContentLoaded", () => {
  // REGISTRO DE USUARIOS 
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      //obtener valores del formulario 
      const correo = document.getElementById("correo_electronico").value;
      const contraseña = document.getElementById("contraseña").value;
      const confirmarContraseña = document.getElementById("confirmar_contraseña").value;
      const rol = document.getElementById("rol").value;

      // validar contraseñas coincidan
      if (contraseña !== confirmarContraseña) {
        alert("Las contraseñas no coinciden");
        return;
      }

      try {
        //eviar solicitudes de registro al backend 
        const response = await fetch("http://localhost:3000/api/auth/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            correo_electronico: correo, 
            contraseña: contraseña,
            rol: rol 
          }),
        });
        // manejar respuestas del servidor
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

  //inicui de sesion 
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // obtener credenciales
      const correo = document.getElementById("email").value;
      const contraseña = document.getElementById("password").value;

      try {
        //para autenticar usuario
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            correo_electronico: correo, 
            contraseña: contraseña 
          }),
        });

        const data = await response.json();
        //para almacenar token y datois de sesion 
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          sessionStorage.setItem("userEmail", correo);
          window.location.href = "../HTML/index.html";
        } else {
          alert(data.error || "Credenciales incorrectas");
        }
      } catch (error) {
        alert("Error al conectar con el servidor");
      }
    });
  }

  // recuperacion de contraseña
  const requestResetForm = document.getElementById("requestResetForm");
  const resetPasswordForm = document.getElementById("resetPasswordForm");

  // solicitar enlace de recuperación
  if (requestResetForm) {
    requestResetForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;

      try {
        //enviar solicitud de reset
        const response = await fetch("http://localhost:3000/api/auth/solicitar-reset", {
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
      //validar nueva contraseña
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const token = document.getElementById("token").value;

      if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      try {
        //enviar nueva contraseña al backend
        const response = await fetch("http://localhost:3000/api/auth/restablecer-contraseña", {
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
          alert(errorData.error);
        }
      } catch (error) {
        alert("Error al actualizar la contraseña");
      }
    });
  }

  // MOSTRAR/OCULTAR CONTRASEÑA
  const showPasswordCheckbox = document.getElementById("showPassword");
  if (showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener("change", (e) => {
      //cambiar tipo de input segun checkbox
      const passwordInput = document.getElementById("password");
      passwordInput.type = e.target.checked ? "text" : "password";
    });
  }
});