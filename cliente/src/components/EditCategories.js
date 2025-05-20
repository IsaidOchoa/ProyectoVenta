import React, { useEffect, useState } from 'react';

function EditCategories({ onBack }) {
  const [categorias, setCategorias] = useState([]);
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost/ProyectoVenta/public/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data));
  }, []);

  const startEdit = (cat) => {
    setEditId(cat.id);
    setNombre(cat.nombre);
    setMensaje('');
  };

  const handleSave = async () => {
    const res = await fetch(`http://localhost/ProyectoVenta/public/api/categorias/editar/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    const result = await res.json();
    setMensaje(result.success ? 'Categoría actualizada' : (result.message || 'Error al actualizar'));
    if (result.success) {
      setCategorias(categorias.map(c => c.id === editId ? { ...c, nombre } : c));
      setEditId(null);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 18 }}>&larr; Volver</button>
      <h2>Editar categorías</h2>
      {mensaje && <div style={{ marginBottom: 16, color: mensaje.includes('actualizada') ? 'green' : 'red' }}>{mensaje}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th>Nombre</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id}>
              <td>
                {editId === cat.id ? (
                  <input value={nombre} onChange={e => setNombre(e.target.value)} />
                ) : cat.nombre}
              </td>
              <td>
                {editId === cat.id ? (
                  <>
                    <button onClick={handleSave} style={{ marginRight: 8, background: '#FFD600', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Guardar</button>
                    <button onClick={() => setEditId(null)} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Cancelar</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(cat)} style={{ background: '#0071ce', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditCategories;