import React, { useState } from 'react';

function AddProduct({ onBack }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: null,
    categoria: '',
    proveedor: ''
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.stock || !form.categoria || !form.proveedor) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    const res = await fetch('http://localhost/ProyectoVenta/public/api/productos/agregar', {
      method: 'POST',
      body: data
    });
    const result = await res.json();
    setMensaje(result.success ? 'Producto agregado correctamente' : (result.message || 'Error al agregar producto'));
    if (result.success) setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagen: null, categoria: '', proveedor: '' });
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 18 }}>&larr; Volver</button>
      <h2>Agregar producto</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} style={inputStyle} />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} style={inputStyle} />
        <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} style={inputStyle} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} style={inputStyle} />
        <input name="imagen" type="file" accept="image/*" onChange={handleChange} style={inputStyle} />
        <input name="categoria" placeholder="Categoría" value={form.categoria} onChange={handleChange} style={inputStyle} />
        <input name="proveedor" placeholder="Proveedor" value={form.proveedor} onChange={handleChange} style={inputStyle} />
        <button type="submit" style={{
          background: '#FFD600', color: '#222', border: 'none', borderRadius: 6, padding: '0.8rem', fontWeight: 'bold', cursor: 'pointer'
        }}>Agregar</button>
      </form>
      {mensaje && <div style={{ marginTop: 16, color: mensaje.includes('correctamente') ? 'green' : 'red' }}>{mensaje}</div>}
    </div>
  );
}

const inputStyle = {
  padding: '0.7rem',
  borderRadius: 6,
  border: '1px solid #ccc',
  fontSize: 16
};

export default AddProduct;