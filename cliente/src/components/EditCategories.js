import React, { useEffect, useState } from 'react';
import { obtenerCategorias, actualizarCategoria, eliminarCategoria } from '../services/CategoriasService';

function EditCategories({ onBack }) {
  const [categorias, setCategorias] = useState([]);
  const [editId, setEditId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerCategorias().then(setCategorias);
  }, []);

  const startEdit = (cat) => {
    setEditId(cat.id);
    setNombre(cat.nombre_categoria);
    setMensaje('');
  };

  const handleSave = async () => {
    try {
      const result = await actualizarCategoria(editId, nombre);
      setMensaje(result.success ? 'Categoría actualizada' : (result.message || 'Error al actualizar'));
      if (result.success) {
        setCategorias(categorias.map(c => c.id === editId ? { ...c, nombre_categoria: nombre } : c));
        setEditId(null);
      }
    } catch {
      setMensaje('Error de conexión');
    }
  };

  const handleDelete = async (cat) => {
    try {
      const result = await eliminarCategoria(cat.id);
      setMensaje(result.success ? 'Categoría eliminada' : (result.message || 'Error al eliminar'));
      if (result.success) {
        setCategorias(categorias.filter(c => c.id !== cat.id));
      }
    } catch {
      setMensaje('Error de conexión');
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
                {editId === cat.id ? (
                  <>
                    <button onClick={handleSave} style={{ marginRight: 8, background: '#FFD600', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Guardar</button>
                    <button onClick={() => setEditId(null)} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(cat)} style={{ background: '#0071ce', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', marginRight: 8, cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => handleDelete(cat)} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Eliminar</button>
                  </>
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