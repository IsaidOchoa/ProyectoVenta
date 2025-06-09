const API_URL = 'http://localhost/ProyectoVenta/public/api/productos';

export async function obtenerProductos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}

export async function obtenerProductoPorId(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener el producto');
  return res.json();
}

export async function crearProducto(formData) {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost/ProyectoVenta/public/api/productos/Crear', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // otros headers como 'Content-Type' si es necesario
    },
    body: formData
  });
    for (let pair of formData.entries()) {
      console.log(pair[0]+ ':', pair[1]);
    }
  return await response.json();
}

export async function actualizarProducto(id, formData) {
  const res = await fetch(`${API_URL}/Modificar/${id}`, {
    method: 'POST',
    body: formData, // FormData para archivos/imágenes
  });
  if (!res.ok) throw new Error('Error al actualizar producto');
  return res.json();
}

export async function eliminarProducto(id) {
  const res = await fetch(`${API_URL}/Eliminar/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar producto');
  return res.json();
}

export async function activarProducto(id) {
  const res = await fetch(`${API_URL}/Activar/${id}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Error al activar producto');
  return res.json();
}

export async function desactivarProducto(id) {
  const res = await fetch(`${API_URL}/Desactivar/${id}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Error al desactivar producto');
  return res.json();
}

export async function obtenerCategorias() {
  const res = await fetch('http://localhost/ProyectoVenta/public/api/categorias');
  if (!res.ok) throw new Error('Error al obtener categorías');
  return res.json();
}

export async function obtenerProveedores() {
  const res = await fetch('http://localhost/ProyectoVenta/public/api/proveedores');
  if (!res.ok) throw new Error('Error al obtener proveedores');
  return res.json();
}