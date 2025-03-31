document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo_electronico: username,  // Ajusta según tu backend
                contraseña: password
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token); // Guarda el token JWT
            window.location.href = '../HTML/index.html'; // Redirige al dashboard
        } else {
            alert(data.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
});

// Script para mostrar/ocultar contraseña
document.getElementById('showPassword').addEventListener('change', function() {
    const passwordField = document.getElementById('password');
    passwordField.type = this.checked ? 'text' : 'password';
});