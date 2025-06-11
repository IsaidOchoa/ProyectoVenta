import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
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
import Modal from './components/Modal';
import UserInfo from './components/UserInfo';
import Loader from './components/Loader';
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  activarProducto,
  desactivarProducto
} from './services/ProductoService';
import { loginUsuario } from './services/UsuarioService';
import {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidadCarrito,
  eliminarDelCarrito,
  vaciarCarrito
} from './services/CarritoService';
import { realizarCompra, obtenerHistorial } from './services/CompraService';
import { obtenerCategorias } from './services/CategoriasService';
import './App.css';

// Wrapper para detalle de producto usando useParams
function ProductDetailWrapper({ productos, onAddToCart, onSelectProduct }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const producto = productos.find(p => p.id === parseInt(id));
  if (!producto) return <div>Producto no encontrado</div>;
  return (
    <ProductView
      producto={producto}
      productos={productos}
      onAddToCart={onAddToCart}
      onSelectProduct={onSelectProduct}
      onBack={() => navigate('/')}
    />
  );
}

// HomeView simple
function HomeView({ productos, onAddToCart, onProductClick, isAdmin, busqueda, setBusqueda, handleSearch, categorias, categoriaSeleccionada, setCategoriaSeleccionada }) {
  return (
    <>
      <div className="search-actions-container">
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          onSearch={handleSearch}
          categorias={categorias}
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoryChange={setCategoriaSeleccionada}
          sticky
        />
        {isAdmin && (
          <div className="action-buttons">
            <button className="btn btn-add" onClick={() => onProductClick('add')}>
              + Agregar producto
            </button>
            <button className="btn btn-edit" onClick={() => onProductClick('edit')}>
              Editar productos
            </button>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        {productos.length === 0 ? (
          <div style={{ fontSize: 20, color: '#888', marginTop: 40 }}>
            No hay productos disponibles
          </div>
        ) : (
          <ProductList
            productos={productos}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </>
  );
}

function App() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cart, setCart] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [modalVentaOpen, setModalVentaOpen] = useState(false);
  const [modalLogoutOpen, setModalLogoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [categorias, setCategorias] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Loader en cada navegación
  useEffect(() => {
    setLoading(true);
    // Espera a que el render termine y oculta el loader
    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

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

  // Carga productos desde el servicio
  useEffect(() => {
    setLoading(true);
    setTimeout(() => { 
      obtenerProductos()
        .then(data => {
          setProductos(data);
          setProductosFiltrados(data);
        })
        .catch(error => {
          alert(error.message || 'Error al cargar productos');
        })
        .finally(() => setLoading(false));
    }, 1500);
  }, []);

  // Guarda el carrito en localStorage por usuario
  useEffect(() => {
    if (usuario) {
      localStorage.setItem(`cart_${usuario.id}`, JSON.stringify(cart));
    }
  }, [cart, usuario]);

  // Recupera el carrito de localStorage al iniciar sesión
  useEffect(() => {
    if (usuario) {
      const cartGuardado = localStorage.getItem(`cart_${usuario.id}`);
      if (cartGuardado) {
        setCart(JSON.parse(cartGuardado));
      } else {
        setCart([]);
      }
    }
  }, [usuario]);

  // Sincroniza el carrito con el backend usando el servicio
  useEffect(() => {
    if (usuario) {
      obtenerCarrito(usuario.id)
        .then(data => setCart(data.productos || []))
        .catch(() => setCart([]));
    }
  }, [usuario]);

  // Carga el historial de compras del usuario
  useEffect(() => {
    if (usuario) {
      obtenerHistorial(usuario.id)
        .then(setHistorial)
        .catch(() => setHistorial([]));
    }
  }, [usuario]);

  // Carga las categorías disponibles
  useEffect(() => {
    obtenerCategorias()
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]));
  }, []);

  // --- Handlers del carrito usando el servicio ---
  const handleAddToCart = async (producto) => {
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
      return [...prev, { ...producto, producto_id: id, cantidad: 1 }];
    });

    showToast('Producto agregado al carrito');
    try {
      await agregarAlCarrito(usuario.id, id, 1);
    } catch {}
  };

  const handleRemoveFromCart = async (producto) => {
    const id = producto.producto_id || producto.id;
    setCart(prev => {
      const found = prev.find(item => item.producto_id === id);
      if (!found) return prev;
      const nuevaCantidad = found.cantidad - 1;
      if (nuevaCantidad <= 0) {
        showToast('Producto eliminado del carrito');
        return prev.filter(item => item.producto_id !== id);
      } else {
        showToast('Cantidad actualizada en el carrito');
        return prev.map(item =>
          item.producto_id === id
            ? { ...item, cantidad: nuevaCantidad }
            : item
        );
      }
    });

    try {
      const found = cart.find(item => (item.producto_id || item.id) === id);
      const nuevaCantidad = found ? found.cantidad - 1 : 0;
      if (nuevaCantidad <= 0) {
        await eliminarDelCarrito(usuario.id, id);
      } else {
        await actualizarCantidadCarrito(usuario.id, id, nuevaCantidad);
      }
    } catch {}
  };

  const handleDeleteFromCart = async (producto) => {
    const id = producto.producto_id || producto.id;
    setCart(prev => prev.filter(item => item.producto_id !== id));
    try {
      await eliminarDelCarrito(usuario.id, id);
      showToast('Producto eliminado del carrito');
    } catch {}
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
      setCart([]);
      try {
        await vaciarCarrito(usuario.id);
        showToast('Carrito vaciado');
      } catch {}
    }
  };

  // --- Handler de pago  ---
  const handlePay = async () => {
    if (cart.length === 0) {
      alert('No hay productos en el carrito');
      return;
    }
    try {
      const data = await realizarCompra({
        usuario_id: usuario.id,
        productos: cart.map(item => ({
          id: item.producto_id || item.id,
          cantidad: item.cantidad
        }))
      });
      if (data.success) {
        showToast('¡Stock actualizado!');
        setCart([]);
        setModalVentaOpen(true);
        const nuevoHistorial = await obtenerHistorial(usuario.id);
        setHistorial(nuevoHistorial);
      } else {
        alert(data.error || 'Error inesperado en el servidor uno');
      }
    } catch (error) {
      alert(error.message || 'Error inesperado en el servidor dos');
    }
  };

  // --- Utilidades y renderizado ---
  const showToast = (mensaje) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, mensaje, visible: true }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSearch = (texto = busqueda) => {
    let filtro = productos.filter(p =>
      p.nombre.toLowerCase().startsWith(busqueda.toLowerCase())
    );
    if (!isAdmin) {
      filtro = filtro.filter(p => p.estado === 1);
    }
    setProductosFiltrados(filtro);
  };

  // --- Renderizado principal con rutas ---
  const productosVisibles = isAdmin
    ? productos
    : productos.filter(p => p.estado === 1);

  // Justo después de obtener productos y categorías:
  const productosConCategoria = productosVisibles.map(p => {
    // Busca la categoría correspondiente por id (ajusta si tu campo es diferente)
    const cat = categorias.find(c => c.id === p.categoria_id);
    return {
      ...p,
      nombre_categoria: cat ? cat.nombre_categoria : ''
    };
  });

  const productosFiltradosPorCategoria = productosVisibles.filter(p =>
    (!categoriaSeleccionada ||
      (p.categoria_nombre &&
        p.categoria_nombre.trim().toLowerCase() === categoriaSeleccionada.trim().toLowerCase())
    ) &&
    (
      !busqueda ||
      p.nombre.toLowerCase().startsWith(busqueda.toLowerCase())
    )
  );

  console.log('Productos:', productos);
  const categoriasDisponibles = Array.from(new Set(productos.map(p => p.categoria))).filter(Boolean);
  console.log('Categorias:', categoriasDisponibles);
  console.log('Productos desde BD:', productosVisibles.map(p => ({
    id: p.id,
    nombre: p.nombre,
    nombre_categoria: p.nombre_categoria,
    categoria: p.categoria
  })));
  console.log('Categoria seleccionada:', categoriaSeleccionada);

  // --- Login y registro usando rutas ---
  if (!usuario) {
    
    return (
      <Routes>
        <Route
          path="/register"
          element={<RegisterView onShowLogin={() => navigate('/login')} />}
        />
        <Route
          path="*"
          element={
            <Login
              onLogin={async ({ correo, contrasena }) => {
                setLoading(true);
                try {
                  const data = await loginUsuario({ correo, contrasena });
                  if (data.success) {
                    setUsuario(data.usuario);
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    localStorage.setItem('token', data.token);
                    setIsAdmin(data.usuario.rol === 'admin');
                    navigate('/');
                  } else {
                    alert(data.message || 'Credenciales incorrectas');
                  }
                } catch (error) {
                  alert('Error al conectar con el servidor');
                } finally {
                  setLoading(false);
                }
              }}
              onShowRegister={() => navigate('/register')}
            />
          }
        />
      </Routes>
    );
  }
  
  return (
    <>
      <NavBar
        cartCount={cart.reduce((sum, item) => sum + item.cantidad, 0)}
        onCartClick={() => navigate('/carrito')}
        onHistoryClick={() => navigate('/historial')}
        onLogout={() => setModalLogoutOpen(true)}
        onAddProduct={() => navigate('/agregar-producto')}
        onAddCategory={() => navigate('/agregar-categoria')}
        onAddProvider={() => navigate('/agregar-proveedor')}
        onShowProviders={() => navigate('/proveedores')}
        onShowCategories={() => navigate('/categorias')}
        onShowUsers={() => navigate('/usuarios')}
        isAdmin={isAdmin}
        usuario={usuario}
      />
      {loading && <Loader />}
      <Routes>
        <Route path="/" element={
          <HomeView
            productos={productosFiltradosPorCategoria}
            onAddToCart={handleAddToCart}
            onProductClick={producto => {
              if (producto === 'add') {
                navigate('/agregar-producto');
              } else if (producto === 'edit') {
                navigate('/editar-productos');
              } else {
                navigate(`/producto/${producto.id}`);
              }
            }}
            isAdmin={isAdmin}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            handleSearch={handleSearch}
            categorias={categorias}
            categoriaSeleccionada={categoriaSeleccionada}
            setCategoriaSeleccionada={setCategoriaSeleccionada}
          />
        } />
        <Route path="/carrito" element={
          <CartView
            cart={cart}
            onAdd={handleAddToCart}
            onRemove={handleRemoveFromCart}
            onDelete={handleDeleteFromCart}
            onClearCart={handleClearCart}
            onPay={handlePay}
            onBack={() => navigate('/')}
          />
        } />
        <Route path="/producto/:id" element={
          <ProductDetailWrapper
            productos={productos}
            onAddToCart={handleAddToCart}
            onSelectProduct={producto => navigate(`/producto/${producto.id}`)}
          />
        } />
        <Route path="/historial" element={
          <PurchaseHistory usuario_id={usuario?.id} historial={historial} onBack={() => navigate('/')} />
        } />
        <Route path="/agregar-producto" element={
          isAdmin ? (
            <AddProduct
              onBack={() => navigate('/')}
              initialData={productoAEditar || {}}
              editMode={!!productoAEditar}
              onProductUpdated={async productoActualizado => {
                try {
                  if (productoActualizado.id) {
                    await actualizarProducto(productoActualizado.id, productoActualizado.formData);
                  } else {
                    await crearProducto(productoActualizado.formData);
                  }
                  const nuevosProductos = await obtenerProductos();
                  setProductos(nuevosProductos);
                  setProductosFiltrados(nuevosProductos);
                  showToast('Producto guardado correctamente');
                  navigate('/');
                } catch (error) {
                  alert(error.message || 'Error al guardar producto');
                }
              }}
            />
          ) : <Navigate to="/" />
        } />
        <Route path="/agregar-categoria" element={
          isAdmin ? <AddCategory onBack={() => navigate('/')} /> : <Navigate to="/" />
        } />
        <Route path="/agregar-proveedor" element={
          isAdmin ? <AddProvider onBack={() => navigate('/')} /> : <Navigate to="/" />
        } />
        <Route path="/editar-productos" element={
          isAdmin ? <EditProducts onBack={() => navigate('/')} /> : <Navigate to="/" />
        } />
        <Route path="/editar-categorias" element={
          isAdmin ? <EditCategories onBack={() => navigate('/')} /> : <Navigate to="/" />
        } />
        <Route path="/editar-proveedores" element={
          isAdmin ? <EditProviders onBack={() => navigate('/')} /> : <Navigate to="/" />
        } />
        <Route path="/proveedores" element={
          isAdmin ? <ProvidersView onBack={() => navigate('/')} /> : <Navigate to="/" />
        } />
        <Route path="/categorias" element={
          isAdmin ? <CategoriesView onBack={() => navigate('/')} /> : <Navigate to="/" />
        } />
        <Route path="/usuarios" element={
          isAdmin ? <UsersView onBack={() => navigate('/')} /> : <Navigate to="/" />
        } />
        <Route path="/usuario" element={
          <UserInfo
            usuario={usuario}
            onUpdateUsuario={setUsuario} // <-- Esto es clave
          />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* Toasts */}
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

      {/* Modal de confirmación de logout */}
      <Modal
        open={modalLogoutOpen}
        onClose={() => setModalLogoutOpen(false)}
        title="Cerrar sesión"
        showClose={true}
        width={400}
      >
        <div style={{ marginBottom: 24, fontSize: 18 }}>
          ¿Seguro que deseas cerrar sesión?
        </div>
        <button
          onClick={() => {
            setModalLogoutOpen(false);
            setUsuario(null);
            setShowRegister(false);
            navigate('/login');
          }}
          style={{
            background: '#1976d2',
            color: '#fff',
            padding: '8px 24px',
            borderRadius: 4,
            border: 'none',
            fontWeight: 600,
            marginRight: 16
          }}
        >
          Confirmar
        </button>
        <button
          onClick={() => setModalLogoutOpen(false)}
          style={{
            background: '#eee',
            color: '#1976d2',
            padding: '8px 24px',
            borderRadius: 4,
            border: 'none',
            fontWeight: 600
          }}
        >
          Cancelar
        </button>
      </Modal>
      <Modal
        open={modalVentaOpen}
        onClose={() => setModalVentaOpen(false)}
        title={null}
        showClose={false}
      >
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ marginTop: 0, marginBottom: 24, textAlign: 'center', fontWeight: 'bold' }}>
            ¡Venta realizada con éxito!
          </h3>
          <p>Gracias por su compra.</p>
          <p>Su pedido está siendo procesado y será enviado a la dirección registrada.</p>
          <button
            onClick={() => {
              setModalVentaOpen(false);
              navigate('/');
            }}
            style={{
              background: '#FFD600',
              color: '#222',
              border: 'none',
              borderRadius: 6,
              padding: '10px 32px',
              fontWeight: 'bold',
              fontSize: '1rem',
              marginTop: 18,
              cursor: 'pointer'
            }}
          >
            Aceptar
          </button>
        </div>
      </Modal>
    </>
  );
}

export default App;

