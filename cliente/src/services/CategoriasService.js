const API_URL = 'http://localhost/ProyectoVenta/public/api/categorias';

export async function obtenerCategorias() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return res.json();
}

export async function obtenerCategoriaPorId(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener la categoría');
  return res.json();
}

export async function crearCategoria(nombre_categoria) {
  const res = await fetch(`${API_URL}/Crear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre_categoria })
  });
  if (!res.ok) throw new Error('Error al crear la categoría');
  return res.json();
}

export async function actualizarCategoria(id, nombre_categoria) {
  const res = await fetch(`${API_URL}/Modificar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre_categoria })
  });
  if (!res.ok) throw new Error('Error al actualizar la categoría');
  return res.json();
}

export async function eliminarCategoria(id) {
  const res = await fetch(`${API_URL}/Eliminar/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar la categoría');
  return res.json();
}