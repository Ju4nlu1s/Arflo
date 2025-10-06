document.addEventListener('DOMContentLoaded', () => {

    // --- DATOS DE LA APLICACIÓN (Basado en el Catálogo PDF) ---
    const WHATSAPP_NUMBER = '56933803047'; // Número de teléfono para WhatsApp

    // Insumos con precio visible y opción de compra
    const insumosData = [
        { id: 1, nombre: "Desengrasante de alto poder", desc: "Marca EOX. Solución industrial para grasas pesadas.", precio: 13500, imagen: '27.png', categoria: "Quimicos" },
        { id: 2, nombre: "Grasa Líquida Adhesiva", desc: "Marca EOX. Agente lubricante universal para piezas que se encuentran bajo alta presion.", precio: 11500, imagen: '21.png', categoria: "Quimicos" },
        { id: 3, nombre: "Desoxidante", desc: "Marca EOX. Producto de uso multiple que desprende de manera rapida el oxido fuertemente adherido.", precio: 4300, imagen: '22.png', categoria: "Quimicos" },
        { id: 4, nombre: "Solvente Dielectrico 40NC 5L", desc: "Marca EOX. producto que remueve grasas, aceites y suciedades pesadas sin dejar residuos y con una rápida tasa de secado. Está formulado en base a solventes libres de cloro flúor carbono (CFC) con el propósito de proteger el medio ambiente.", precio: 32450, imagen: '23.png', categoria: "Químicos" },
        { id: 5, nombre: "Limpiador de manos", desc: "Marca EOX.  elimina facilmente aceites, grasas y suciedades pesadas de las manos.", precio: 6400, imagen: '24.png', categoria: "Quimicos" },
        { id: 6, nombre: "Pad negro", desc: "Disco abrasivo 17 pulg", precio: 6400, imagen: '31.png', categoria: "Quimicos" },
        { id: 7, nombre: "Pad blanco", desc: "Disco Pulidor 17 pulg", precio: 6400, imagen: '32.png', categoria: "Químicos" },
        { id: 8, nombre: "Pad rojo", desc: "Disco abrillantador 17 pulg", precio: 6400, imagen: '30.png', categoria: "Quimicos" },
        { id: 9, nombre: "Mascarillas Techdent 3 pliegues", desc: "Caja de 50 unidades.", precio: 1980, imagen: '9.png', categoria: "Desechables" },
        { id: 10, nombre: "Cubre Calzado", desc: "Paquete de 50 unidades.", precio: 2750, imagen: '3.png', categoria: "Desechables" },
        { id: 11, nombre: "Alcohol Desnaturalizado 1L", desc: "Marca Dilem Pharme.", precio: 4190, imagen: '8.png', categoria: "Químicos" },
        { id: 12, nombre: "Guantes Industriales Nitrilo Verde", desc: "Marca Adicare, No. 8.", precio: 2650, imagen: '6.png', categoria: "Guantes" },
        { id: 13, nombre: "Alcohol Isopropílico", desc: "Formato de 1 litro.", precio: 6850, imagen: '2.png', categoria: "Químicos" },
        { id: 14, nombre: "Guantes de Nitrilo S/P", desc: "Talla M, caja de 100U.", precio: 4690, imagen: '4.png', categoria: "Guantes" },
        { id: 15, nombre: "Guantes de Vinilo S/P", desc: "Talla M, caja de 100U.", precio: 3790, imagen: '4.png', categoria: "Guantes" },
        { id: 16, nombre: "Virutilla liquida", desc: "Formato 1 litro", precio: 4250, imagen: '14.png', categoria: "Quimicos" }
    ];

    // Productos Químicos sin precio (para consultar)
    const productosQuimicosData = [
        { id: 101, nombre: "Shampoo Automotriz", desc: "Espuma de alta densidad para lavado vehicular.", imagen: '25.png' },
        { id: 102, nombre: "Desengrasante", desc: "Solución industrial para grasas pesadas.", imagen: '26.png' },
        { id: 103, nombre: "Solvente Dieléctrico", desc: "Limpieza segura para componentes eléctricos.", imagen: '26.png' },
        { id: 104, nombre: "Desengrasante Ecologico", desc: "Limpiador a base de agua.", imagen: '25.png' },
        { id: 105, nombre: "Antiespumante Industrial", desc: "Disenado para eliminar la espuma en la etapa quimica del tratamiento de RILES tanto organicos como inorganicos", imagen: '25.png' },
    ];

    // Equipos sin precio (para consultar)
    const equiposData = [
        { id: 201, nombre: "Hidrolavadoras ", desc: "Equipos de alta presión para limpieza profunda.", imagen: '16.png' },
        { id: 202, nombre: "Aspiradoras Industriales ", desc: "Modelos para sólidos y líquidos.", imagen: '20.png' },
        { id: 203, nombre: "Abrillantadoras ", desc: "Para mantenimiento y brillo de pisos.", imagen: '17.png' },
        { id: 204, nombre: "Barredoras Industriales ", desc: "Soluciones para grandes superficies.", imagen: '18.png' },
        { id: 205, nombre: "Carros y Utensilios de limpieza", desc: "Complementos para un trabajo eficiente.", imagen: '19.png' },
    ];
    
    // --- ESTADO DE LA APLICACIÓN ---
    let carrito = JSON.parse(localStorage.getItem('arfloCarrito')) || [];

    // --- FUNCIONES DE RENDERIZADO ---
    const renderGrids = () => {
        const insumosGrid = document.getElementById('insumos-grid');
        const productosGrid = document.getElementById('productos-grid');
        const equiposGrid = document.getElementById('equipos-grid');

        if(insumosGrid) insumosGrid.innerHTML = insumosData.map(p => createCard(p, true)).join('');
        if(productosGrid) productosGrid.innerHTML = productosQuimicosData.map(p => createCard(p, false)).join('');
        if(equiposGrid) equiposGrid.innerHTML = equiposData.map(p => createCard(p, false)).join('');
    };

    const createCard = (item, hasPrice) => {
        const imageContent = item.imagen
            ? `<img src="images/${item.imagen}" alt="${item.nombre}">`
            : `<div class="placeholder-icon"><i class="fas fa-box"></i></div>`;

        const footerContent = hasPrice
            ? ` <div class="product-price">$${item.precio.toLocaleString('es-CL')}</div>
                <button class="btn btn--primary" onclick="app.addToCart(${item.id})">Añadir</button>`
            : ` <button class="btn btn--outline" onclick="app.consultarProducto(${item.id})">Consultar</button>`;

        return `
            <div class="product-card">
                <div class="product-image">${imageContent}</div>
                <div class="product-info">
                    <h4 class="product-name">${item.nombre}</h4>
                    <p class="product-desc">${item.desc}</p>
                    <div class="product-footer">${footerContent}</div>
                </div>
            </div>`;
    };

    // --- LÓGICA DEL CARRITO ---
    const addToCart = (id) => {
        const item = insumosData.find(p => p.id === id);
        const itemInCart = carrito.find(p => p.id === id);
        if (itemInCart) {
            itemInCart.cantidad++;
        } else {
            carrito.push({ ...item, cantidad: 1 });
        }
        updateCart();
        showFeedback('¡Producto añadido al carrito!');
    };

    const updateCart = () => {
        localStorage.setItem('arfloCarrito', JSON.stringify(carrito));
        updateCartCount();
        renderCartItems();
    };

    const updateCartCount = () => {
        const cartCount = document.getElementById('cart-count');
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    };

    const renderCartItems = () => {
        const cartContainer = document.getElementById('cart-items-container');
        if (carrito.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito de cotización está vacío.</p>';
            return;
        }

        let total = 0;
        const itemsHtml = carrito.map(item => {
            total += item.precio * item.cantidad;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.nombre}</div>
                        <div class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</div>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="app.removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
                </div>`;
        }).join('');

        cartContainer.innerHTML = `${itemsHtml}<div class="cart-total">Total: $${total.toLocaleString('es-CL')}</div>`;
    };
    
    const updateQuantity = (id, change) => {
        const itemInCart = carrito.find(p => p.id === id);
        if (itemInCart) {
            itemInCart.cantidad += change;
            if (itemInCart.cantidad <= 0) {
                removeFromCart(id);
            } else {
                updateCart();
            }
        }
    };
    
    const removeFromCart = (id) => {
        carrito = carrito.filter(item => item.id !== id);
        updateCart();
    };

    const handleCheckout = () => {
        if (carrito.length === 0) return;
        const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        const itemsList = carrito.map(item => `• ${item.nombre} (x${item.cantidad})`).join('\n');
        const message = `¡Hola ARFLO! Quisiera cotizar los siguientes insumos:\n\n${itemsList}\n\n*Total referencial: $${total.toLocaleString('es-CL')}*`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // --- LÓGICA DE CONSULTAS ---
    const consultarProducto = (id) => {
        const allProducts = [...productosQuimicosData, ...equiposData];
        const item = allProducts.find(p => p.id === id);
        if (item) {
            const message = `¡Hola ARFLO! Me gustaría consultar por el siguiente producto: *${item.nombre}*.`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        }
    };

    const handleContactForm = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const nombre = formData.get('nombre');
        const email = formData.get('email');
        const mensaje = formData.get('mensaje');
        const message = `Consulta desde la web:\n\n*Nombre:* ${nombre}\n*Email:* ${email}\n*Mensaje:* ${mensaje}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        e.target.reset();
    };

    // --- UI y EVENTOS ---
    const setupEventListeners = () => {
        // Menú móvil
        document.getElementById('nav-toggle').addEventListener('click', () => {
            document.getElementById('nav-menu').classList.toggle('active');
        });
        
        // Modal del carrito
        const cartModal = document.getElementById('cart-modal');
        document.getElementById('cart-btn').addEventListener('click', () => cartModal.classList.remove('hidden'));
        document.getElementById('close-cart').addEventListener('click', () => cartModal.classList.add('hidden'));
        document.getElementById('continue-shopping').addEventListener('click', () => cartModal.classList.add('hidden'));
        document.getElementById('checkout-btn').addEventListener('click', handleCheckout);

        // Formulario de contacto
        document.getElementById('contact-form').addEventListener('submit', handleContactForm);
        
        // Scroll suave y navegación activa
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                document.getElementById('nav-menu').classList.remove('active');
            });
        });
    };

    const showFeedback = (message) => {
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: var(--color-success); color: white; padding: 12px 24px; border-radius: 8px; z-index: 1001; opacity: 0; transition: opacity 0.3s;`;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.style.opacity = '1', 10);
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 300);
        }, 2500);
    };

    // --- INICIALIZACIÓN ---
    const init = () => {
        renderGrids();
        setupEventListeners();
        updateCartCount();
    };

    init();

    // Exponer funciones al objeto global 'app' para usarlas en el HTML (onclick)
    window.app = {
        addToCart,
        removeFromCart,
        updateQuantity,
        consultarProducto,
    };
});
