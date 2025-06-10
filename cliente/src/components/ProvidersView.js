import React, { useEffect, useState, useRef } from 'react';
import SearchBar from './SearchBar';
import {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
} from '../services/ProveedorService';

function ProvidersView({ onBack }) {
  const [proveedores, setProveedores] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', direccion: '', telefono: '' });
  const [mensaje, setMensaje] = useState('');
  const [nuevoProveedor, setNuevoProveedor] = useState({ nombre: '', direccion: '', telefono: '' });
  const [agregando, setAgregando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const tableRef = useRef(null);

  useEffect(() => {
    obtenerProveedores()
      .then(data => setProveedores(Array.isArray(data) ? data : []))
      .catch(() => setMensaje('Error al cargar proveedores'));
  }, []);

  // Deseleccionar fila al hacer clic fuera de la tabla
  useEffect(() => {
    function handleClickOutside(event) {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedRow(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    try {
      const result = await actualizarProveedor(prov.id, editForm);
      if (result.message || result.success) {
        setProveedores(proveedores.map(p => p.id === prov.id ? { ...p, ...editForm } : p));
        setMensaje('Proveedor actualizado');
        setEditId(null);
      } else {
        setMensaje(result.error || 'Error al actualizar');
      }
    } catch {
      setMensaje('Error de conexión');
    }
  };

  const handleDelete = async (prov) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el proveedor "${prov.nombre}"?`)) return;
    try {
      const result = await eliminarProveedor(prov.id);
      if (result.message || result.success) {
        setProveedores(proveedores.filter(p => p.id !== prov.id));
        setMensaje(`El proveedor "${prov.nombre}" ha sido eliminado`);
      } else {
        setMensaje(result.error || 'Error al eliminar');
      }
    } catch {
      setMensaje('Error de conexión');
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
    try {
      const result = await crearProveedor(nuevoProveedor);
      setAgregando(false);
      if (result.message || result.success) {
        const data = await obtenerProveedores();
        setProveedores(Array.isArray(data) ? data : []);
        setMensaje('Proveedor agregado');
        setNuevoProveedor({ nombre: '', direccion: '', telefono: '' });
      } else {
        setMensaje(result.error || 'Error al agregar');
      }
    } catch {
      setAgregando(false);
      setMensaje('Error de conexión');
    }
  };

  const proveedoresFiltrados = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
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
      <SearchBar
        value={busqueda}
        onChange={setBusqueda}
        onSearch={() => {}}
      />
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
      <div ref={tableRef}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
              <th style={{ width: 40, textAlign: 'center', padding: 6, height: 28 }}>ID</th>
              <th style={{ width: 140, textAlign: 'center', padding: 6, height: 28 }}>Nombre</th>
              <th style={{ width: 180, textAlign: 'center', padding: 6, height: 28 }}>Dirección</th>
              <th style={{ width: 120, textAlign: 'center', padding: 6, height: 28 }}>Teléfono</th>
              <th style={{ width: 120, textAlign: 'center', padding: 6, height: 28 }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map(prov => (
              <tr
                key={prov.id}
                className={selectedRow === prov.id ? 'selected-row' : ''}
                onClick={() => setSelectedRow(prov.id)}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ textAlign: 'center', padding: 6, height: 28 }}>{prov.id}</td>
                <td style={{ textAlign: 'center', padding: 6, height: 28 }}>
                  {editId === prov.id ? (
                    <input
                      name="nombre"
                      value={editForm.nombre}
                      onChange={handleEditChange}
                      style={{ width: '95%', padding: '2px 4px', borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      onClick={e => e.stopPropagation()}
                      autoFocus
                      maxLength={40}
                    />
                  ) : (
                    <span title={prov.nombre}>
                      {prov.nombre.length > 18 ? prov.nombre.slice(0, 18) + '…' : prov.nombre}
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'center', padding: 6, height: 28 }}>
                  {editId === prov.id ? (
                    <input
                      name="direccion"
                      value={editForm.direccion}
                      onChange={handleEditChange}
                      style={{ width: '95%', padding: '2px 4px', borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      onClick={e => e.stopPropagation()}
                      maxLength={40}
                    />
                  ) : (
                    <span title={prov.direccion}>
                      {prov.direccion.length > 18 ? prov.direccion.slice(0, 18) + '…' : prov.direccion}
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'center', padding: 6, height: 28 }}>
                  {editId === prov.id ? (
                    <input
                      name="telefono"
                      value={editForm.telefono}
                      onChange={handleEditChange}
                      style={{ width: '95%', padding: '2px 4px', borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    prov.telefono
                  )}
                </td>
                <td style={{ textAlign: 'center', padding: 6, height: 28 }}>
                  {selectedRow === prov.id && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                      {editId === prov.id ? (
                        <>
                          <button
                            style={{ background: '#0071ce', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', marginRight: 4, cursor: 'pointer', fontSize: 14 }}
                            onClick={e => { e.stopPropagation(); handleSave(prov); }}
                          >
                            Guardar
                          </button>
                          <button
                            style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 14 }}
                            onClick={e => { e.stopPropagation(); setEditId(null); }}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            style={{ background: '#0071ce', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', marginRight: 4, cursor: 'pointer', fontSize: 14 }}
                            onClick={e => { e.stopPropagation(); handleEdit(prov); }}
                          >
                            Editar
                          </button>
                          <button
                            style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 14 }}
                            onClick={e => { e.stopPropagation(); handleDelete(prov); }}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProvidersView;