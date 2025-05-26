import React from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ value, onChange, onSearch, sticky = false }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: 0, // Quita el espacio arriba y abajo
        position: sticky ? 'sticky' : 'static',
        top: sticky ? 0 : 'auto',
        zIndex: sticky ? 100 : 'auto',
        background: sticky ? '#fff' : 'transparent',
        boxShadow: sticky ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
        padding: sticky ? '0.3rem 0' : 0 // Reduce el padding vertical
      }}
    >
      <div
        className="search-bar"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0.3rem', // Reduce el padding interno
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <input
          type="text"
          placeholder="Buscar ..."
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '60%',
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '24px 0 0 24px',
            outline: 'none'
          }}
        />
        <button
          className="btn"
          onClick={onSearch}
          style={{
            background: '#FFD600',
            color: '#222',
            border: 'none',
            padding: '0.5rem 1.2rem',
            borderRadius: '0 24px 24px 0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: 18
          }}
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;