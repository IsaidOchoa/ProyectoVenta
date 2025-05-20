import React, { useState } from 'react';

function AddCategory({ onBack }) {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!nombre.trim()) {
      setMensaje('El nombre es obligatorio');
      return;
    }
    const res = await fetch('http://localhost/ProyectoVenta/src/services/CategoriaService.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_categoria: nombre })
    });
    const result = await res.json();
    setMensaje(result.success ? 'Categoría agregada correctamente' : (result.message || 'Error al agregar categoría'));
    if (result.success) setNombre('');
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 18 }}>&larr; Volver</button>
      <h2>Agregar categoría</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          placeholder="Nombre de la categoría"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          style={{ padding: '0.7rem', borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
        />
        <button type="submit" style={{
          background: '#FFD600', color: '#222', border: 'none', borderRadius: 6, padding: '0.8rem', fontWeight: 'bold', cursor: 'pointer'
        }}>Agregar</button>
      </form>
      {mensaje && <div style={{ marginTop: 16, color: mensaje.includes('correctamente') ? 'green' : 'red' }}>{mensaje}</div>}
    </div>
  );
}

export default AddCategory;