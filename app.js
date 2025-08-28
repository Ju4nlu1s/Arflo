// Datos de la aplicación
const productosData = [
    {
        id: 1,
        nombre: "Ecolab Solvent Degreaser NC 20 lts",
        categoria: "Desengrasantes",
        precio: 94990,
        descripcion: "Desengrasante industrial concentrado, libre de solventes clorados. Ideal para limpieza de maquinaria pesada.",
        imagen: "placeholder-producto1.jpg",
        destacado: true
    },
    {
        id: 2,
        nombre: "EOX Desengrasante de alto poder 5lts",
        categoria: "Desengrasantes",
        precio: 15990,
        descripcion: "Limpiador alcalino concentrado desarrollado para remover suciedades pesadas presentes en diversas superficies. Es un producto con base acuosa y no inflamable.",
        imagen: "placeholder-producto2.png",
        destacado: true
    },
    {
        id: 3,
        nombre: "Avalco Plus Detergente Desengrasante Alcalino Espumoso 20lts",
        categoria: "Desengrasantes",
        precio: 55990,
        descripcion: "El detergente desengrasante alcalino espumoso 20 litros Avacal Plus es perfecto para remover grasas y suciedad difícil en la industria alimentaria, equipos y diversas superficies.",
        imagen: "placeholder-producto3.jpg",
        destacado: true
    },
    {
        id: 4,
        nombre: "Limpiador Especializado Motor",
        categoria: "Limpiadores",
        precio: 38000,
        descripcion: "Limpiador especializado para motores y componentes mecánicos. Rápida acción desengrasante.",
        imagen: "placeholder-producto4.jpg",
        destacado: false
    },
    {
        id: 5,
        nombre: "Químico Mantenimiento Preventivo",
        categoria: "Químicos",
        precio: 52000,
        descripcion: "Producto químico especializado para mantenimiento preventivo de maquinaria industrial.",
        imagen: "placeholder-producto5.jpg",
        destacado: true
    }
];

const equiposData = [
    {
        id: 101,
        nombre: "Aspiradora Kärcher WD6",
        categoria: "Aspiradoras",
        precio: 180000,
        descripcion: "Aspiradora húmedo-seco profesional. Capacidad 30L, potencia 1300W. Ideal para talleres industriales.",
        imagen: "placeholder-equipo1.jpg",
        destacado: true
    },
    {
        id: 102,
        nombre: "Bomba Centrífuga Ranger R-150",
        categoria: "Bombas",
        precio: 350000,
        descripcion: "Bomba centrífuga industrial, caudal 150 L/min. Construcción robusta para uso intensivo.",
        imagen: "placeholder-equipo2.jpg",
        destacado: false
    },
    {
        id: 103,
        nombre: "Hidrolavadora Alta Presión",
        categoria: "Limpieza",
        precio: 280000,
        descripcion: "Hidrolavadora industrial 2500 PSI. Motor eléctrico, manguera 10m incluida.",
        imagen: "placeholder-equipo3.jpg",
        destacado: true
    },
    {
        id: 104,
        nombre: "Kit Herramientas Limpieza Pro",
        categoria: "Herramientas",
        precio: 95000,
        descripcion: "Kit completo de herramientas profesionales para limpieza industrial. 15 piezas incluidas.",
        imagen: "placeholder-equipo4.jpg",
        destacado: false
    },
    {
        id: 105,
        nombre: "Equipo Protección Química",
        categoria: "Protección",
        precio: 75000,
        descripcion: "Set completo de protección personal para manejo de químicos industriales. Certificado CE.",
        imagen: "placeholder-equipo5.jpg",
        destacado: true
    }
];

// Estado de la aplicación
let carrito = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    loadCartFromStorage();
    renderFeaturedProducts();
    renderProductos();
    renderEquipos();
    setupEventListeners();
    updateCartDisplay();
}

