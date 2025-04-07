const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.enviarCorreoRecuperacion = async (email, token) => {
  const enlace = `http://localhost:3000/HTML/reset-password.html?token=${token}`;

  const msg = {
    to: email,
    from: process.env.SMTP_FROM,
    subject: 'Restablece tu contraseña',
    html: `Haz clic <a href="${enlace}">aquí</a> para restablecer tu contraseña.`,
  };

  try {
    await sgMail.send(msg);
    console.log('Correo enviado con éxito');
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw error;
  }
};