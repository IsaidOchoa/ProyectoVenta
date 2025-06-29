import React, { useState } from 'react';
import { obtenerDetalleVenta } from '../services/CompraService';
import Modal from './Modal';
import { FaTrash } from 'react-icons/fa';

const estadoColor = {
  'en bodega': '#888',
  'en camino': '#e6b800',
  'entregado': '#2ecc40'
};

function formatFecha(fecha) {
  return fecha.split(' ')[0];
}

function formatHora(fecha) {
  return fecha.split(' ')[1] || '';
}

function PurchaseTicket({ compra, idx, onDeleteTicket }) {
  const [detalles, setDetalles] = useState(null);
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const handleOpen = async () => {
    if (!detalles) {
      const data = await obtenerDetalleVenta(compra.id);
      setDetalles(data);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <div
        style={{
          background: active
            ? '#b3d4fc' // Azul más intenso al hacer clic
            : hovered
            ? '#d6eaff' // Azul más claro al pasar el mouse
            : '#e3f0ff', // Azul claro por defecto
          borderRadius: 12,
          padding: '1.5rem 2rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: hovered || active ? '0 4px 16px #1976d233' : '0 2px 8px #0001',
          width: '100%',
          maxWidth: 900,
          marginLeft: 'auto',
          marginRight: 'auto',
          cursor: 'pointer',
          transition: 'background 0.18s, box-shadow 0.18s'
        }}
        onClick={handleOpen}
        title="Ver detalles de la compra"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setActive(false);
        }}
        onMouseDown={() => setActive(true)}
        onMouseUp={() => setActive(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 24 }}>
            <span>Ticket {compra.numero_ticket}</span>
            <span style={{ fontWeight: 'normal', color: '#222', fontSize: '1rem' }}>
              Total: ${compra.total}
            </span>
            <span style={{ fontWeight: 'normal', color: '#666', fontSize: '0.98rem' }}>
              Fecha: {formatFecha(compra.fecha)}
            </span>
          </div>
        </div>
        {/* Botón de eliminar, alineado a la derecha pero antes del status */}
        <button
          onClick={e => {
            e.stopPropagation();
            setShowDeleteModal(true);
          }}
          style={{
            background: 'white',
            border: '2px solid #e53935',
            color: '#e53935',
            cursor: 'pointer',
            fontSize: 18,
            marginLeft: 24,
            borderRadius: 8,
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            transition: 'background 0.2s',
            height: 36
          }}
          title="Eliminar este ticket"
        >
          <FaTrash />
        </button>
        <div style={{
          fontWeight: 'bold',
          color: estadoColor[compra.estado] || '#888',
          minWidth: 110,
          textAlign: 'right',
          marginLeft: 24
        }}>
          {compra.estado}
        </div>
      </div>
      <Modal open={open} onClose={handleClose} title={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: 10 }}>
            Ticket {compra.numero_ticket}
          </div>
          <div style={{ height: 10 }} />
          <div style={{ fontWeight: 'bold', fontSize: '1.15rem', marginBottom: 18 }}>
            Productos comprados
          </div>
          <div style={{ height: 10 }} />
          <div style={{ fontWeight: 'bold', marginBottom: 12 }}>
            Hora de compra:{" "}
            <span style={{ fontWeight: 'normal' }}>{formatHora(compra.fecha)}</span>
          </div>
        </div>
      } width={600}>
        {detalles ? (
          <>
            <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', paddingBottom: 6, minWidth: 220 }}>Nombre</th>
                    <th style={{ textAlign: 'center', paddingBottom: 6, minWidth: 70 }}>Cantidad</th>
                    <th style={{ textAlign: 'right', paddingBottom: 6, minWidth: 90 }}>Costo</th>
                    <th style={{ textAlign: 'right', paddingBottom: 6, minWidth: 100 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((prod, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          maxWidth: 260,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={prod.nombre_producto_snapshot}
                      >
                        {prod.nombre_producto_snapshot}
                      </td>
                      <td style={{ textAlign: 'center' }}>{prod.cantidad}</td>
                      <td style={{ textAlign: 'right' }}>${prod.precio_unitario}</td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>${prod.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <hr style={{ margin: '18px 0 8px 0' }} />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}>
              <span>Total</span>
              <span>${compra.total}</span>
            </div>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </Modal>
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar ticket"
        showClose={true}
      >
        <div style={{ textAlign: 'center' }}>
          <p>¿Seguro que deseas eliminar este ticket?</p>
          <button
            onClick={() => {
              onDeleteTicket(compra.id);
              setShowDeleteModal(false);
            }}
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
            Eliminar
          </button>
          <button
            onClick={() => setShowDeleteModal(false)}
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
    </>
  );
}

export default PurchaseTicket;