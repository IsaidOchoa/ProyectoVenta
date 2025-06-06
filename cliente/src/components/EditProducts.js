import React, { useEffect, useState } from 'react';
import AddProduct from './AddProduct';

function EditProducts({ onBack }) {
  const [productos, setProductos] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const esAdmin = true; // Simulación de rol admin

  useEffect(() => {
    fetch('http://localhost/ProyectoVenta/public/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  // Función para actualizar producto
  const handleEditSubmit = async (form, setMensaje, setForm) => {
    const token = localStorage.getItem('token');
    const data = new FormData();

    // Renombra los campos para que coincidan con el backend
    data.append('nombre', form.nombre);
    data.append('descripcion', form.descripcion);
    data.append('precio', form.precio);
    data.append('stock', form.stock);
    data.append('categoria_id', form.categoria); // <-- cambia a categoria_id
    data.append('proveedor_id', form.proveedor); // <-- cambia a proveedor_id
    if (form.imagen) {
      data.append('imagen', form.imagen);
    }

    for (let pair of data.entries()) {
      console.log(pair[0]+ ': ' + pair[1]);
    }

    const res = await fetch(`http://localhost/ProyectoVenta/public/api/productos/Modificar/${editProduct.id}`, {
      method: 'POST', // <--- CAMBIA A POST
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: data
    });
    const result = await res.json();
    setMensaje(result.success ? 'Producto actualizado correctamente' : (result.message || 'Error al actualizar producto'));
    if (result.success) {
      setProductos(productos.map(p => p.id === editProduct.id ? { ...p, ...form } : p));
      setEditProduct(null);
    }
  };

  // Funciones para activar/desactivar producto
  const desactivarProducto = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost/ProyectoVenta/public/api/productos/Desactivar/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await res.json();
    setMensaje(result.success ? 'Producto desactivado correctamente' : (result.message || 'Error al desactivar producto'));
    if (result.success) {
      // Recarga productos desde el backend
      fetch('http://localhost/ProyectoVenta/public/api/productos')
        .then(res => res.json())
        .then(data => setProductos(data));
    }
  };

  const activarProducto = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost/ProyectoVenta/public/api/productos/Activar/${id}`, {
      method: 'PUT', // <--- CAMBIA A PUT
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await res.json();
    setMensaje(result.success ? 'Producto activado correctamente' : (result.message || 'Error al activar producto'));
    if (result.success) {
      setProductos(productos.map(p => p.id === id ? { ...p, estado: 1 } : p));
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 18 }}>&larr; Volver</button>
      <h2>Editar productos</h2>
      {mensaje && <div style={{ marginBottom: 16, color: mensaje.includes('correctamente') ? 'green' : 'red' }}>{mensaje}</div>}
      {editProduct && (
        <AddProduct
          initialData={{
            ...editProduct,
            categoria: editProduct.categoria_id,
            proveedor: editProduct.proveedor_id
          }}
          editMode={true}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditProduct(null)}
        />
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: 1400, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
              <th style={{ padding: '12px 16px', minWidth: 180 }}>Nombre</th>
              <th style={{ padding: '12px 16px', minWidth: 260 }}>Descripción</th>
              <th style={{ padding: '12px 16px', minWidth: 100, textAlign: 'center' }}>Precio</th>
              <th style={{ padding: '12px 16px', minWidth: 100, textAlign: 'center' }}>Stock</th>
              <th style={{ padding: '12px 16px', minWidth: 140, textAlign: 'center' }}>Categoría</th>
              <th style={{ padding: '12px 16px', minWidth: 180, textAlign: 'center' }}>Proveedor</th>
              <th style={{ padding: '12px 16px', minWidth: 160 }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td style={{ padding: '10px 16px', minWidth: 180 }} title={producto.nombre}>
                  {producto.nombre.length > 30
                    ? producto.nombre.slice(0, 30) + '...'
                    : producto.nombre}
                </td>
                <td style={{ padding: '10px 16px', minWidth: 260 }} title={producto.descripcion}>
                  {producto.descripcion.length > 40
                    ? producto.descripcion.slice(0, 40) + '...'
                    : producto.descripcion}
                </td>
                <td style={{ padding: '10px 16px', minWidth: 100, textAlign: 'center' }}>{producto.precio}</td>
                <td style={{ padding: '10px 16px', minWidth: 100, textAlign: 'center' }}>{producto.stock}</td>
                <td style={{ padding: '10px 16px', minWidth: 140, textAlign: 'center' }}>{producto.categoria_nombre}</td>
                <td style={{ padding: '10px 16px', minWidth: 180, textAlign: 'center' }} title={producto.proveedor_nombre}>
                  {producto.proveedor_nombre && producto.proveedor_nombre.length > 30
                    ? producto.proveedor_nombre.slice(0, 30) + '...'
                    : producto.proveedor_nombre}
                </td>
                <td style={{ padding: '10px 16px', minWidth: 160, display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setEditProduct(producto)}
                    style={{ background: '#0071ce', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  {/* Solo muestra uno de los dos botones según el estado */}
                  {esAdmin && producto.estado === 1 && (
                    <button
                      onClick={() => desactivarProducto(producto.id)}
                      style={{ background: '#ff9800', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}
                    >
                      Desactivar
                    </button>
                  )}
                  {esAdmin && producto.estado === 0 && (
                    <button
                      onClick={() => activarProducto(producto.id)}
                      style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}
                    >
                      Activar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EditProducts;