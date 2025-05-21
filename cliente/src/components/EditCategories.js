import React, { useEffect, useState } from 'react';

function EditCategories({ onBack }) {
  const [categorias, setCategorias] = useState([]);
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost/ProyectoVenta/src/services/CategoriaService.php')
      .then(res => res.json())
      .then(data => setCategorias(data));
  }, []);

  const startEdit = (cat) => {
    setEditId(cat.id);
    setNombre(cat.nombre);
    setMensaje('');
  };

  const handleSave = async () => {
    const res = await fetch('http://localhost/ProyectoVenta/src/services/CategoriaService.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, nombre_categoria: nombre, _method: 'PUT' })
    });
    const result = await res.json();
    setMensaje(result.success ? 'Categoría actualizada' : (result.message || 'Error al actualizar'));
    if (result.success) {
      setCategorias(categorias.map(c => c.id === editId ? { ...c, nombre } : c));
      setEditId(null);
    }
  };

  const handleDelete = async (cat) => {
    const res = await fetch('http://localhost/ProyectoVenta/src/services/CategoriaService.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: cat.id, _method: 'DELETE' })
    });
    let result = {};
    try {
      result = await res.json();
    } catch {
      result = { success: false, message: 'Respuesta vacía del servidor' };
    }
    setMensaje(result.success ? 'Categoría eliminada' : (result.message || 'Error al eliminar'));
    if (result.success) {
      setCategorias(categorias.filter(c => c.id !== cat.id));
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 18 }}>&larr; Volver</button>
      <h2>Editar categorías</h2>
      {mensaje && <div style={{ marginBottom: 16, color: mensaje.includes('actualizada') || mensaje.includes('eliminada') ? 'green' : 'red' }}>{mensaje}</div>}
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
                ) : cat.nombre_categoria}
              </td>
              <td>
                {/* Botones de editar/eliminar */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditCategories;