import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ productos, onAddToCart, onProductClick, isAdmin }) {
  // Filtra productos: solo admin ve desactivados
  const productosFiltrados = isAdmin
    ? productos
    : productos.filter(producto => producto.estado === 1);

  return (
    <div className="products-container">
      {productosFiltrados.map(producto => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}

export default ProductList;