// Event listeners
function setupEventListeners() {
    // Navegación móvil
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Enlaces de navegación - usar delegación de eventos
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-link')) {
            e.preventDefault();
            handleNavClick(e);
        }
        
        if (e.target.matches('.btn[href]')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            if (href.startsWith('#')) {
                scrollToSection(href);
            }
        }
    });

    // Carrito
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cartBtn) cartBtn.addEventListener('click', openCartModal);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartModal);
    if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCartModal);
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

    // Cerrar modal al hacer click fuera
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }

    // Búsqueda y filtros con verificación de existencia
    const searchProductos = document.getElementById('search-productos');
    const filterProductos = document.getElementById('filter-productos');
    const searchEquipos = document.getElementById('search-equipos');
    const filterEquipos = document.getElementById('filter-equipos');
    
    if (searchProductos) searchProductos.addEventListener('input', filterProductos);
    if (filterProductos) filterProductos.addEventListener('change', filterProductos);
    if (searchEquipos) searchEquipos.addEventListener('input', filterEquipos);
    if (filterEquipos) filterEquipos.addEventListener('change', filterEquipos);

    // Formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Navegación
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

function handleNavClick(e) {
    const target = e.target.getAttribute('href');
    const navMenu = document.getElementById('nav-menu');
    
    // Remover clase active de todos los enlaces
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    // Agregar clase active al enlace clickeado
    e.target.classList.add('active');
    
    // Cerrar menú móvil
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    
    // Scroll suave a la sección
    if (target && target.startsWith('#')) {
        scrollToSection(target);
    }
}

function scrollToSection(target) {
    const section = document.querySelector(target);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Renderizado de productos
function renderFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    const allItems = [...productosData, ...equiposData];
    const featuredItems = allItems.filter(item => item.destacado);
    
    featuredContainer.innerHTML = featuredItems.map(item => createProductCard(item)).join('');
}

function renderProductos() {
    const productosContainer = document.getElementById('productos-grid');
    if (!productosContainer) return;
    
    productosContainer.innerHTML = productosData.map(producto => createProductCard(producto)).join('');
}

function renderEquipos() {
    const equiposContainer = document.getElementById('equipos-grid');
    if (!equiposContainer) return;
    
    equiposContainer.innerHTML = equiposData.map(equipo => createProductCard(equipo)).join('');
}

