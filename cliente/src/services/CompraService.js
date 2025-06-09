export async function realizarCompra(productos) {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost/ProyectoVenta/public/api/compras/realizar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productos })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error al realizar la compra');
  }
  return data;
}