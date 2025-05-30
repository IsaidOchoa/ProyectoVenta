import React, { useEffect, useState } from 'react';

function UsersView({ onBack }) {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const API_URL = 'http://localhost/ProyectoVenta/public/api/usuarios';

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => setMensaje('Error al cargar usuarios'));
  }, []);

  // Acción para activar/desactivar usuario
  const toggleEstado = async (id, estadoActual) => {
    try {
      const res = await fetch(`${API_URL}/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado_usuario: estadoActual ? 0 : 1 })
      });
      const data = await res.json();
      if (data.success) {
        setUsuarios(usuarios =>
          usuarios.map(u =>
            u.id === id ? { ...u, estado_usuario: estadoActual ? 0 : 1 } : u
          )
        );
      } else {
        setMensaje(data.message || 'Error al cambiar estado');
      }
    } catch {
      setMensaje('Error de conexión');
    }
  };

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
      <h2 style={{ textAlign: 'left', marginLeft: 0 }}>Usuarios</h2>
      {mensaje && <div style={{ marginBottom: 16, color: 'red' }}>{mensaje}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ width: 40, textAlign: 'center', padding: 8 }}>ID</th>
            <th style={{ width: 150, textAlign: 'center', padding: 8 }}>Nombre</th>
            <th style={{ width: 200, textAlign: 'center', padding: 8 }}>Correo</th>
            <th style={{ width: 100, textAlign: 'center', padding: 8 }}>Rol</th>
            <th style={{ width: 160, textAlign: 'center', padding: 8 }}>Fecha registro</th>
            <th style={{ width: 120, textAlign: 'center', padding: 8 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(user => (
            <tr key={user.id}>
              <td style={{ textAlign: 'center', padding: 8 }}>{user.id}</td>
              <td style={{ textAlign: 'center', padding: 8 }}>{user.nombre}</td>
              <td style={{ textAlign: 'center', padding: 8 }}>{user.correo}</td>
              <td style={{ textAlign: 'center', padding: 8 }}>{user.rol || '-'}</td>
              <td style={{ textAlign: 'center', padding: 8 }}>
                {user.fecha_registro ? new Date(user.fecha_registro).toLocaleString() : '-'}
              </td>
              <td style={{ textAlign: 'center', padding: 8 }}>
                <button
                  onClick={() => toggleEstado(user.id, user.estado_usuario)}
                  style={{
                    background: user.estado_usuario ? '#e74c3c' : '#2ecc40',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 14px',
                    cursor: 'pointer'
                  }}
                >
                  {user.estado_usuario ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersView;