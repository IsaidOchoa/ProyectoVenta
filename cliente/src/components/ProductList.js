import React from 'react';
import ProductCard from './ProductCard';

function ProductList({ productos, onAddToCart }) {
  return (
    <div className="products-container">
      {productos.map(producto => (
        <ProductCard key={producto.id} producto={producto} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

export default ProductList;