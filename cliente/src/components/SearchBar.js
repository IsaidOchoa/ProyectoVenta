import React from 'react';

function SearchBar({ value, onChange, onSearch, onCategoryChange, categorias = [], categoriaSeleccionada, sticky = false }) {
  console.log('categorias prop en SearchBar:', categorias);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: 0,
        position: sticky ? 'sticky' : 'static',
        top: sticky ? 0 : 'auto',
        zIndex: sticky ? 100 : 'auto',
        background: sticky ? '#fff' : 'transparent',
        boxShadow: sticky ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
        padding: sticky ? '0.3rem 0' : 0
      }}
    >
      <div
        className="search-bar"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0.3rem',
          maxWidth: 1200,
          margin: '0 auto',
          gap: 12
        }}
      >
        <input
          type="text"
          placeholder="Buscar ..."
          value={value}
          onChange={e => {
            onChange(e.target.value);
            if (typeof onSearch === 'function') onSearch(e.target.value);
          }}
          style={{
            width: categorias && categorias.length > 0 ? '60%' : '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: categorias && categorias.length > 0 ? '24px 0 0 24px' : '24px',
            outline: 'none'
          }}
        />
        {categorias && categorias.length > 0 && (
          <select
            value={categoriaSeleccionada || ''}
            onChange={e => onCategoryChange(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0 24px 24px 0',
              border: '1px solid #ccc',
              fontSize: '1rem',
              outline: 'none'
            }}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.nombre_categoria}>
                {cat.nombre_categoria}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

export default SearchBar;