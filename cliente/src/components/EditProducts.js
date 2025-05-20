import React, { useEffect, useState } from 'react';

function EditProducts({ onBack }) {
  const [productos, setProductos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost/ProyectoVenta/public/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  const startEdit = (producto) => {
    setEditId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    });
    setMensaje('');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    const res = await fetch(`http://localhost/ProyectoVenta/public/api/productos/editar/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const result = await res.json();
    setMensaje(result.success ? 'Producto actualizado' : (result.message || 'Error al actualizar'));
    if (result.success) {
      setProductos(productos.map(p => p.id === editId ? { ...p, ...form } : p));
      setEditId(null);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 18 }}>&larr; Volver</button>
      <h2>Editar productos</h2>
      {mensaje && <div style={{ marginBottom: 16, color: mensaje.includes('actualizado') ? 'green' : 'red' }}>{mensaje}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td>
                {editId === producto.id ? (
                  <input name="nombre" value={form.nombre} onChange={handleChange} />
                ) : producto.nombre}
              </td>
              <td>
                {editId === producto.id ? (
                  <input name="descripcion" value={form.descripcion} onChange={handleChange} />
                ) : producto.descripcion}
              </td>
              <td>
                {editId === producto.id ? (
                  <input name="precio" type="number" value={form.precio} onChange={handleChange} />
                ) : producto.precio}
              </td>
              <td>
                {editId === producto.id ? (
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} />
                ) : producto.stock}
              </td>
              <td>
                {editId === producto.id ? (
                  <>
                    <button onClick={handleSave} style={{ marginRight: 8, background: '#FFD600', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Guardar</button>
                    <button onClick={() => setEditId(null)} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Cancelar</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(producto)} style={{ background: '#0071ce', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditProducts;