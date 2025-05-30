import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import ProductList from './components/ProductList';
import SearchBar from './components/SearchBar';
import CartView from './components/CartView';
import PurchaseHistory from './components/PurchaseHistory';
import AddProduct from './components/AddProduct';
import AddCategory from './components/AddCategory';
import AddProvider from './components/AddProvider';
import EditProducts from './components/EditProducts';
import EditCategories from './components/EditCategories';
import EditProviders from './components/EditProviders';
import ProvidersView from './components/ProvidersView';
import CategoriesView from './components/CategoriesView';
import Toast from './components/Toast';
import ProductView from './components/ProductView';
import Login from './components/Login';
import RegisterView from './components/RegisterView';
import UsersView from './components/UsersView';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Inicialmente false
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showEditProducts, setShowEditProducts] = useState(false);
  const [showEditCategories, setShowEditCategories] = useState(false);
  const [showEditProviders, setShowEditProviders] = useState(false);
  const [showProvidersView, setShowProvidersView] = useState(false);
  const [showCategoriesView, setShowCategoriesView] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showUsersView, setShowUsersView] = useState(false);

  // Recupera usuario y rol
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);
      setIsAdmin(user.rol === 'admin');
    }
  }, []);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
      setIsAdmin(usuario.rol === 'admin');
    } else {
      localStorage.removeItem('usuario');
      setIsAdmin(false);
    }
  }, [usuario]);

  useEffect(() => {
    fetch('http://localhost/ProyectoVenta/public/api/productos')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setProductosFiltrados(data);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost/ProyectoVenta/public/api/auth/token')
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
      });
  }, []);

  useEffect(() => {
    if (showHistory) {
      setHistorial([
        { id: 1, nombre: 'Ticket 1', total: 120.50, fecha: '2024-06-01', estado: 'en bodega' },
        { id: 2, nombre: 'Ticket 2', total: 89.99, fecha: '2024-06-10', estado: 'en camino' },
        { id: 3, nombre: 'Ticket 3', total: 45.00, fecha: '2024-06-15', estado: 'entregado' }
      ]);
    }
  }, [showHistory]);

  // Al guardar:
  useEffect(() => {
    if (usuario) {
      localStorage.setItem(`cart_${usuario.id}`, JSON.stringify(cart));
    }
  }, [cart, usuario]);

  useEffect(() => {
    if (usuario) {
      const cartGuardado = localStorage.getItem(`cart_${usuario.id}`);
      if (cartGuardado) {
        setCart(JSON.parse(cartGuardado));
      } else {
        setCart([]);
      }
    }
    // Si no hay usuario, puedes limpiar el carrito si lo deseas:
    // else {
    //   setCart([]);
    // }
  }, [usuario]);

  useEffect(() => {
    if (usuario) {
      fetch(`http://localhost/ProyectoVenta/public/api/carrito/${usuario.id}`)
        .then(res => res.json())
        .then(data => setCart(data.productos || []));
    }
  }, [usuario]);



  const handleAddToCart = (producto) => {
    // Siempre usa producto_id para comparar y guardar
    const id = producto.producto_id || producto.id;
    let nuevaCantidad = 1;
    setCart(prev => {
      const found = prev.find(item => item.producto_id === id);
      if (found) {
        nuevaCantidad = found.cantidad + 1;
        return prev.map(item =>
          item.producto_id === id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        );
      }
      // Siempre guarda producto_id
      return [...prev, { ...producto, producto_id: id, cantidad: 1 }];
    });

    showToast('Producto agregado al carrito');

    fetch(`http://localhost/ProyectoVenta/public/api/carrito/${usuario.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto_id: id, cantidad: 1 })
    });
  };

  const handleRemoveFromCart = (producto) => {
    const id = producto.producto_id || producto.id;
    setCart(prev => {
      const found = prev.find(item => item.producto_id === id);
      if (!found) return prev;
      const nuevaCantidad = found.cantidad - 1;
      if (nuevaCantidad <= 0) {
        fetch(`http://localhost/ProyectoVenta/public/api/carrito/${usuario.id}/${id}`, {
          method: 'DELETE'
        });
        showToast('Producto eliminado del carrito');
        return prev.filter(item => item.producto_id !== id);
      } else {
        fetch(`http://localhost/ProyectoVenta/public/api/carrito/${usuario.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ producto_id: id, cantidad: nuevaCantidad })
        });
        showToast('Cantidad actualizada en el carrito');
        return prev.map(item =>
          item.producto_id === id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        );
      }
    });
  };

  const handleDeleteFromCart = (producto) => {
    const id = producto.producto_id || producto.id;
    setCart(prev => prev.filter(item => item.producto_id !== id));
    fetch(`http://localhost/ProyectoVenta/public/api/carrito/${usuario.id}/${id}`, {
      method: 'DELETE'
    });
    showToast('Producto eliminado del carrito');
  };

  const handleSearch = () => {
    let filtro = productos.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );
    if (!isAdmin) {
      filtro = filtro.filter(p => p.estado === 1);
    }
    setProductosFiltrados(filtro);
  };

  // Al mostrar el carrito, oculta la selección de productos
  const handleCartClick = () => {
    setShowCart(true);
    setSelectedProduct(null); // Oculta la vista de producto individual
    setShowHistory(false);
    setShowAddProduct(false);
    setShowAddCategory(false);
    setShowAddProvider(false);
    setShowEditProducts(false);
    setShowEditCategories(false);
    setShowEditProviders(false);
    setShowProvidersView(false);
    setShowCategoriesView(false);
  };

  const handleBackToShop = () => setShowCart(false);

  const handleHistoryClick = () => {
    setShowHistory(true);
    setShowCart(false);
    setShowAddProduct(false);
    setShowAddCategory(false);
    setShowAddProvider(false);
    setShowEditProducts(false);
    setShowEditCategories(false);
    setShowEditProviders(false);
    setShowProvidersView(false);
    setShowCategoriesView(false);
    setShowUsersView(false);
  };

  const handleLogout = () => {
    setUsuario(null);
    setShowRegister(false);
  };

  const handlePay = async () => {
    // El carrito ya está sincronizado con la BD, así que puedes usar el estado `cart`
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const body = {
      productos: cart.map(item => ({
        id: item.producto_id, // O item.id según tu estructura
        cantidad: item.cantidad,
        // Puedes agregar precio_unitario si lo necesitas
      })),
      usuario_id: usuario.id
    };

    const response = await fetch('http://localhost/ProyectoVenta/public/api/compras/realizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      alert('Error inesperado en el servidor');
      return;
    }
    if (data.success) {
      alert(data.message);
      setCart([]);
      // Vacía el carrito en la BD
      await fetch(`http://localhost/ProyectoVenta/public/api/carrito/${usuario.id}`, {
        method: 'DELETE'
      });
      setShowCart(false);
      // Recarga productos
      fetch('http://localhost/ProyectoVenta/public/api/productos')
        .then(res => res.json())
        .then(data => {
          setProductos(data);
          setProductosFiltrados(data);
        });
    } else {
      alert(data.error || 'Error al realizar la compra');
    }
  };

  const handleShowProviders = () => {
    setShowProvidersView(true);
    setShowCategoriesView(false);
    setShowCart(false);
    setShowHistory(false);
    setShowAddProduct(false);
    setShowAddCategory(false);
    setShowAddProvider(false);
    setShowEditProducts(false);
    setShowEditCategories(false);
    setShowEditProviders(false);
    setShowUsersView(false);
  };

  const handleShowCategories = () => {
    setShowCategoriesView(true);
    setShowProvidersView(false);
    setShowCart(false);
    setShowHistory(false);
    setShowAddProduct(false);
    setShowAddCategory(false);
    setShowAddProvider(false);
    setShowEditProducts(false);
    setShowEditCategories(false);
    setShowEditProviders(false);
    setShowUsersView(false);
  };

  const handleShowUsers = () => {
    setShowUsersView(true);
    setShowProvidersView(false);
    setShowCategoriesView(false);
    setShowCart(false);
    setShowHistory(false);
    setShowAddProduct(false);
    setShowAddCategory(false);
    setShowAddProvider(false);
    setShowEditProducts(false);
    setShowEditCategories(false);
    setShowEditProviders(false);
    setSelectedProduct(null);
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setShowHistory(false);
    setShowCart(false);
    setShowAddProduct(false);
    setShowAddCategory(false);
    setShowAddProvider(false);
    setShowEditProducts(false);
    setShowEditCategories(false);
    setShowEditProviders(false);
    setShowProvidersView(false);
    setShowCategoriesView(false);
    setShowUsersView(false);
  };

  const handleProductClick = (producto) => {
    setSelectedProduct(producto);
    setShowCart(false);
    setShowHistory(false);
    setShowAddProduct(false);
    setShowAddCategory(false);
    setShowAddProvider(false);
    setShowEditProducts(false);
    setShowEditCategories(false);
    setShowEditProviders(false);
    setShowProvidersView(false);
    setShowCategoriesView(false);
  };

  const showToast = (mensaje) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, mensaje, visible: true }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Filtrado de productos según el rol
  const productosVisibles = isAdmin
    ? productos // Admin ve todos
    : productos.filter(p => p.estado === 1); // Cliente solo ve activos

  // Cambia la lógica de renderizado para login/registro:
  if (!usuario) {
    if (showRegister) {
      return (
        <RegisterView
          onShowLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLogin={async ({ correo, contrasena }) => {
          try {
            const response = await fetch('http://localhost/ProyectoVenta/public/api/usuarios/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ correo, contrasena })
            });
            const data = await response.json();
            if (data.success) {
              setUsuario(data.usuario);
              localStorage.setItem('usuario', JSON.stringify(data.usuario));
              localStorage.setItem('token', data.token);
              setIsAdmin(data.usuario.rol === 'admin');
            } else {
              alert(data.message || 'Credenciales incorrectas');
            }
          } catch (error) {
            alert('Error al conectar con el servidor');
          }
        }}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div>
      <NavBar
        cartCount={cart.reduce((sum, item) => sum + item.cantidad, 0)}
        onCartClick={handleCartClick}
        onHistoryClick={handleHistoryClick}
        onLogout={handleLogout}
        onAddProduct={() => { setShowAddProduct(true); setShowAddCategory(false); setShowAddProvider(false); setShowCart(false); setShowHistory(false); }}
        onAddCategory={() => { setShowAddCategory(true); setShowAddProduct(false); setShowAddProvider(false); setShowCart(false); setShowHistory(false); }}
        onAddProvider={() => { setShowAddProvider(true); setShowAddProduct(false); setShowAddCategory(false); setShowCart(false); setShowHistory(false); }}
        onShowProviders={handleShowProviders}
        onShowCategories={handleShowCategories}
        onShowUsers={handleShowUsers}
        isAdmin={isAdmin}
        usuario={usuario}
      />
      {showUsersView ? (
        <UsersView onBack={handleBackToHome} />
      ) : (
        <>
          {showAddProduct && isAdmin && <AddProduct onBack={handleBackToHome} />}
          {showAddCategory && isAdmin && <AddCategory onBack={handleBackToHome} />}
          {showAddProvider && isAdmin && <AddProvider onBack={handleBackToHome} />}
          {showEditProducts && isAdmin && <EditProducts onBack={handleBackToHome} />}
          {showEditCategories && isAdmin && <EditCategories onBack={handleBackToHome} />}
          {showEditProviders && isAdmin && <EditProviders onBack={handleBackToHome} />}
          {showProvidersView && isAdmin && <ProvidersView onBack={handleBackToHome} />}
          {showCategoriesView && isAdmin && <CategoriesView onBack={handleBackToHome} />}
          {showHistory && <PurchaseHistory historial={historial} onBack={handleBackToHome} />}
          {showCart && (
            <CartView
              cart={cart}
              onAdd={handleAddToCart}
              onRemove={handleRemoveFromCart}
              onDelete={handleDeleteFromCart}
              onPay={handlePay}
              onBack={handleBackToHome}
            />
          )}
          {!showCart && (
            <div style={{
              position: 'fixed',
              bottom: 30,
              right: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 10,
              zIndex: 9999
            }}>
              {toasts.map(toast => (
                <Toast key={toast.id} mensaje={toast.mensaje} visible={toast.visible} />
              ))}
            </div>
          )}
          {selectedProduct ? (
            <ProductView
              producto={selectedProduct}
              productos={productos}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleProductClick}
              onBack={handleBackToHome}
            />
          ) : (
            !showCart && !showHistory && !showAddProduct && !showAddCategory && !showAddProvider && !showEditProducts && !showEditCategories && !showEditProviders && !showProvidersView && !showCategoriesView && (
              <>
                <div className="search-actions-container">
                  <SearchBar
                    value={busqueda}
                    onChange={setBusqueda}
                    onSearch={handleSearch}
                    sticky
                  />
                  {isAdmin && (
                    <div className="action-buttons">
                      <button className="btn btn-add" onClick={() => setShowAddProduct(true)}>
                        + Agregar producto
                      </button>
                      <button className="btn btn-edit" onClick={() => setShowEditProducts(true)}>
                        Editar productos
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                  <ProductList
                    productos={productosFiltrados.length > 0 || busqueda ? productosFiltrados : productosVisibles}
                    onAddToCart={handleAddToCart}
                    onProductClick={handleProductClick}
                  />
                </div>
              </>
            )
          )}
        </>
      )}
    </div>
  );
}

export default App;