function createProductCard(item) {
    const iconClass = item.id > 100 ? 'fas fa-tools' : 'fas fa-flask';
    
    return `
        <div class="product-card ${item.destacado ? 'featured' : ''}">
            <div class="product-image">
                <i class="${iconClass}"></i>
            </div>
            <div class="product-info">
                <div class="product-category">${item.categoria}</div>
                <h4 class="product-name">${item.nombre}</h4>
                <p class="product-description">${item.descripcion}</p>
                <div class="product-footer">
                    <div class="product-price">$${item.precio.toLocaleString('es-CL')}</div>
                    <button class="add-to-cart" onclick="addToCart(${item.id})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Filtros y búsqueda
function filterProductos() {
    const searchInput = document.getElementById('search-productos');
    const filterSelect = document.getElementById('filter-productos');
    
    if (!searchInput || !filterSelect) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const categoryFilter = filterSelect.value;
    
    const filteredProducts = productosData.filter(producto => {
        const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm) ||
                            producto.descripcion.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || producto.categoria === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    const productosContainer = document.getElementById('productos-grid');
    if (productosContainer) {
        productosContainer.innerHTML = filteredProducts.map(producto => createProductCard(producto)).join('');
    }
}

function filterEquipos() {
    const searchInput = document.getElementById('search-equipos');
    const filterSelect = document.getElementById('filter-equipos');
    
    if (!searchInput || !filterSelect) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const categoryFilter = filterSelect.value;
    
    const filteredEquipos = equiposData.filter(equipo => {
        const matchesSearch = equipo.nombre.toLowerCase().includes(searchTerm) ||
                            equipo.descripcion.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || equipo.categoria === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    const equiposContainer = document.getElementById('equipos-grid');
    if (equiposContainer) {
        equiposContainer.innerHTML = filteredEquipos.map(equipo => createProductCard(equipo)).join('');
    }
}

// Carrito de compras
function addToCart(itemId) {
    const allItems = [...productosData, ...equiposData];
    const item = allItems.find(product => product.id == itemId);
    
    if (!item) return;
    
    const existingItem = carrito.find(cartItem => cartItem.id == itemId);
    
    if (existingItem) {
        existingItem.cantidad++;
    } else {
        carrito.push({
            ...item,
            cantidad: 1
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
    showAddToCartFeedback();
}

function removeFromCart(itemId) {
    carrito = carrito.filter(item => item.id != itemId);
    updateCartDisplay();
    saveCartToStorage();
    renderCartItems();
}

function updateQuantity(itemId, change) {
    const item = carrito.find(cartItem => cartItem.id == itemId);
    if (item) {
        item.cantidad += change;
        if (item.cantidad <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartDisplay();
            saveCartToStorage();
            renderCartItems();
        }
    }
}

function updateCartDisplay() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.remove('hidden');
        renderCartItems();
    }
}

function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.add('hidden');
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
        cartTotalElement.textContent = '0';
        return;
    }
    
    const itemsHTML = carrito.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-price">$${item.precio.toLocaleString('es-CL')} CLP</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    cartItemsContainer.innerHTML = itemsHTML;
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    cartTotalElement.textContent = total.toLocaleString('es-CL');
}

function handleCheckout() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const itemsList = carrito.map(item => `• ${item.nombre} x${item.cantidad}`).join('\n');
    
    const message = `¡Hola! Me interesa realizar el siguiente pedido:\n\n${itemsList}\n\nTotal: $${total.toLocaleString('es-CL')} CLP\n\n¿Podrían confirmarme la disponibilidad y proceso de compra?`;
    
    const phoneNumber = '56933803047';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

function showAddToCartFeedback() {
    // Crear elemento de feedback
    const feedback = document.createElement('div');
    feedback.textContent = '¡Producto agregado al carrito!';
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1001;
        opacity: 1;
        transition: opacity 0.3s ease-out;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 300);
    }, 2500);
}

// Persistencia del carrito
function saveCartToStorage() {
    try {
        if (typeof Storage !== 'undefined') {
            localStorage.setItem('carrito', JSON.stringify(carrito));
        }
    } catch (error) {
        console.log('LocalStorage no disponible');
    }
}

function loadCartFromStorage() {
    try {
        if (typeof Storage !== 'undefined') {
            const savedCart = localStorage.getItem('carrito');
            if (savedCart) {
                carrito = JSON.parse(savedCart);
            }
        }
    } catch (error) {
        console.log('Error cargando carrito desde localStorage');
        carrito = [];
    }
}

// Formulario de contacto
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono') || 'No proporcionado',
        mensaje: formData.get('mensaje')
    };
    
    // Crear mensaje para WhatsApp
    const message = `Consulta desde sitio web:\n\nNombre: ${data.nombre}\nEmail: ${data.email}\nTeléfono: ${data.telefono}\n\nMensaje:\n${data.mensaje}`;
    
    const phoneNumber = '56933803047';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Limpiar formulario
    e.target.reset();
    
    // Mostrar mensaje de confirmación
    showContactConfirmation();
}

function showContactConfirmation() {
    const confirmation = document.createElement('div');
    confirmation.textContent = '¡Mensaje enviado! Te contactaremos pronto.';
    confirmation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--color-success);
        color: white;
        padding: 20px 40px;
        border-radius: 8px;
        z-index: 1001;
        text-align: center;
        box-shadow: var(--shadow-lg);
        opacity: 1;
        transition: opacity 0.3s ease-out;
    `;
    
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.style.opacity = '0';
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.remove();
            }
        }, 300);
    }, 2500);
}

// Hacer funciones globales para usar en HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
