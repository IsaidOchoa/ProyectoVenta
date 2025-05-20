import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const estadoColor = {
  'en bodega': '#888',
  'en camino': '#e6b800',
  'entregado': '#2ecc40'
};

function PurchaseHistory({ historial, onBack }) {
  return (
    <div style={{ padding: '2rem', background: '#fafbfc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={onBack} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginRight: '1rem'
        }}>
          <FaArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0 }}>Historial de compras</h2>
      </div>
      {historial.length === 0 ? (
        <p>No hay compras registradas.</p>
      ) : (
        historial.map((compra, idx) => (
          <div key={compra.id} style={{
            background: '#f4f4f4',
            borderRadius: 10,
            padding: '1.2rem 2rem',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 24 }}>
                Boleto {idx + 1}
                <span style={{ fontWeight: 'normal', color: '#222', fontSize: '1rem' }}>
                  Total: ${compra.total}
                </span>
                <span style={{ fontWeight: 'normal', color: '#666', fontSize: '0.98rem' }}>
                  Fecha: {compra.fecha}
                </span>
              </div>
            </div>
            <div style={{
              fontWeight: 'bold',
              color: estadoColor[compra.estado] || '#888',
              minWidth: 110,
              textAlign: 'right'
            }}>
              {compra.estado}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PurchaseHistory;