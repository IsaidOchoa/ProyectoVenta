import React, { useEffect, useState } from 'react';

function ProvidersView({ onBack }) {
  const [proveedores, setProveedores] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [agregando, setAgregando] = useState(false);

  const API_URL = 'http://localhost/ProyectoVenta/public/api/proveedores';

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProveedores(Array.isArray(data) ? data : []));
  }, []);

  const handleEdit = (prov) => {
    setEditId(prov.id);
    setEditNombre(prov.nombre);
    setMensaje('');
  };

  const handleSave = async (prov) => {
    const res = await fetch(`${API_URL}/Modificar/${prov.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: editNombre, direccion: prov.direccion || '', telefono: prov.telefono || '' })
    });
    const result = await res.json();
    if (result.message) {
      setProveedores(proveedores.map(p => p.id === prov.id ? { ...p, nombre: editNombre } : p));
      setMensaje('Proveedor actualizado');
      setEditId(null);
    } else {
      setMensaje(result.error || 'Error al actualizar');
    }
  };

  const handleDelete = async (prov) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el proveedor "${prov.nombre}"?`)) return;
    const res = await fetch(`${API_URL}/Eliminar/${prov.id}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (result.message) {
      setProveedores(proveedores.filter(p => p.id !== prov.id));
      setMensaje(`El proveedor "${prov.nombre}" ha sido eliminado`);
    } else {
      setMensaje(result.error || 'Error al eliminar');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) {
      setMensaje('El nombre del proveedor es obligatorio');
      return;
    }
    setAgregando(true);
    const res = await fetch(`${API_URL}/Crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoNombre, direccion: '', telefono: '' })
    });
    const result = await res.json();
    setAgregando(false);
    if (result.message) {
      fetch(API_URL)
        .then(res => res.json())
        .then(data => setProveedores(Array.isArray(data) ? data : []));
      setMensaje('Proveedor agregado');
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
      <h2 style={{ textAlign: 'left', marginLeft: 0 }}>Proveedores</h2>
      <form onSubmit={handleAdd} style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 8 }}>
        <input
          type="text"
          placeholder="Nuevo proveedor"
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
      {mensaje && <div style={{ marginBottom: 16, color: mensaje.includes('eliminado') || mensaje.includes('actualizado') || mensaje.includes('agregado') ? 'green' : 'red' }}>{mensaje}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ width: 80, textAlign: 'center' }}>ID</th>
            <th style={{ textAlign: 'center', paddingLeft: 16 }}>Nombre</th>
            <th style={{ textAlign: 'center' }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(prov => (
            <tr key={prov.id}>
              <td style={{ width: 80, textAlign: 'center' }}>{prov.id}</td>
              <td style={{ textAlign: 'center', paddingLeft: 16 }}>
                {editId === prov.id ? (
                  <input
                    value={editNombre}
                    onChange={e => setEditNombre(e.target.value)}
                    style={{ width: '80%' }}
                  />
                ) : prov.nombre}
              </td>
              <td style={{ textAlign: 'center' }}>
                {editId === prov.id ? (
                  <>
                    <button
                      style={{ background: '#0071ce', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', marginRight: 8, cursor: 'pointer' }}
                      onClick={() => handleSave(prov)}
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
                      onClick={() => handleEdit(prov)}
                    >
                      Editar
                    </button>
                    <button
                      style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 1rem', cursor: 'pointer' }}
                      onClick={() => handleDelete(prov)}
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

export default ProvidersView;