const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Ejemplo para Gmail
  auth: {
    user: "tucorreo@gmail.com", // Tu correo
    pass: "tucontraseña", // Tu contraseña de aplicación (no la personal)
  },
});

exports.enviarCorreoRecuperacion = async (email, token) => {
  const enlace = `http://localhost:3000/HTML/reset-password.html?token=${token}`;
  
  await transporter.sendMail({
    from: '"Metrasoft" <soporte@metrasoft.com>',
    to: email,
    subject: "Restablece tu contraseña",
    html: `Haz clic <a href="${enlace}">aquí</a> para restablecer tu contraseña.`,
  });
};