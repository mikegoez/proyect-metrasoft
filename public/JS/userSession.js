const token = localStorage.getItem("token");
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  document.getElementById("user-email").textContent = payload.correo_electronico;
}