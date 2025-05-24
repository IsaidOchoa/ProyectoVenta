import React, { useState } from 'react';
import { FaShoppingCart, FaBars } from 'react-icons/fa';

function NavBar({ onCartClick, onShowProviders, onShowCategories, onHistoryClick, onLogout, cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Walmart</span>
        </div>
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <button className="btn" onClick={onCartClick} style={{ fontSize: 28, position: 'relative' }}>
            <FaShoppingCart size={32} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -6,
                right: -6,
                background: '#FFD600',
                color: '#222',
                borderRadius: '50%',
                minWidth: 22,
                height: 22,
                fontSize: 14,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                zIndex: 2
              }}>
                {cartCount}
              </span>
            )}
          </button>
          <div style={{ position: 'relative' }}>
            <button className="btn" onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize: 28 }}>
              <FaBars size={32} />
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '2.5rem',
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                zIndex: 10,
                minWidth: 220
              }}>
                <div
                  style={{ padding: '0.9rem 1.5rem', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#222', background: '#fff' }}
                  onClick={() => { setMenuOpen(false); onShowProviders(); }}
                >
                  Proveedores
                </div>
                <div
                  style={{ padding: '0.9rem 1.5rem', cursor: 'pointer', color: '#222', background: '#fff' }}
                  onClick={() => { setMenuOpen(false); onShowCategories(); }}
                >
                  Categorías
                </div>
                <div
                  style={{ padding: '0.9rem 1.5rem', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#222', background: '#fff' }}
                  onClick={() => { setMenuOpen(false); onHistoryClick(); }}
                >
                  Historial de compras
                </div>
                <div
                  style={{ padding: '0.9rem 1.5rem', cursor: 'pointer', color: 'red', background: '#fff' }}
                  onClick={() => { setMenuOpen(false); onLogout(); }}
                >
                  Cerrar sesión
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;