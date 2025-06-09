const API_URL = 'http://localhost/ProyectoVenta/public/api/carrito';

export async function obtenerCarrito(usuarioId) {
  const res = await fetch(`${API_URL}/${usuarioId}`);
  if (!res.ok) throw new Error('Error al obtener el carrito');
  return res.json();
}

export async function agregarAlCarrito(usuarioId, productoId, cantidad = 1) {
  const res = await fetch(`${API_URL}/${usuarioId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ producto_id: productoId, cantidad })
  });
  if (!res.ok) throw new Error('Error al agregar al carrito');
  return res.json();
}

export async function actualizarCantidadCarrito(usuarioId, productoId, cantidad) {
  // Usa el mismo endpoint que agregar, pero con la cantidad deseada
  return agregarAlCarrito(usuarioId, productoId, cantidad);
}

export async function eliminarDelCarrito(usuarioId, productoId) {
  const res = await fetch(`${API_URL}/${usuarioId}/${productoId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar del carrito');
  return res.json();
}

export async function vaciarCarrito(usuarioId) {
  const res = await fetch(`${API_URL}/${usuarioId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al vaciar el carrito');
  return res.json();
}