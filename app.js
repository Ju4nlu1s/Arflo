import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 1. PEGA AQUÍ TU FIREBASE CONFIG (La misma del admin.html) ---
const firebaseConfig = {
      apiKey: "AIzaSyBMgEp-m0Zgxhlo11QaTEFpm7rbvmlESGE",
      authDomain: "arflo-17aec.firebaseapp.com",
      projectId: "arflo-17aec",
      storageBucket: "arflo-17aec.firebasestorage.app",
      messagingSenderId: "555836490681",
      appId: "1:555836490681:web:2125b1eefc9129e196ac68",
      measurementId: "G-Y4FMNS8VBJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos globales del carrito
let carrito = JSON.parse(localStorage.getItem('arfloCarrito')) || [];
const WHATSAPP_NUMBER = '56933803047';

document.addEventListener('DOMContentLoaded', () => {
    cargarProductosDesdeFirebase();
    setupEventListeners();
    updateCartCount();
});

// --- FUNCIÓN QUE DESCARGA LOS DATOS ---
async function cargarProductosDesdeFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const insumos = [];
        const quimicos = [];
        const equipos = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const producto = { id: doc.id, ...data };
            
            // Clasificamos según lo que escribas en "Categoría" en el Admin
            // Convertimos a minúsculas para evitar errores (Ej: "Quimicos" vs "quimicos")
            const cat = (producto.categoria || '').toLowerCase();

            if (cat.includes('insumo') || cat.includes('papel') || cat.includes('desechable')) {
                insumos.push(producto);
            } else if (cat.includes('quimico') || cat.includes('químico') || cat.includes('limpieza')) {
                quimicos.push(producto);
            } else if (cat.includes('equipo') || cat.includes('maquina')) {
                equipos.push(producto);
            } else {
                // Si no tiene categoría clara, lo mandamos a Insumos por defecto
                insumos.push(producto);
            }
        });

        renderGrids(insumos, quimicos, equipos);

    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// --- RENDERIZADO (DIBUJAR EN PANTALLA) ---
const renderGrids = (insumosData, productosQuimicosData, equiposData) => {
    const insumosGrid = document.getElementById('insumos-grid');
    const productosGrid = document.getElementById('productos-grid');
    const equiposGrid = document.getElementById('equipos-grid');

    if(insumosGrid) insumosGrid.innerHTML = insumosData.map(p => createCard(p)).join('');
    if(productosGrid) productosGrid.innerHTML = productosQuimicosData.map(p => createCard(p)).join('');
    if(equiposGrid) equiposGrid.innerHTML = equiposData.map(p => createCard(p)).join('');
};

const createCard = (item) => {
    // Si la imagen viene de Firebase es una URL completa, si no, buscamos en carpeta local
    const imageSrc = item.imagen.startsWith('http') ? item.imagen : `images/${item.imagen}`;
    
    // Lógica inteligente para el botón
    let footerContent;
    if (item.stock && parseInt(item.stock) <= 0) {
        footerContent = `<div class="product-price" style="color:red">Agotado</div>`;
    } else {
        const precioTexto = item.precio ? `$${Number(item.precio).toLocaleString('es-CL')}` : 'Cotizar';
        
        // Si tiene link de pago, botón COMPRAR. Si no, botón AÑADIR AL CARRITO
        const botonAccion = item.paymentLink 
            ? `<a href="${item.paymentLink}" target="_blank" class="btn btn--primary" style="background-color:#22c55e">Comprar</a>`
            : `<button class="btn btn--primary" onclick="window.app.addToCart('${item.id}', '${item.nombre}', ${item.precio || 0})">Añadir</button>`;

        footerContent = `
            <div class="product-price">${precioTexto}</div>
            ${botonAccion}
        `;
    }

    return `
        <div class="product-card">
            <div class="product-image"><img src="${imageSrc}" alt="${item.nombre}" onerror="this.src='images/LogoArflo.png'"></div>
            <div class="product-info">
                <h4 class="product-name">${item.nombre}</h4>
                <p class="product-desc">${item.desc || ''}</p>
                <div class="product-footer">${footerContent}</div>
            </div>
        </div>`;
};

// --- FUNCIONES DEL CARRITO Y SISTEMA ---
// Las hacemos globales (window.app) para que el HTML pueda usarlas
window.app = {
    addToCart: (id, nombre, precio) => {
        const itemInCart = carrito.find(p => p.id === id);
        if (itemInCart) {
            itemInCart.cantidad++;
        } else {
            carrito.push({ id, nombre, precio, cantidad: 1 });
        }
        updateCart();
        showFeedback(`¡${nombre} añadido!`);
    },

    removeFromCart: (id) => {
        carrito = carrito.filter(item => item.id !== id);
        updateCart();
    },

    updateQuantity: (id, change) => {
        const item = carrito.find(p => p.id === id);
        if (item) {
            item.cantidad += change;
            if (item.cantidad <= 0) window.app.removeFromCart(id);
            else updateCart();
        }
    },
    
    consultarProducto: (nombre) => {
         const mensaje = `Hola ARFLO, consulto por: ${nombre}`;
         window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
    }
};

// Funciones auxiliares internas
const updateCart = () => {
    localStorage.setItem('arfloCarrito', JSON.stringify(carrito));
    updateCartCount();
    renderCartItems();
};

const updateCartCount = () => {
    const count = document.getElementById('cart-count');
    if(count) {
        const total = carrito.reduce((sum, i) => sum + i.cantidad, 0);
        count.textContent = total;
        count.style.display = total > 0 ? 'flex' : 'none';
    }
};

const renderCartItems = () => {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
    if (carrito.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
        return;
    }
    
    let total = 0;
    container.innerHTML = carrito.map(item => {
        total += item.precio * item.cantidad;
        return `
            <div class="cart-item">
                <div class="cart-item-info"><strong>${item.nombre}</strong><br>$${(item.precio * item.cantidad).toLocaleString('es-CL')}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="window.app.updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button class="quantity-btn" onclick="window.app.updateQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="remove-item-btn" onclick="window.app.removeFromCart('${item.id}')"><i class="fas fa-trash"></i></button>
            </div>`;
    }).join('') + `<div class="cart-total">Total: $${total.toLocaleString('es-CL')}</div>`;
};

const showFeedback = (msg) => {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:green; color:white; padding:10px 20px; border-radius:5px; z-index:2000;";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
};

const setupEventListeners = () => {
    // Aquí puedes mantener tus listeners de menú móvil, modal, etc. del código original
    // Copia la parte de "UI y EVENTOS" de tu archivo original si la necesitas
    const cartModal = document.getElementById('cart-modal');
    if(document.getElementById('cart-btn')) document.getElementById('cart-btn').addEventListener('click', () => cartModal.classList.remove('hidden'));
    if(document.getElementById('close-cart')) document.getElementById('close-cart').addEventListener('click', () => cartModal.classList.add('hidden'));
    
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        const items = carrito.map(i => `• ${i.nombre} (x${i.cantidad})`).join('\n');
        const total = carrito.reduce((s, i) => s + (i.precio * i.cantidad), 0);
        const msg = `Hola ARFLO, cotizo lo siguiente:\n\n${items}\n\nTotal ref: $${total.toLocaleString('es-CL')}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
};
