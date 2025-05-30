import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ productos, onAddToCart, onProductClick, isAdmin }) {
  return (
    <div className="products-container">
      {productos.map(producto => (
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