import React from 'react';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';

function CartView({ cart, onAdd, onRemove, onPay, onBack, onDelete, onClearCart }) {
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div className="cart-view-container">
      {/* Panel izquierdo: productos */}
      <div style={{
        flex: 3,
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <button onClick={onBack} style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginRight: '1rem'
          }}>
            <FaArrowLeft size={24} />
          </button>
          <h2 style={{ margin: 0 }}>Carrito de compras</h2>
        </div>
        {cart.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.producto_id || item.id} className="cart-product-card" style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1.5rem',
                background: '#f7f7f7',
                borderRadius: '8px',
                padding: '1rem 1.5rem'
              }}>
                <img
                  src={`http://localhost/ProyectoVenta/public/uploads/${item.imagen}`}
                  alt={item.nombre}
                  style={{ width: 80, height: 80, objectFit: 'contain', marginRight: 24, borderRadius: 8, background: '#fff' }}
                />
                <div style={{ flex: 2 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.nombre}</div>
                  <div style={{ color: '#666', fontSize: '0.95rem', marginTop: 4 }}>{item.descripcion}</div>
                  <div style={{ color: '#0071ce', fontWeight: 'bold', marginTop: 8 }}>
                    Precio unitario: ${item.precio}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  flex: 1
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 8 }}>
                    Total: ${(item.precio * item.cantidad).toFixed(2)}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center', // Alinea verticalmente
                    gap: 8
                  }}>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Eliminar este producto del carrito?')) {
                          onDelete(item);
                        }
                      }}
                      style={{
                        width: 36,
                        height: 36,
                        fontSize: 18,
                        marginRight: 8,
                        borderRadius: 4,
                        border: '1px solid #e53935',
                        background: '#fff',
                        color: '#e53935',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Eliminar producto"
                    >
                      <FaTrash />
                    </button>
                    <button onClick={() => onRemove(item)} style={{
                      width: 36,
                      height: 36,
                      fontSize: 18,
                      marginRight: 8,
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      background: '#fff',
                      color: '#222',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>-</button>
                    <span style={{
                      margin: '0 10px',
                      fontWeight: 'bold',
                      minWidth: 24,
                      textAlign: 'center',
                      height: 36,
                      lineHeight: '36px',
                      fontSize: 18,
                      display: 'inline-block'
                    }}>{item.cantidad}</span>
                    <button onClick={() => onAdd(item)} style={{
                      width: 36,
                      height: 36,
                      fontSize: 18,
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      background: '#fff',
                      color: '#222',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>+</button>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={onClearCart}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '0.7rem 1.5rem',
                fontSize: 18,
                fontWeight: 'bold',
                border: '2px solid #e53935',
                background: '#fff',
                color: '#e53935',
                borderRadius: 8,
                cursor: 'pointer',
                marginLeft: 0,
                marginBottom: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              title="Vaciar carrito"
            >
              <FaTrash style={{ fontSize: 24, marginRight: 8 }} />
              Vaciar carrito
            </button>
          </>
        )}
      </div>

      {/* Panel derecho: total y pagar */}
      <div style={{
        flex: 1,
        background: '#f7f7f7',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300
      }}>
        <h3 style={{ marginBottom: 16 }}>Total a pagar</h3>
        <div style={{ fontWeight: 'bold', fontSize: '2rem', marginBottom: 32 }}>${total.toFixed(2)}</div>
        <button
          className="btn"
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.1rem',
            background: '#FFD600', // amarillo
            color: '#222',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onClick={() => {
            if (cart.length === 0) {
              alert('No hay productos en el carrito');
              return;
            }
            onPay();
          }}
        >
          Pagar
        </button>
      </div>
    </div>
  );
}

export default CartView;