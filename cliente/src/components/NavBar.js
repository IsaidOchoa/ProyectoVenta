import React, { useState, useRef, useEffect } from 'react';
import { FaShoppingCart, FaBars, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function NavBar({ onCartClick, onShowProviders, onShowCategories, onHistoryClick, onLogout, cartCount, onShowUsers, isAdmin, usuario }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>UVmart</span>
          {usuario && usuario.nombre && usuario.apellido && (
            <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 500 }}>
              Bienvenido {usuario.nombre} {usuario.apellido}
            </span>
          )}
        </div>
        <div
          className="navbar-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem', // Reducido para juntar más los iconos
            minWidth: 120, // Opcional: reduce el ancho mínimo
            justifyContent: 'flex-end' // Alinea los iconos a la derecha
          }}
        >
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
          <button
            onClick={() => navigate('/usuario')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 28,
              color: '#fff',
              marginLeft: 0,
              marginRight: 0
            }}
            title="Ver información de usuario"
          >
            <FaUser />
          </button>
          <button className="btn" onClick={() => setMenuOpen(!menuOpen)} style={{ fontSize: 28, color: '#fff' }}>
            <FaBars size={32} />
          </button>
          <div style={{ position: 'relative' }}>
            {menuOpen && (
              <div
                ref={menuRef}
                style={{
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
                {isAdmin && (
                  <>
                    <div
                      style={{ padding: '0.9rem 1.5rem', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#222', background: '#fff' }}
                      onClick={() => { setMenuOpen(false); onShowUsers && onShowUsers(); }}
                    >
                      Usuarios
                    </div>
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
                  </>
                )}
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