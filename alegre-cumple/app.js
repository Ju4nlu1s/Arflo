const WHATSAPP_NUMBER = '56933803047';

// --- LOGICA DE PESTAÑAS ---
window.openTab = function(tabName) {
    // 1. Ocultar todos los contenidos
    const contents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < contents.length; i++) {
        contents[i].classList.remove("active");
    }

    // 2. Desactivar todos los botones
    const buttons = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
        // Restaurar color original si cambiamos de tab
        buttons[i].style.backgroundColor = ""; 
        buttons[i].style.color = "";
    }

    // 3. Mostrar el contenido seleccionado
    document.getElementById(tabName).classList.add("active");

    // 4. Activar el botón seleccionado (y darle color específico según sección)
    const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(tabName));
    activeBtn.classList.add("active");
    
    // Colores dinámicos para el botón activo
    if(tabName === 'listas') {
        activeBtn.style.backgroundColor = '#8b5cf6'; // Violeta
        activeBtn.style.color = 'white';
    } else if (tabName === 'cumple') {
        activeBtn.style.backgroundColor = '#f59e0b'; // Naranja
        activeBtn.style.color = 'white';
    }
}

// --- FORMULARIO 1: ETIQUETAS ---
document.getElementById('form-etiquetas').addEventListener('submit', function(e) {
    e.preventDefault();
    const child = document.getElementById('childName').value;
    const course = document.getElementById('course').value;
    const char = document.getElementById('character').value;

    const msg = `*Hola ARFLO, quiero el Pack de Etiquetas* 🎒\n\n👤 *Niño:* ${child}\n🏫 *Curso:* ${course}\n✨ *Personaje:* ${char}\n\nValor Ref: $10.000`;
    sendWhatsapp(msg);
});

// --- FORMULARIO 2: LISTAS ESCOLARES ---
document.getElementById('form-listas').addEventListener('submit', function(e) {
    e.preventDefault();
    const parent = document.getElementById('parentNameList').value;
    const school = document.getElementById('schoolName').value;

    const msg = `*Hola ARFLO, quiero cotizar una Lista Escolar* 📚\n\n👤 *Apoderado:* ${parent}\n🏫 *Colegio:* ${school}\n\n📸 *Adjunto la foto de la lista a continuación:*`;
    sendWhatsapp(msg);
});

// --- FORMULARIO 3: CUMPLEAÑOS ---
document.getElementById('form-cumple').addEventListener('submit', function(e) {
    e.preventDefault();
    const needs = document.getElementById('partyNeeds').value;

    const msg = `*Hola ARFLO, consulta por Cumpleaños* 🎂\n\n📝 *Busco lo siguiente:*\n${needs}`;
    sendWhatsapp(msg);
});

// Función auxiliar para enviar
function sendWhatsapp(text) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}
