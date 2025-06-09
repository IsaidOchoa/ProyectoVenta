export async function obtenerHistorial(usuario_id) {
  const response = await fetch(`http://localhost/ProyectoVenta/public/api/compras/historial/${usuario_id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al obtener historial');
  return data;
}

export async function realizarCompra(payload) {
  const response = await fetch('http://localhost/ProyectoVenta/public/api/compras/realizar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al realizar la compra');
  return data;
}

export async function obtenerDetalleVenta(venta_id) {
  const response = await fetch(`http://localhost/ProyectoVenta/public/api/compras/detalle/${venta_id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al obtener detalle');
  return data;
}

export async function eliminarTicket(ticketId) {
  const response = await fetch(`http://localhost/ProyectoVenta/public/api/compras/eliminar/${ticketId}`, {
    method: 'DELETE'
  });
  const text = await response.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Respuesta inválida del servidor');
  }
  if (!response.ok) throw new Error(data.error || 'Error al eliminar ticket');
  return data;
}

export async function eliminarHistorial(usuario_id) {
  const response = await fetch(`http://localhost/ProyectoVenta/public/api/compras/historial/${usuario_id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al eliminar historial');
  return data;
}