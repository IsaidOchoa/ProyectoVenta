import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';

function ProvidersView({ onBack }) {
  const [proveedores, setProveedores] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', direccion: '', telefono: '' });
  const [mensaje, setMensaje] = useState('');
  const [nuevoProveedor, setNuevoProveedor] = useState({ nombre: '', direccion: '', telefono: '' });
  const [agregando, setAgregando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const API_URL = 'http://localhost/ProyectoVenta/public/api/proveedores';

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProveedores(Array.isArray(data) ? data : []));
  }, []);

  const handleEdit = (prov) => {
    setEditId(prov.id);
    setEditForm({ nombre: prov.nombre, direccion: prov.direccion || '', telefono: prov.telefono || '' });
    setMensaje('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(p => ({ ...p, [name]: value }));
  };

  const handleSave = async (prov) => {
    const res = await fetch(`${API_URL}/Modificar/${prov.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: editForm.nombre, direccion: editForm.direccion, telefono: editForm.telefono })
    });
    const result = await res.json();
    if (result.message) {
      setProveedores(proveedores.map(p => p.id === prov.id ? { ...p, ...editForm } : p));
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

  const handleNuevoChange = e => {
    const { name, value } = e.target;
    setNuevoProveedor(p => ({ ...p, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!nuevoProveedor.nombre.trim() || !nuevoProveedor.direccion.trim() || !nuevoProveedor.telefono.trim()) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }
    setAgregando(true);
    const res = await fetch(`${API_URL}/Crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProveedor)
    });
    const result = await res.json();
    setAgregando(false);
    if (result.message) {
      fetch(API_URL)
        .then(res => res.json())
        .then(data => setProveedores(Array.isArray(data) ? data : []));
      setMensaje('Proveedor agregado');
      setNuevoProveedor({ nombre: '', direccion: '', telefono: '' });
    } else {
      setMensaje(result.error || 'Error al agregar');
    }
  };

  const proveedoresFiltrados = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

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
      {/* Barra de búsqueda arriba */}
      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        onSearch={() => {}} // Puedes dejarlo vacío si el filtro es en tiempo real
      />
      {/* Formulario tipo tarjeta */}
      <form onSubmit={handleAdd} style={{
        background: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
        maxWidth: 700,
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }}>
        <input
          name="nombre"
          placeholder="Nombre del proveedor"
          value={nuevoProveedor.nombre}
          onChange={handleNuevoChange}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={nuevoProveedor.direccion}
          onChange={handleNuevoChange}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={nuevoProveedor.telefono}
          onChange={handleNuevoChange}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={agregando}
          style={{
            background: '#0071ce',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '0.7rem 1.2rem',
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
            <th style={{ width: 40, textAlign: 'center' }}>ID</th>
            <th style={{ width: 150, textAlign: 'center', paddingLeft: 16 }}>Nombre</th>
            <th style={{ width: 300, textAlign: 'left' }}>Dirección</th>
            <th style={{ width: 40, textAlign: 'center' }}>Teléfono</th>
            <th style={{ textAlign: 'center' }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {proveedoresFiltrados.map(prov => (
            <tr key={prov.id}>
              <td style={{ width: 80, textAlign: 'center' }}>{prov.id}</td>
              <td style={{ textAlign: 'center', paddingLeft: 16 }}>
                {editId === prov.id ? (
                  <input
                    name="nombre"
                    value={editForm.nombre}
                    onChange={handleEditChange}
                    style={{ width: '80%' }}
                  />
                ) : prov.nombre}
              </td>
              <td style={{ textAlign: 'left' }}>
                {editId === prov.id ? (
                  <input
                    name="direccion"
                    value={editForm.direccion}
                    onChange={handleEditChange}
                    style={{ width: '90%' }}
                  />
                ) : (prov.direccion || '-')}
              </td>
              <td style={{ textAlign: 'center' }}>
                {editId === prov.id ? (
                  <input
                    name="telefono"
                    value={editForm.telefono}
                    onChange={handleEditChange}
                    style={{ width: '90%' }}
                  />
                ) : (prov.telefono || '-')}
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