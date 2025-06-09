const API_URL = 'http://localhost/ProyectoVenta/public/api/proveedores';

export async function obtenerProveedores() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener proveedores');
  return res.json();
}

export async function obtenerProveedorPorId(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener proveedor');
  return res.json();
}

export async function crearProveedor(datos) {
  const res = await fetch(`${API_URL}/Crear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) throw new Error('Error al crear proveedor');
  return res.json();
}

export async function actualizarProveedor(id, datos) {
  const res = await fetch(`${API_URL}/Modificar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) throw new Error('Error al actualizar proveedor');
  return res.json();
}

export async function eliminarProveedor(id) {
  const res = await fetch(`${API_URL}/Eliminar/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar proveedor');
  return res.json();
}