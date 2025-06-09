import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { obtenerProductos } from '../services/ProductoService';

function ProductView({ producto, onAddToCart, onSelectProduct, onBack }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    obtenerProductos()
      .then(data => setProductos(Array.isArray(data) ? data : []));
  }, []);

  if (!producto) return null;

  // Filtrar productos similares (misma categoría, distinto id)
  const similares = productos
    .filter(p => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 2);

  return (
    <div
      className="product-view-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        minHeight: '70vh'
      }}
    >
      {/* Fila superior: Botón volver */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginBottom: 32,
        minHeight: 48
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 32,
            fontWeight: 'bold',
            color: '#111'
          }}
        >
          <FaArrowLeft size={32} style={{ marginRight: 12 }} />
          Volver
        </button>
      </div>
      {/* Contenido principal */}
      <div
        className="product-view-content"
        style={{
          display: 'flex',
          gap: '2rem',
          width: '100%',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}
      >
        {/* Columna izquierda: imagen */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 400,
          maxWidth: 400
        }}>
          <img
            src={`http://localhost/ProyectoVenta/public/uploads/${producto.imagen}`}
            alt={producto.nombre}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: 520,
              maxHeight: 600,
              borderRadius: 12,
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
            }}
          />
        </div>
        {/* Info central alineada arriba y separada */}
        <div style={{
          flex: 0.8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          marginLeft: 40,
          height: '100%',
          paddingTop: 0,
          maxWidth: 400
        }}>
          <h2 style={{
            fontWeight: 'bold',
            fontSize: 32,
            marginBottom: 20,
            marginTop: 0
          }}>
            {producto.nombre}
          </h2>
          <div style={{ marginBottom: 28 }}>
            <div style={{ color: '#888', fontWeight: 'bold', fontSize: 16 }}>Descripción</div>
            <div style={{ color: '#444', fontSize: 18 }}>{producto.descripcion}</div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ color: '#888', fontWeight: 'bold', fontSize: 16 }}>Proveedor</div>
            <div style={{ color: '#666', fontSize: 16 }}>
              <span style={{ fontWeight: 'bold' }}>{producto.proveedor_nombre || producto.proveedor}</span>
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ color: '#888', fontWeight: 'bold', fontSize: 16 }}>Precio</div>
            <div style={{ color: '#0071ce', fontWeight: 'bold', fontSize: 24 }}>
              ${producto.precio}
            </div>
          </div>
          <div style={{ color: '#2ecc40', fontWeight: 'bold', fontSize: 16, marginBottom: 24 }}>
            Stock disponible: {producto.stock}
          </div>
        </div>
        {/* Botón agregar y similares */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginRight: 80
        }}>
          <button
            onClick={() => onAddToCart(producto)}
            style={{
              background: '#0071ce',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '1rem 2.5rem',
              fontWeight: 'bold',
              fontSize: 18,
              cursor: 'pointer',
              marginBottom: 32
            }}
          >
            Agregar al carrito
          </button>
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>Productos similares</h3>
            <div style={{ display: 'flex', gap: 16 }}>
              {similares.length === 0 && <div style={{ color: '#888' }}>No hay productos similares</div>}
              {similares.map(similar => (
                <div
                  key={similar.id}
                  style={{
                    flex: 1,
                    background: '#f7f7f7',
                    borderRadius: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    padding: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'box-shadow 0.2s',
                  }}
                  onClick={() => onSelectProduct(similar)}
                >
                  <img
                    src={`http://localhost/ProyectoVenta/public/uploads/${similar.imagen}`}
                    alt={similar.nombre}
                    style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: 10, borderRadius: 6, background: '#fff' }}
                  />
                  <div style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 4 }}>{similar.nombre}</div>
                  <div style={{ color: '#0071ce', fontWeight: 'bold', fontSize: 15 }}>${similar.precio}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductView;