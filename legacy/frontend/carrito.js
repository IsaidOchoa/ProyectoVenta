// Define la URL base para las solicitudes relacionadas con los productos
const PRODUCTS_API_URL = "http://localhost:5000/api/compras/productos";
// Define la URL base para finalizar la compra
const FINALIZE_PURCHASE_API_URL = "http://localhost:5000/api/compras/realizar";

console.log("Carrito.js cargado correctamente");

// Variable para almacenar los productos seleccionados
let selectedProducts = [];

// Función para manejar la tabla de productos
async function renderProducts() {
    const productTable = document.getElementById('cartTable').querySelector('tbody');
    if (!productTable) {
        console.error('No se encontró el elemento cartTable');
        return;
    }

    try {
        console.log("Solicitando productos disponibles...");
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) {
            throw new Error(`Error al obtener los productos: ${response.statusText}`);
        }

        const products = await response.json(); // Obtiene los datos de los productos en formato JSON

        productTable.innerHTML = ''; // Limpia la tabla

        products.forEach(product => {
            const precio = parseFloat(product.precio); // Asegúrate de que el precio sea un número
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.nombre}</td>
                <td>${product.descripcion}</td>
                <td>$${precio.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td><button class="btn-add" data-id="${product.id}" data-name="${product.nombre}" data-price="${precio}">Agregar</button></td>
            `;
            productTable.appendChild(row);
        });

        // Agrega eventos a los botones "Agregar"
        const addButtons = document.querySelectorAll('.btn-add');
        addButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.getAttribute('data-id'));
                const productName = event.target.getAttribute('data-name');
                const productPrice = parseFloat(event.target.getAttribute('data-price'));
                addToCart(productId, productName, productPrice);
            });
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Función para agregar productos al resumen de compra
function addToCart(productId, productName, productPrice) {
    const existingProduct = selectedProducts.find(product => product.id === productId);

    if (existingProduct) {
        existingProduct.cantidad += 1;
        existingProduct.subtotal = existingProduct.cantidad * existingProduct.precio_unitario;
    } else {
        selectedProducts.push({
            id: productId,
            nombre: productName,
            cantidad: 1,
            precio_unitario: productPrice,
            subtotal: productPrice
        });
    }

    console.log(`Producto agregado: ID=${productId}, Nombre=${productName}, Precio=${productPrice}`);
    renderSummary(); // Actualiza el resumen
}
// Función para filtrar productos por nombre
function filterProducts() {
    const searchInput = document.getElementById('productSearch').value.toLowerCase();
    const productRows = document.querySelectorAll('#cartTable tbody tr');

    productRows.forEach(row => {
        const productName = row.querySelector('td:first-child').textContent.toLowerCase();
        if (productName.includes(searchInput)) {
            row.style.display = ''; // Mostrar fila
        } else {
            row.style.display = 'none'; // Ocultar fila
        }
    });
}

// Vincular el evento de búsqueda al input
document.getElementById('productSearch').addEventListener('input', filterProducts);

// Función para mostrar el resumen de compra
function renderSummary() {
    const summaryTable = document.getElementById('summaryTable').querySelector('tbody');
    if (!summaryTable) {
        console.error('No se encontró el elemento summaryTable');
        return;
    }

    summaryTable.innerHTML = ''; // Limpia la tabla
    let total = 0;

    selectedProducts.forEach(product => {
        total += product.subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.nombre}</td>
            <td>${product.cantidad}</td>
            <td>$${product.precio_unitario.toFixed(2)}</td>
            <td>$${product.subtotal.toFixed(2)}</td>
            <td><button class="btn-remove" data-id="${product.id}">Eliminar</button></td>
        `;
        summaryTable.appendChild(row);
    });

    document.getElementById('totalPrice').textContent = total.toFixed(2);

    // Agrega eventos a los botones "Eliminar"
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.getAttribute('data-id'));
            removeFromSummary(productId);
        });
    });
}
// Función para filtrar productos en el resumen de compra
function filterSummary() {
    const searchInput = document.getElementById('summarySearch').value.toLowerCase();
    const summaryRows = document.querySelectorAll('#summaryTable tbody tr');

    summaryRows.forEach(row => {
        const productName = row.querySelector('td:first-child').textContent.toLowerCase();
        if (productName.includes(searchInput)) {
            row.style.display = ''; // Mostrar fila
        } else {
            row.style.display = 'none'; // Ocultar fila
        }
    });
}

// Vincular el evento de búsqueda al input
document.getElementById('summarySearch').addEventListener('input', filterSummary);

// Función para eliminar un producto del resumen
function removeFromSummary(productId) {
    selectedProducts = selectedProducts.filter(product => product.id !== productId);
    renderSummary(); // Actualiza el resumen
}

// Función para finalizar la compra
async function finalizePurchase() {
    try {
        const response = await fetch(FINALIZE_PURCHASE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario_id: "ed203591-30e4-11f0-8e93-d49390544671", // ID del usuario (puedes obtenerlo dinámicamente)
                productos: selectedProducts
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            selectedProducts = []; // Limpia el resumen
            renderSummary(); // Actualiza el resumen
        } else {
            alert(result.error || "Error al finalizar la compra");
        }
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const productTable = document.getElementById("cartTable");
    if (productTable) {
        renderProducts(); // Carga los productos al cargar la página
    }

    const finalizeButton = document.getElementById('finalizePurchase');
    if (finalizeButton) {
        finalizeButton.addEventListener('click', finalizePurchase); // Vincula el botón "Finalizar Compra"
    }
});