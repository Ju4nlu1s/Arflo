// Maneja el scroll a las secciones de la página
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Maneja el menú de navegación móvil
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Maneja la acción del botón "Consultar"
function consultarProducto(nombreProducto) {
    const mensaje = encodeURIComponent(`Hola, me gustaría consultar sobre el producto: ${nombreProducto}.`);
    const telefono = "[TuNumeroDeTelefono]"; // Reemplaza con tu número de teléfono
    const url = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(url, '_blank');
}
