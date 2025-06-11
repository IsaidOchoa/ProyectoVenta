import React, { useEffect, useState } from 'react';
import AddProduct from './AddProduct';
import SearchBar from './SearchBar';
import {
  obtenerProductos,
  actualizarProducto,
  activarProducto,
  desactivarProducto
} from '../services/ProductoService';
import { obtenerCategorias } from '../services/CategoriasService';

function EditProducts({ onBack }) {
  const [productos, setProductos] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [categorias, setCategorias] = useState([]);
  const esAdmin = true; // Simulación de rol admin

  useEffect(() => {
    cargarProductos();
    obtenerCategorias().then(data => setCategorias(Array.isArray(data) ? data : []));
  }, []);

  const cargarProductos = () => {
    obtenerProductos()
      .then(data => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setMensaje('Error al cargar productos'));
  };

  // Filtrado de productos por búsqueda y categoría
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      !categoriaSeleccionada ||
      (producto.categoria_nombre &&
        producto.categoria_nombre.trim().toLowerCase() === categoriaSeleccionada.trim().toLowerCase());
    return coincideBusqueda && coincideCategoria;
  });

  // Función para actualizar producto
  const handleEditSubmit = async (form, setMensaje, setForm) => {
    try {
      const data = new FormData();
      data.append('nombre', form.nombre);
      data.append('descripcion', form.descripcion);
      data.append('precio', form.precio);
      data.append('stock', form.stock);
      data.append('categoria_id', form.categoria || editProduct.categoria_id);
      data.append('proveedor_id', form.proveedor || editProduct.proveedor_id);
      if (form.imagen) {
        data.append('imagen', form.imagen);
      }
      const result = await actualizarProducto(editProduct.id, data);
      setMensaje(result.success ? 'Producto actualizado correctamente' : (result.message || 'Error al actualizar producto'));
      if (result.success) {
        setProductos(productos.map(p => p.id === editProduct.id ? { ...p, ...form } : p));
        setEditProduct(null);
        cargarProductos();
      }
    } catch {
      setMensaje('Error de conexión');
    }
  };

  // Funciones para activar/desactivar producto
  const handleDesactivarProducto = async (id) => {
    try {
      const result = await desactivarProducto(id);
      setMensaje(result.success ? 'Producto desactivado correctamente' : (result.message || 'Error al desactivar producto'));
      if (result.success) cargarProductos();
    } catch {
      setMensaje('Error de conexión');
    }
  };

  const handleActivarProducto = async (id) => {
    try {
      const result = await activarProducto(id);
      setMensaje(result.success ? 'Producto activado correctamente' : (result.message || 'Error al activar producto'));
      if (result.success) cargarProductos();
    } catch {
      setMensaje('Error de conexión');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 18 }}>&larr; Volver</button>
      <h2>Editar productos</h2>
      {mensaje && <div style={{ marginBottom: 16, color: mensaje.includes('correctamente') ? 'green' : 'red' }}>{mensaje}</div>}

      {/* Barra de búsqueda y filtro de categorías */}
      <div style={{ marginBottom: 24 }}>
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          onSearch={setBusqueda}
          categorias={categorias}
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoryChange={setCategoriaSeleccionada}
        />
      </div>

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
      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: 1400, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
              <th style={{ padding: '12px 16px', minWidth: 60 }}>ID</th>
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
            {productosFiltrados.map(producto => (
              <tr
                key={producto.id}
                className={selectedRow === producto.id ? 'selected-row' : ''}
                onClick={() => setSelectedRow(producto.id)}
              >
                <td style={{ padding: '10px 16px', minWidth: 60, textAlign: 'center' }}>{producto.id}</td>
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
                  {esAdmin && producto.estado === 1 && (
                    <button
                      onClick={() => handleDesactivarProducto(producto.id)}
                      style={{ background: '#ff9800', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 0.8rem', cursor: 'pointer' }}
                    >
                      Desactivar
                    </button>
                  )}
                  {esAdmin && producto.estado === 0 && (
                    <button
                      onClick={() => handleActivarProducto(producto.id)}
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