import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import PurchaseTicket from './PurchaseTicket';
import Modal from './Modal';
import Toast from './Toast'; // Asegúrate de importar el Toast
import { eliminarTicket, eliminarHistorial, obtenerHistorial } from '../services/CompraService';

function PurchaseHistory({ historial: historialProp, usuario_id, onBack, onDeleteAllHistory }) {
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [historial, setHistorial] = useState(historialProp || []);
  const [toast, setToast] = useState({ visible: false, mensaje: '' });

  // Mostrar toast por 2 segundos
  const showToast = (mensaje) => {
    setToast({ visible: true, mensaje });
    setTimeout(() => setToast({ visible: false, mensaje: '' }), 2000);
  };

  // Eliminar un ticket individual
  const handleDeleteTicket = async (ticketId) => {
    try {
      await eliminarTicket(ticketId);
      setHistorial(historial.filter(c => c.id !== ticketId));
      showToast('Ticket eliminado correctamente');
    } catch (e) {
      showToast('Error al eliminar ticket');
    }
  };

  // Eliminar todo el historial
  const handleDeleteAll = async () => {
    try {
      console.log('usuario_id:', usuario_id);
      await eliminarHistorial(usuario_id);
      // Vuelve a consultar el historial desde el backend
      const nuevoHistorial = await obtenerHistorial(usuario_id);
      setHistorial(nuevoHistorial);
      if (onDeleteAllHistory) onDeleteAllHistory();
      setShowDeleteAllModal(false);
      showToast('Historial eliminado correctamente');
    } catch (e) {
      showToast('Error al eliminar historial');
    }
  };

  useEffect(() => {
    async function cargarHistorial() {
      if (usuario_id) {
        const historialReal = await obtenerHistorial(usuario_id);
        setHistorial(historialReal);
      }
    }
    cargarHistorial();
  }, [usuario_id]);

  return (
    <div style={{ padding: '2rem', background: '#fafbfc', minHeight: '100vh' }}>
      <Toast mensaje={toast.mensaje} visible={toast.visible} />
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
            idx={historial.length - idx} // Cambia aquí
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