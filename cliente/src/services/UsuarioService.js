const API_URL = 'http://localhost/ProyectoVenta/public/api/usuarios';

export async function crearUsuario(datos) {
  const res = await fetch(`${API_URL}/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  if (!res.ok) throw new Error('Error al registrar usuario');
  return res.json();
}

export async function loginUsuario({ correo, contrasena }) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena })
  });
  if (!res.ok) throw new Error('Error al iniciar sesión');
  return res.json();
}

export async function obtenerUsuarios() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json();
}

export async function cambiarEstadoUsuario(id, estado) {
  const res = await fetch(`${API_URL}/${id}/estado`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado_usuario: estado })
  });
  if (!res.ok) throw new Error('Error al cambiar estado');
  return res.json();
}