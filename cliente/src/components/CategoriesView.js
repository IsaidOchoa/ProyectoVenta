import React, { useEffect, useState } from 'react';
import AddCategory from './AddCategory';
import EditCategories from './EditCategories';

function CategoriesView({ onBack }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetch('http://localhost/ProyectoVenta/src/services/CategoriaService.php')
      .then(res => res.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          setCategorias(Array.isArray(data) ? data : []);
        } catch {
          setCategorias([]);
          console.error('Respuesta no es JSON:', text);
        }
      });
  }, [showAdd, showEdit]);

  if (showAdd) return <AddCategory onBack={() => setShowAdd(false)} />;
  if (showEdit) return <EditCategories onBack={() => setShowEdit(false)} />;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '2rem' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: '#0071ce',
          fontSize: 22,
          cursor: 'pointer',
          marginBottom: 8
        }}
      >
        &larr; Volver
      </button>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: 24 }}>
        <button
          style={{
            background: '#FFD600',
            color: '#222',
            border: 'none',
            borderRadius: 6,
            padding: '0.7rem 1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
          onClick={() => setShowAdd(true)}
        >
          + Agregar categoría
        </button>
        <button
          style={{
            background: '#0071ce',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '0.7rem 1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
          onClick={() => setShowEdit(true)}
        >
          Editar categorías
        </button>
      </div>
      <h2 style={{ textAlign: 'left', marginLeft: 0 }}>Categorías</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={{ width: 80, textAlign: 'center' }}>ID</th>
            <th style={{ textAlign: 'center', paddingLeft: 16 }}>Nombre</th>
            {/* Más columnas si las tienes */}
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id}>
              <td style={{ width: 80, textAlign: 'center' }}>{cat.id}</td>
              <td style={{ textAlign: 'center', paddingLeft: 16 }}>{cat.nombre_categoria}</td>
              {/* Más campos aquí */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoriesView;