emailjs.init("PUBLIC_KEY"); // Reemplaza con tu ID de usuario de EmailJS

const sendBtn = document.querySelector('.send-btn');
const result = document.querySelector('.result');

sendBtn.addEventListener('click', sendEmail);

function sendEmail() {
    // Obtener los datos del formulario
    const to = document.getElementById("to").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Enviar el correo usando EmailJS
    emailjs.send("SERVICE_ID", "TEMPLATE_ID", {
        to_email: to,
        subject: subject,
        message: message
    })
        .then(function () {
            result.innerHTML = "¡Correo enviado exitosamente!";
            result.style.opacity = 1;
        }, function (error) {
            result.innerHTML = "¡Error al enviar el correo!";
            result.style.opacity = 1;
        });
}