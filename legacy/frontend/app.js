const API_URL = "http://localhost:5000/api/productos";
const CATEGORY_URL = "http://localhost:5000/api/categorias";
const PROVIDER_URL = "http://localhost:5000/api/proveedores";
const cart = [];

// Función para obtener los productos
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        alert("No se pudieron cargar los productos. Intente nuevamente más tarde.");
    }
}

// Función para renderizar los productos en la tabla
function renderProducts(products) {
    const tableBody = document.querySelector("#productTable tbody");
    tableBody.innerHTML = ""; // Limpiar la tabla
    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.nombre}</td>
            <td>${product.descripcion}</td>
            <td>${product.precio}</td>
            <td>${product.stock}</td>
            <td>${product.categoria_nombre}</td>
            <td>${product.proveedor_nombre}</td>
            <td><button onclick="addToCart(${product.id}, '${product.nombre}', ${product.precio})">Agregar al Carrito</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para obtener categorías y llenar el select
async function cargarCategorias() {
    try {
        const response = await fetch(`${API_URL}/categorias`);
        if (!response.ok) {
            throw new Error(`Error al obtener categorías: ${response.statusText}`);
        }
        const categorias = await response.json();

        const selectCategorias = document.getElementById('id_categoria');
        selectCategorias.innerHTML = ''; // Limpia el contenido previo del select
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre_categoria;
            selectCategorias.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}

// Función para obtener proveedores y llenar el select
async function cargarProveedores() {
    try {
        const response = await fetch(`${API_URL}/proveedores`);
        if (!response.ok) {
            throw new Error(`Error al obtener proveedores: ${response.statusText}`);
        }
        const proveedores = await response.json();

        const selectProveedores = document.getElementById('id_proveedor');
        selectProveedores.innerHTML = ''; // Limpia el contenido previo del select
        proveedores.forEach(proveedor => {
            const option = document.createElement('option');
            option.value = proveedor.id;
            option.textContent = proveedor.nombre;
            selectProveedores.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los proveedores:', error);
    }
}

// Llamar a las funciones al cargar la página


// Función para crear un producto
async function createProduct(event) {
    event.preventDefault();
    const nombre = document.querySelector("#nombre").value;
    const descripcion = document.querySelector("#descripcion").value;
    const precio = document.querySelector("#precio").value;
    const stock = document.querySelector("#stock").value;
    const categoria_id = document.querySelector("#id_categoria").value;
    const proveedor_id = document.querySelector("#id_proveedor").value;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                descripcion,
                precio,
                stock,
                categoria_id,
                proveedor_id
            })
        });

        const result = await response.json();
        alert(result.message || result.error);
        fetchProducts(); // Actualizar la lista de productos
    } catch (error) {
        console.error("Error creating product:", error);
        alert("No se pudo crear el producto. Intente nuevamente más tarde.");
    }
}

// Función para filtrar productos
function filterProducts(event) {
    const searchTerm = event.target.value.toLowerCase();
    const rows = document.querySelectorAll("#productTable tbody tr");
    rows.forEach(row => {
        const id = row.children[0].textContent.toLowerCase();
        const name = row.children[1].textContent.toLowerCase();
        if (id.includes(searchTerm) || name.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Inicializar eventos
document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.querySelector("#productForm");
    if (productForm) {
        productForm.addEventListener("submit", createProduct);
    }

    const searchInput = document.querySelector("#searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    fetchProducts();
    cargarCategorias();
    cargarProveedores();
    renderCart();
    
});

// Función para agregar productos al carrito
function addToCart(productId, productName, productPrice) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
        cart[productIndex].total = cart[productIndex].quantity * productPrice;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1,
            total: productPrice
        });
    }
    renderCart();
}

// Función para renderizar el carrito
function renderCart() {
    const cartTableBody = document.querySelector("#cartTable tbody");
    if (!cartTableBody) {
        console.warn("No se encontró el elemento #cartTable tbody. Asegúrate de estar en carrito.html.");
        return;
    }

    cartTableBody.innerHTML = ""; // Limpia la tabla
    cart.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
            <td><button onclick="removeFromCart(${item.id})">Eliminar</button></td>
        `;
        cartTableBody.appendChild(row);
    });

    const totalPriceElement = document.getElementById("totalPrice");
    if (totalPriceElement) {
        const total = cart.reduce((sum, item) => sum + item.total, 0);
        totalPriceElement.textContent = total.toFixed(2);
    }
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        cart.splice(productIndex, 1);
    }
    renderCart();
}