import React from 'react';

function Toast({ mensaje, visible, tipo = 'success' }) {
  if (!visible) return null;

  // Colores según tipo
  const estilos = {
    success: {
      background: 'rgba(60, 176, 67, 0.85)', // verde
      color: '#fff'
    },
    error: {
      background: 'rgba(220, 53, 69, 0.85)', // rojo
      color: '#fff'
    },
    info: {
      background: 'rgba(33, 150, 243, 0.85)', // azul
      color: '#fff'
    }
  };

  return (
    <div style={{
      ...estilos[tipo],
      padding: '1rem 2rem',
      borderRadius: 8,
      fontWeight: 'bold',
      fontSize: 18,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      marginBottom: 4,
      minWidth: 220,
      transition: 'opacity 0.3s',
    }}>
      {mensaje}
    </div>
  );
}

export default Toast;