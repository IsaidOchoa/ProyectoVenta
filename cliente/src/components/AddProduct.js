import React, { useState, useEffect } from 'react';
import { crearProducto, obtenerCategorias, obtenerProveedores } from '../services/ProductoService';

function AddProduct({ onBack, initialData = {}, onSubmit, editMode = false, onCancel, onProductUpdated }) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: null,
    categoria: '',
    proveedor: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    setForm(f => ({
      ...f,
      ...initialData,
      categoria: initialData.categoria_id
        ? String(initialData.categoria_id)
        : (initialData.categoria ? String(initialData.categoria) : ''),
      proveedor: initialData.proveedor_id
        ? String(initialData.proveedor_id)
        : (initialData.proveedor ? String(initialData.proveedor) : ''),
      imagen: null
    }));
  }, [initialData]);

  useEffect(() => {
    obtenerCategorias().then(data => setCategorias(Array.isArray(data) ? data : []));
    obtenerProveedores().then(data => setProveedores(Array.isArray(data) ? data : []));
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'imagen' && files && files[0]) {
      const file = files[0];
      const ext = file.name.toLowerCase().trim().split('.').pop();
      if (!['jpg', 'jpeg'].includes(ext)) {
        setMensaje('Solo se permiten archivos .jpg o .jpeg');
        setForm(f => ({ ...f, imagen: null }));
        return;
      }
      setMensaje('');
      setForm(f => ({ ...f, imagen: file }));
    } else {
      setForm(f => ({
        ...f,
        [name]: value
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.precio ||
      !form.stock ||
      (!form.categoria && form.categoria !== 0 && form.categoria !== '0') ||
      (!form.proveedor && form.proveedor !== 0 && form.proveedor !== '0')
    ) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }
    if (!editMode && !form.imagen) {
      setMensaje('Debes seleccionar una imagen .jpg');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('descripcion', form.descripcion);
    formData.append('precio', form.precio);
    formData.append('stock', form.stock);
    formData.append('categoria_id', form.categoria);
    formData.append('proveedor_id', form.proveedor);
    if (form.imagen) formData.append('imagen', form.imagen);

    try {
      let data;
      if (editMode && onSubmit) {
        await onSubmit(form, setMensaje, setForm);
        return;
      } else {
        data = await crearProducto(formData);
      }
      if (data.message) {
        setMensaje(data.message);
        setTimeout(() => {
          if (typeof onBack === 'function') onBack();
        }, 1000);
      } else {
        setMensaje(data.error || 'Error inesperado');
      }
    } catch {
      setMensaje('Error de conexión');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button onClick={onBack || onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontSize: 18 }}>&larr; Volver</button>
      <h2>{editMode ? 'Editar producto' : 'Agregar producto'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} style={inputStyle} />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} style={inputStyle} />
        <input
          name="precio"
          type="number"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          style={inputStyle}
          onWheel={e => e.target.blur()}
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          style={inputStyle}
          onWheel={e => e.target.blur()}
        />
        <input
          name="imagen"
          type="file"
          accept=".jpg,.jpeg"
          onChange={handleChange}
          style={inputStyle}
        />
        {editMode && initialData.imagen && !form.imagen && (
          <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
            Imagen actual: <span style={{ fontStyle: 'italic' }}>{initialData.imagen}</span>
          </div>
        )}
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre_categoria || cat.nombre}</option>
          ))}
        </select>
        {editMode && initialData.categoria_id && (
          <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
            Categoría actual: <span style={{ fontStyle: 'italic' }}>
              {categorias.find(c => String(c.id) === String(initialData.categoria_id))?.nombre_categoria ||
                categorias.find(c => String(c.id) === String(initialData.categoria_id))?.nombre}
            </span>
          </div>
        )}

        <select
          name="proveedor"
          value={form.proveedor}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Selecciona un proveedor</option>
          {proveedores.map(prov => (
            <option key={prov.id} value={prov.id}>{prov.nombre}</option>
          ))}
        </select>
        {editMode && initialData.proveedor_id && (
          <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
            Proveedor actual: <span style={{ fontStyle: 'italic' }}>
              {proveedores.find(p => String(p.id) === String(initialData.proveedor_id))?.nombre}
            </span>
          </div>
        )}
        <button type="submit" style={{
          background: '#FFD600', color: '#222', border: 'none', borderRadius: 6, padding: '0.8rem', fontWeight: 'bold', cursor: 'pointer'
        }}>{editMode ? 'Guardar cambios' : 'Agregar'}</button>
        {editMode && <button type="button" onClick={onCancel}>Cancelar</button>}
      </form>
      {mensaje && (
        <div style={{
          marginTop: 16,
          color: mensaje.toLowerCase().includes('exitosamente') || mensaje.toLowerCase().includes('correctamente') ? 'green' : 'red'
        }}>
          {mensaje}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '0.7rem',
  borderRadius: 6,
  border: '1px solid #ccc',
  fontSize: 16
};

export default AddProduct;