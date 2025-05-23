import React from 'react';

function ProductCard({ producto, onAddToCart }) {
  console.log(producto); // <-- así
  return (
    <div className="product-card" style={{ opacity: producto.stock === 0 ? 0.5 : 1, position: 'relative' }}>
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
      <img src={`http://localhost/ProyectoVenta/public/uploads/${producto.imagen}`} alt={producto.nombre} />
      <div className="product-info">
        <h3>{producto.nombre}</h3>
        <p className="price">${producto.precio}</p>
        <p className="provider">Proveedor: {producto.proveedor_nombre || producto.proveedor}</p>
        <p className="description">{producto.descripcion}</p>
        <button
          disabled={producto.stock === 0}
          onClick={() => onAddToCart(producto)}
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;