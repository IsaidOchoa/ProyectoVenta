import React, { useEffect, useState } from 'react';

function EditProviders({ onBack }) {
  const [proveedores, setProveedores] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: '', direccion: '', telefono: '' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost/ProyectoVenta/public/api/proveedores')
      .then(res => res.json())
      .then(data => setProveedores(data));
  }, []);

  // Refactorizado: copia todos los campos del proveedor original
  const startEdit = (prov) => {
    setEditId(prov.id);
    setForm({
      nombre: prov.nombre,
      direccion: prov.direccion,
      telefono: prov.telefono
    });
    setMensaje('');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    if (!window.confirm('¿Deseas guardar los cambios de este proveedor?')) return;
    const res = await fetch(`http://localhost/ProyectoVenta/public/api/proveedores/Modificar/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const result = await res.json();
    if (result.message) {
      setMensaje(`El proveedor ${form.nombre} ha sido actualizado correctamente`);
      setProveedores(proveedores.map(p => p.id === editId ? { ...p, ...form } : p));
      setEditId(null);
    } else {
      setMensaje(result.error || 'Error al actualizar');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 18 }}>&larr; Volver</button>
      <h2>Editar proveedores</h2>
      {mensaje && <div style={{ marginBottom: 16, color: mensaje.includes('actualizado correctamente') ? 'green' : 'red' }}>{mensaje}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(prov => (
            <tr key={prov.id}>
              <td>{prov.id}</td>
              <td>
                {editId === prov.id ? (
                  <input name="nombre" value={form.nombre} onChange={handleChange} />
                ) : prov.nombre}
              </td>
              <td>
                {editId === prov.id ? (
                  <input name="direccion" value={form.direccion} onChange={handleChange} />
                ) : (prov.direccion || '')}
              </td>
              <td>
                {editId === prov.id ? (
                  <input name="telefono" value={form.telefono} onChange={handleChange} />
                ) : (prov.telefono || '')}
              </td>
              <td>
                {editId === prov.id ? (
                  <>
                    <button onClick={handleSave} style={{ marginRight: 8, background: '#FFD600', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Guardar</button>
                    <button onClick={() => setEditId(null)} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Cancelar</button>
                  </>
                ) : (
                  <button onClick={() => startEdit(prov)} style={{ background: '#0071ce', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}>Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EditProviders;