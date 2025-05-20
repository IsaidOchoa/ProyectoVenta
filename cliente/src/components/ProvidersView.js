import React, { useEffect, useState } from 'react';
import AddProvider from './AddProvider';
import EditProviders from './EditProviders';

function ProvidersView({ onBack }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    fetch('http://localhost/ProyectoVenta/public/api/productos/proveedores')
        .then(res => res.json())
        .then(data => setProveedores(data));
  }, [showAdd, showEdit]);

  if (showAdd) return <AddProvider onBack={() => setShowAdd(false)} />;
  if (showEdit) return <EditProviders onBack={() => setShowEdit(false)} />;

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
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: 24 }}>
        <button
          style={{
            background: '#FFD600',
            color: '#222',
            border: 'none',
            borderRadius: 6,
            padding: '0.7rem 1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
          onClick={() => setShowAdd(true)}
        >
          + Agregar proveedor
        </button>
        <button
          style={{
            background: '#0071ce',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '0.7rem 1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
          onClick={() => setShowEdit(true)}
        >
          Editar proveedores
        </button>
      </div>
      <h2 style={{ textAlign: 'left', marginLeft: 0 }}>Proveedores</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ width: 80, textAlign: 'center' }}>ID</th>
            <th style={{ textAlign: 'center', paddingLeft: 16 }}>Nombre</th>
            {/* Más columnas si las tienes */}
          </tr>
        </thead>
        <tbody>
          {proveedores.map(prov => (
            <tr key={prov.id}>
              <td style={{ width: 80, textAlign: 'center' }}>{prov.id}</td>
              <td style={{ textAlign: 'center', paddingLeft: 16 }}>{prov.nombre}</td>
              {/* Más campos aquí */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProvidersView;