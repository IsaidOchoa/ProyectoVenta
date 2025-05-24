import React from 'react';

function Toast({ mensaje, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      background: 'rgba(60, 176, 67, 0.7)', // verde claro con transparencia
      color: '#0a0a0b',
      padding: '1rem 2rem',
      borderRadius: 8,
      fontWeight: 'bold',
      fontSize: 18,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      marginBottom: 4,
      minWidth: 220,
      transition: 'opacity 0.3s',
      //opacity: 1, // (opcional, si quieres aún más transparencia)
    }}>
      {mensaje}
    </div>
  );
}

export default Toast;