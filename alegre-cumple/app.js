// Configuración
const WHATSAPP_NUMBER = '56933803047'; // Número extraído de tu app.js original

document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Capturar datos
    const childName = document.getElementById('childName').value;
    const course = document.getElementById('course').value;
    const character = document.getElementById('character').value;

    // Crear mensaje ordenado
    const message = `
*¡Hola ARFLO! Quiero pedir el Pack de Etiquetas Escolares* 🎒

📝 *Datos del Pedido:*
---------------------------
👤 *Nombre:* ${childName}
🏫 *Curso:* ${course}
✨ *Personaje:* ${character}
---------------------------
💰 *Valor:* $10.000

_Quedo atento para coordinar el pago._
    `.trim();

    // Codificar URL y abrir WhatsApp
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
});