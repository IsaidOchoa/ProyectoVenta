import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ productos, onAddToCart, onProductClick }) {
  return (
    <div className="products-container">
      {productos.map(producto => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
}

export default ProductList;