import React, { useEffect, useState } from 'react';

function CategoriesView({ onBack }) {
  const [categorias, setCategorias] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [agregando, setAgregando] = useState(false);

  // Cambia la URL base de la API
  const API_URL = 'http://localhost/ProyectoVenta/public/api/categorias';

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCategorias(Array.isArray(data) ? data : []));
  }, []);

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setEditNombre(cat.nombre_categoria);
    setMensaje('');
  };

  const handleSave = async (cat) => {
    const res = await fetch(`${API_URL}/Modificar/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_categoria: editNombre })
    });
    const result = await res.json();
    if (result.message) {
      setCategorias(categorias.map(c => c.id === cat.id ? { ...c, nombre_categoria: editNombre } : c));
      setMensaje('Categoría actualizada');
      setEditId(null);
    } else {
      setMensaje(result.error || 'Error al actualizar');
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la categoría "${cat.nombre_categoria}"?`)) return;
    const res = await fetch(`${API_URL}/Eliminar/${cat.id}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (result.message) {
      setCategorias(categorias.filter(c => c.id !== cat.id));
      setMensaje(`La categoría "${cat.nombre_categoria}" ha sido eliminada`);
    } else {
      setMensaje(result.error || 'Error al eliminar');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) {
      setMensaje('El nombre de la categoría es obligatorio');
      return;
    }
    setAgregando(true);
    const res = await fetch(`${API_URL}/Crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_categoria: nuevoNombre })
    });
    const result = await res.json();
    setAgregando(false);
    if (result.message) {
      // Recargar categorías
      fetch(API_URL)
        .then(res => res.json())
        .then(data => setCategorias(Array.isArray(data) ? data : []));
      setMensaje('Categoría agregada');
      setNuevoNombre('');
    } else {
      setMensaje(result.error || 'Error al agregar');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: '#0071ce',
          fontSize: 22,
          cursor: 'pointer',
          marginBottom: 8
        }}
      >
        &larr; Volver
      </button>
      <h2 style={{ textAlign: 'left', marginLeft: 0 }}>Categorías</h2>
      {/* Formulario para agregar nueva categoría */}
      <form onSubmit={handleAdd} style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 8 }}>
        <input
          type="text"
          placeholder="Nueva categoría"
          value={nuevoNombre}
          onChange={e => setNuevoNombre(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={agregando}
          style={{
            background: '#0071ce',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '0.5rem 1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {agregando ? 'Agregando...' : 'Agregar'}
        </button>
      </form>
      {mensaje && <div style={{ marginBottom: 16, color: mensaje.includes('eliminada') || mensaje.includes('actualizada') || mensaje.includes('agregada') ? 'green' : 'red' }}>{mensaje}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ width: 80, textAlign: 'center' }}>ID</th>
            <th style={{ textAlign: 'center', paddingLeft: 16 }}>Nombre</th>
            <th style={{ textAlign: 'center' }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id}>
              <td style={{ width: 80, textAlign: 'center' }}>{cat.id}</td>
              <td style={{ textAlign: 'center', paddingLeft: 16 }}>
                {editId === cat.id ? (
                  <input
                    value={editNombre}
                    onChange={e => setEditNombre(e.target.value)}
                    style={{ width: '80%' }}
                  />
                ) : cat.nombre_categoria}
              </td>
              <td style={{ textAlign: 'center' }}>
                {editId === cat.id ? (
                  <>
                    <button
                      style={{ background: '#0071ce', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', marginRight: 8, cursor: 'pointer' }}
                      onClick={() => handleSave(cat)}
                    >
                      Guardar
                    </button>
                    <button
                      style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', cursor: 'pointer' }}
                      onClick={() => setEditId(null)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      style={{ background: '#0071ce', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', marginRight: 8, cursor: 'pointer' }}
                      onClick={() => handleEdit(cat)}
                    >
                      Editar
                    </button>
                    <button
                      style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', cursor: 'pointer' }}
                      onClick={() => handleDelete(cat)}
                    >
                      Eliminar
                    </button>
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

export default CategoriesView;