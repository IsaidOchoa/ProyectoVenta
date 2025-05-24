import React from 'react';

function ProductCard({ producto, onAddToCart, enCarrito, onProductClick }) {
  return (
    <div className="product-card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 340,
      padding: 0,
      borderRadius: 10,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      background: '#fff',
      marginBottom: 24,
      opacity: producto.stock === 0 ? 0.5 : 1,
      position: 'relative',
      overflow: 'hidden',
      cursor: onProductClick ? 'pointer' : 'default'
    }} onClick={() => onProductClick && onProductClick(producto)}>
      {/* Sección imagen */}
      <div style={{
        flex: '0 0 150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        minHeight: 150
      }}>
        <img
          src={`http://localhost/ProyectoVenta/public/uploads/${producto.imagen}`}
          alt={producto.nombre}
          style={{ maxHeight: 120, maxWidth: '90%', objectFit: 'contain' }}
        />
        {producto.stock === 0 && (
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: 'red',
            fontWeight: 'bold',
            background: 'rgba(255,255,255,0.8)',
            padding: '2px 8px',
            borderRadius: 4
          }}>
            Sin stock
          </div>
        )}
      </div>
      {/* Sección info */}
      <div style={{
        flex: 1,
        padding: '12px 16px 0 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{producto.nombre}</h3>
        <p className="provider" style={{ margin: '4px 0', color: '#444', fontSize: 14 }}>
          Proveedor: {producto.proveedor_nombre || producto.proveedor}
        </p>
        <p className="description" style={{
          margin: '4px 0 0 0',
          color: '#666',
          fontSize: 13,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {producto.descripcion}
        </p>
        {enCarrito && (
          <div style={{ color: 'green', fontWeight: 'bold', marginTop: 6, fontSize: 14 }}>
            Agregado al carrito
          </div>
        )}
      </div>
      {/* Sección precio y botón */}
      <div style={{
        padding: '0 16px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 8
      }}>
        <div style={{ fontWeight: 'bold', color: '#0071ce', fontSize: 18, marginBottom: 4 }}>
          ${producto.precio}
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            onAddToCart(producto);
          }}
          disabled={producto.stock === 0}
          style={{
            background: '#0071ce', // azul rey
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '0.8rem',
            fontWeight: 'bold',
            cursor: producto.stock === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;