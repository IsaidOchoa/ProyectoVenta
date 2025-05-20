import React from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ value, onChange, onSearch }) {
  return (
    <div
      className="search-bar"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <input
        type="text"
        placeholder="Buscar productos..."
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '60%',
          padding: '0.5rem',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '24px 0 0 24px', // curva
          outline: 'none'
        }}
      />
      <button
        className="btn"
        onClick={onSearch}
        style={{
          background: '#FFD600', // amarillo
          color: '#222',
          border: 'none',
          padding: '0.5rem 1.2rem',
          borderRadius: '0 24px 24px 0', // curva
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          fontSize: 18
        }}
      >
        <FaSearch />
      </button>
    </div>
  );
}

export default SearchBar;