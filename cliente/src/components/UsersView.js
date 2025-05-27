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
      <h2 style={{ textAlign: 'left', marginLeft: 0 }}>Usuarios</h2>
      {mensaje && <div style={{ marginBottom: 16, color: 'red' }}>{mensaje}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ width: 40, textAlign: 'center', padding: 8 }}>ID</th>
            <th style={{ width: 150, textAlign: 'center', padding: 8 }}>Nombre</th>
            <th style={{ width: 200, textAlign: 'center', padding: 8 }}>Correo</th>
            <th style={{ width: 100, textAlign: 'center', padding: 8 }}>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(user => (
            <tr key={user.id}>
              <td style={{ textAlign: 'center', padding: 8 }}>{user.id}</td>
              <td style={{ textAlign: 'center', padding: 8 }}>{user.nombre}</td>
              <td style={{ textAlign: 'center', padding: 8 }}>{user.email}</td>
              <td style={{ textAlign: 'center', padding: 8 }}>{user.rol || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersView;