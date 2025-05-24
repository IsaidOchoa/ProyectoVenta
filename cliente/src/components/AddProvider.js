import React, { useState } from 'react';

function AddProvider({ onBack }) {
  const [form, setForm] = useState({ nombre: '', direccion: '', telefono: '' });
  const [mensaje, setMensaje] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.direccion.trim() || !form.telefono.trim()) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }
    const res = await fetch('http://localhost/ProyectoVenta/public/api/proveedores/agregar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const result = await res.json();
    setMensaje(result.success ? 'Proveedor agregado correctamente' : (result.message || 'Error al agregar proveedor'));
    if (result.success) setForm({ nombre: '', direccion: '', telefono: '' });
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 18 }}>&larr; Volver</button>
      <h2>Agregar proveedor</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          style={{ flex: 1 }}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={form.direccion}
          onChange={e => setForm(p => ({ ...p, direccion: e.target.value }))}
          style={{ flex: 1 }}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
          style={{ flex: 1 }}
        />
        <button onClick={handleSubmit} style={{
          background: '#FFD600', color: '#222', border: 'none', borderRadius: 6, padding: '0.8rem', fontWeight: 'bold', cursor: 'pointer'
        }}>Agregar</button>
      </div>
      {mensaje && <div style={{ marginTop: 16, color: mensaje.includes('correctamente') ? 'green' : 'red' }}>{mensaje}</div>}
    </div>
  );
}

export default AddProvider;