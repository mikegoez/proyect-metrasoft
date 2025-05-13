const sgMail = require('@sendgrid/mail'); //importa el cliente de SendGrid
require('dotenv').config(); // carga variables de entorno

// configura la API key de sendgrid desde variables de entorno
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//funcion para enviar correo de recuperacion de contraseña
exports.enviarCorreoRecuperacion = async (email, token) => {

  //genera enlace de recuperacion con token JWT
  const enlace = `${process.env.FRONTEND_URL}/HTML/reset-password.html?token=${token}`; 
 
  // estructura del mensaje electronico

  const msg = {
    to: email, //destinatario
    from: process.env.SMTP_FROM, // remitente autorizado configurado en SendGrid
    subject: 'Restablece tu contraseña', //asusnto del correo
    html: `Haz clic <a href="${enlace}">aquí</a> para restablecer tu contraseña.`, //cuerpo HTML
  };

  try {
    await sgMail.send(msg); // envía el correo mediante la API de sendGrid
    console.log('Correo enviado con éxito'); // registro de éxito
  } catch (error) {
    console.error('Error enviando correo:', error); // registro detallado de errores
    throw error; // propaga el error para manejo externo
  }
};