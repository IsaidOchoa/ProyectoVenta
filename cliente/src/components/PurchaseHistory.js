import React, { useState } from 'react';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import PurchaseTicket from './PurchaseTicket';
import Modal from './Modal';

function PurchaseHistory({ historial: historialProp, onBack, onDeleteAllHistory }) {
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [historial, setHistorial] = useState(historialProp || []);

  // Eliminar un ticket individual
  const handleDeleteTicket = (ticketId) => {
    setHistorial(historial.filter(c => c.id !== ticketId));
    // Aquí puedes llamar a tu API si es necesario
  };

  // Eliminar todo el historial
  const handleDeleteAll = () => {
    setHistorial([]);
    if (onDeleteAllHistory) onDeleteAllHistory();
    setShowDeleteAllModal(false);
  };

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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <button
          onClick={() => setShowDeleteAllModal(true)}
          style={{
            background: 'white',
            border: '2px solid #e53935',
            color: '#e53935',
            cursor: 'pointer',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 'bold',
            borderRadius: 12,
            padding: '10px 28px',
            transition: 'background 0.2s',
          }}
          title="Eliminar todo el historial"
        >
          <FaTrash />
          Vaciar historial
        </button>
      </div>
      {historial.length === 0 ? (
        <p>No hay compras registradas.</p>
      ) : (
        historial.map((compra, idx) => (
          <PurchaseTicket
            key={compra.id}
            compra={compra}
            idx={idx}
            onDeleteTicket={handleDeleteTicket}
          />
        ))
      )}
      <Modal
        open={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        title="Vaciar historial"
        showClose={true}
      >
        <div style={{ textAlign: 'center' }}>
          <p>¿Seguro que deseas eliminar todo el historial de compras?</p>
          <button
            onClick={handleDeleteAll}
            style={{
              background: '#e53935',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 24px',
              fontWeight: 'bold',
              marginRight: 12,
              cursor: 'pointer'
            }}
          >
            Eliminar todo
          </button>
          <button
            onClick={() => setShowDeleteAllModal(false)}
            style={{
              background: '#eee',
              color: '#222',
              border: 'none',
              borderRadius: 6,
              padding: '8px 24px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default PurchaseHistory;