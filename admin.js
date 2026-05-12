// Simulación de Base de Datos / Estado Inicial
let inventarioDB = [
    { id: 1, codigo: "MD-S102D", nombre: "Transmisor De Presión 10bar", categoria: "Instrumentación y Sensores", precio: 150326, stock: 5 },
    { id: 2, codigo: "DVP12SA211T", nombre: "PLC Delta DVP12SA2(T)", categoria: "Controladores PLC", precio: 219841, stock: 5 }
];

let modoEdicion = false; // false = Crear, true = Editar

// Elementos del DOM
const tablaBody = document.getElementById('table-body');
const modal = document.getElementById('crud-modal');
const form = document.getElementById('crud-form');
const modalTitle = document.getElementById('modal-title');

// Renderizar Tabla
function renderizarTabla() {
    tablaBody.innerHTML = '';
    
    inventarioDB.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-family: monospace; color: #666;">${item.codigo}</td>
            <td style="font-weight: 500;">${item.nombre}</td>
            <td>${item.categoria}</td>
            <td>$${item.precio.toLocaleString('es-CL')}</td>
            <td>${item.stock} u.</td>
            <td>
                <button class="action-btn edit-btn" onclick="abrirModalEdicion(${item.id})">Editar</button>
                <button class="action-btn delete-btn" onclick="eliminarEquipo(${item.id})">Borrar</button>
            </td>
        `;
        tablaBody.appendChild(tr);
    });
}

// Abrir Modal para Crear
document.getElementById('btn-nuevo').addEventListener('click', () => {
    modoEdicion = false;
    form.reset();
    document.getElementById('producto-id').value = '';
    modalTitle.innerText = "Añadir Nuevo Equipo";
    modal.classList.add('active');
});

// Abrir Modal para Editar
window.abrirModalEdicion = function(id) {
    const item = inventarioDB.find(i => i.id === id);
    if (!item) return;

    modoEdicion = true;
    modalTitle.innerText = "Editar Equipo";
    
    // Poblar formulario
    document.getElementById('producto-id').value = item.id;
    document.getElementById('producto-codigo').value = item.codigo;
    document.getElementById('producto-nombre').value = item.nombre;
    document.getElementById('producto-categoria').value = item.categoria;
    document.getElementById('producto-precio').value = item.precio;
    document.getElementById('producto-stock').value = item.stock;
    
    modal.classList.add('active');
};

// Cerrar Modal
const cerrarModal = () => modal.classList.remove('active');
document.getElementById('close-modal').addEventListener('click', cerrarModal);
document.getElementById('cancel-modal').addEventListener('click', cerrarModal);

// Guardar Datos (Crear o Actualizar)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const equipoData = {
        codigo: document.getElementById('producto-codigo').value,
        nombre: document.getElementById('producto-nombre').value,
        categoria: document.getElementById('producto-categoria').value,
        precio: parseInt(document.getElementById('producto-precio').value),
        stock: parseInt(document.getElementById('producto-stock').value)
    };

    if (modoEdicion) {
        // Lógica UPDATE (PUT en API)
        const id = parseInt(document.getElementById('producto-id').value);
        const index = inventarioDB.findIndex(i => i.id === id);
        inventarioDB[index] = { ...inventarioDB[index], ...equipoData };
    } else {
        // Lógica CREATE (POST en API)
        const nuevoId = inventarioDB.length ? Math.max(...inventarioDB.map(i => i.id)) + 1 : 1;
        inventarioDB.push({ id: nuevoId, ...equipoData });
    }

    cerrarModal();
    renderizarTabla();
});

// Eliminar Equipo (DELETE en API)
window.eliminarEquipo = function(id) {
    if(confirm("¿Estás seguro de que deseas eliminar este equipo del catálogo?")) {
        inventarioDB = inventarioDB.filter(i => i.id !== id);
        renderizarTabla();
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', renderizarTabla);