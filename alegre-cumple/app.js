document.addEventListener('DOMContentLoaded', () => {
    const WHATSAPP_NUMBER = '56933803047';

    // --- LÓGICA DE PESTAÑAS (NUEVA Y ROBUSTA) ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // 1. Quitar 'active' de todos los botones y contenidos
            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.style.backgroundColor = ''; // Limpiar color inline
                b.style.color = '';
            });
            tabContents.forEach(c => c.classList.remove('active'));

            // 2. Activar el botón clickeado y su contenido
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // 3. Colores específicos para cada sección
            if (targetTab === 'listas') {
                btn.style.backgroundColor = '#8b5cf6';
                btn.style.color = 'white';
            } else if (targetTab === 'cumple') {
                btn.style.backgroundColor = '#f59e0b';
                btn.style.color = 'white';
            }
        });
    });

    // --- FORMULARIO 1: ETIQUETAS ---
    const formEtiquetas = document.getElementById('form-etiquetas');
    if (formEtiquetas) {
        formEtiquetas.addEventListener('submit', (e) => {
            e.preventDefault();
            const child = document.getElementById('childName').value;
            const course = document.getElementById('course').value;
            const char = document.getElementById('character').value;

            const msg = `*Hola ARFLO, quiero el Pack de Etiquetas* 🎒\n\n👤 *Niño:* ${child}\n🏫 *Curso:* ${course}\n✨ *Personaje:* ${char}\n\nValor Ref: $10.000`;
            sendWhatsapp(msg);
        });
    }

    // --- FORMULARIO 2: LISTAS ESCOLARES ---
    const formListas = document.getElementById('form-listas');
    if (formListas) {
        formListas.addEventListener('submit', (e) => {
            e.preventDefault();
            const parent = document.getElementById('parentNameList').value;
            const school = document.getElementById('schoolName').value;

            const msg = `*Hola ARFLO, quiero cotizar una Lista Escolar* 📚\n\n👤 *Apoderado:* ${parent}\n🏫 *Colegio:* ${school}\n\n📸 *Adjunto la foto de la lista a continuación:*`;
            sendWhatsapp(msg);
        });
    }

    // --- FORMULARIO 3: CUMPLEAÑOS ---
    const formCumple = document.getElementById('form-cumple');
    if (formCumple) {
        formCumple.addEventListener('submit', (e) => {
            e.preventDefault();
            const needs = document.getElementById('partyNeeds').value;

            const msg = `*Hola ARFLO, consulta por Cumpleaños* 🎂\n\n📝 *Busco lo siguiente:*\n${needs}`;
            sendWhatsapp(msg);
        });
    }

    // Función auxiliar para enviar
    function sendWhatsapp(text) {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
});

