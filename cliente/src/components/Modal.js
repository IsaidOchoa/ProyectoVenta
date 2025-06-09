import React from 'react';

function Modal({ open, onClose, children, title, width = 500, showClose = true }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '2rem',
        minWidth: 350,
        maxWidth: width,
        boxShadow: '0 4px 24px #0003',
        position: 'relative'
      }}>
        {showClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'none',
              border: 'none',
              fontSize: 22,
              cursor: 'pointer',
              color: '#888'
            }}
            aria-label="Cerrar"
          >×</button>
        )}
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export default Modal;