// --- CONFIGURACIÓN ---
const NUMERO_WHATSAPP = "56933803047"; // Reemplaza con tu número (Código país + número sin '+' ni espacios)

// Estado del carrito
let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogo();
    configurarCarrito();
});

function cargarCatalogo() {
    const contenedor = document.getElementById('catalogo-contenedor');
    contenedor.innerHTML = '<p style="text-align: center; color: #888;">Cargando inventario de alta precisión...</p>';

    fetch('catalogo.json')
        .then(res => res.json())
        .then(data => {
            contenedor.innerHTML = '';
            for (const [categoria, productos] of Object.entries(data)) {
                let categoryHTML = `
                    <div class="category-block">
                        <h3 class="category-title">${categoria}</h3>
                        <hr class="category-divider">
                        <div class="product-grid">
                `;

                productos.forEach(p => {
                    // Convertimos el string "$150.326" a número para cálculos (150326)
                    const precioNumerico = parseInt(p.precio_final.replace('$', '').replace(/\./g, ''));
                    
                    // Escapamos comillas simples en el nombre para evitar errores en el onclick
                    const nombreSeguro = p.nombre.replace(/'/g, "\\'");

                    categoryHTML += `
                        <article class="product-card">
                            <div class="product-image"><div class="img-placeholder"></div></div>
                            <div class="product-info">
                                <h3>${p.nombre}</h3>
                                <p>Ref: ${p.codigo}</p>
                                <span class="price">${p.precio_final}</span>
                                <button class="btn-add" onclick="agregarAlCarrito('${p.codigo}', '${nombreSeguro}', ${precioNumerico})">
                                    Añadir a cotización
                                </button>
                            </div>
                        </article>
                    `;
                });
                categoryHTML += `</div></div>`;
                contenedor.innerHTML += categoryHTML;
            }
        })
        .catch(err => console.error('Error cargando catálogo', err));
}

// --- LÓGICA DEL CARRITO ---

function agregarAlCarrito(codigo, nombre, precio) {
    const itemExistente = carrito.find(item => item.codigo === codigo);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ codigo, nombre, precio, cantidad: 1 });
    }
    
    actualizarUICarrito();
    abrirCarrito();
}

function cambiarCantidad(codigo, delta) {
    const item = carrito.find(i => i.codigo === codigo);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(i => i.codigo !== codigo); // Eliminar si llega a 0
        }
        actualizarUICarrito();
    }
}

function actualizarUICarrito() {
    const contenedorItems = document.getElementById('cart-items');
    const contadorMenu = document.getElementById('cart-count');
    const totalPrecioUI = document.getElementById('cart-total-price');
    
    // Actualizar contador del menú
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contadorMenu.innerText = totalItems;

    // Calcular Total
    const totalCLP = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // Formatear total a CLP ($1.500.000)
    const totalFormateado = "$" + totalCLP.toLocaleString('es-CL');
    totalPrecioUI.innerText = totalFormateado;

    // Renderizar items
    if (carrito.length === 0) {
        contenedorItems.innerHTML = '<p class="empty-cart-msg">Tu lista está vacía.</p>';
        return;
    }

    contenedorItems.innerHTML = '';
    carrito.forEach(item => {
        const precioItemFormateado = "$" + (item.precio * item.cantidad).toLocaleString('es-CL');
        
        contenedorItems.innerHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.nombre}</h4>
                    <p>Ref: ${item.codigo}</p>
                    <div class="item-controls">
                        <button class="qty-btn" onclick="cambiarCantidad('${item.codigo}', -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button class="qty-btn" onclick="cambiarCantidad('${item.codigo}', 1)">+</button>
                    </div>
                </div>
                <div class="item-price">${precioItemFormateado}</div>
            </div>
        `;
    });
}

// --- INTERFAZ DEL PANEL (ABRIR/CERRAR) ---

function configurarCarrito() {
    const overlay = document.getElementById('cart-overlay');
    const sidebar = document.getElementById('cart-sidebar');
    
    document.getElementById('open-cart').addEventListener('click', (e) => {
        e.preventDefault();
        abrirCarrito();
    });

    document.getElementById('close-cart').addEventListener('click', cerrarCarrito);
    overlay.addEventListener('click', cerrarCarrito);

    // Integración WhatsApp
    document.getElementById('checkout-whatsapp').addEventListener('click', enviarWhatsApp);
}

function abrirCarrito() {
    document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
}

function cerrarCarrito() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
}

// --- ENVÍO A WHATSAPP ---

function enviarWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega equipos antes de cotizar.");
        return;
    }

    let mensaje = "Hola, me gustaría cotizar los siguientes equipos:\n\n";
    
    carrito.forEach(item => {
        const precioFormateado = "$" + (item.precio * item.cantidad).toLocaleString('es-CL');
        mensaje += `▪ ${item.cantidad}x ${item.nombre} (${item.codigo}) - ${precioFormateado}\n`;
    });

    const totalCLP = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    mensaje += `\n*Total Estimado: $${totalCLP.toLocaleString('es-CL')}*`;

    // Codificar mensaje para la URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensajeCodificado}`;
    
    // Abrir en nueva pestaña
    window.open(url, '_blank');
}