import React, { useEffect, useState } from 'react';
import Toasts from './components/Toasts/Toasts';
import Header from './components/Header/Header';
import StoreSidebar from './components/StoreSidebar/StoreSidebar';
import HomePage from './pages/HomePage/HomePage';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import AccountPage from './pages/AccountPage/AccountPage';
import DepartmentsPage from './pages/DepartmentsPage/DepartmentsPage';
import EmptyState from './components/EmptyState/EmptyState';
import CartDrawer from './components/CartDrawer/CartDrawer';
import StoreFooter from './components/StoreFooter/StoreFooter';
import AdminLogin from './admin/AdminLogin/AdminLogin';
import AdminShell from './admin/AdminShell/AdminShell';
import AdminRoute from './admin/AdminRoute';

import {
  getAdminSession,
  getCustomerSession,
  getStore,
  getTheme,
  initStore,
  setCustomerSession,
  setThemePreference
} from './utils/storage';

function useRoute() {
  const [path, setPath] = useState(window.location.pathname || '/');
  useEffect(() => {
    const sync = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  const navigate = (nextPath) => {
    window.history.pushState({}, '', nextPath);
    setPath(window.location.pathname || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return [path, navigate];
}

function useStore() {
  const [store, setLocal] = useState(initStore());
  useEffect(() => {
    const sync = () => setLocal(getStore());
    window.addEventListener('store-updated', sync);
    return () => window.removeEventListener('store-updated', sync);
  }, []);
  const save = (next) => {
    setLocal(next);
  };
  return [store, save];
}

function useAdminAuth() {
  const [session, setSession] = useState(getAdminSession());
  useEffect(() => {
    const sync = () => setSession(getAdminSession());
    window.addEventListener('admin-session-updated', sync);
    return () => window.removeEventListener('admin-session-updated', sync);
  }, []);
  return [session, setSession];
}

function useCustomerAuth() {
  const [session, setSession] = useState(getCustomerSession());
  useEffect(() => {
    const sync = () => setSession(getCustomerSession());
    window.addEventListener('customer-session-updated', sync);
    return () => window.removeEventListener('customer-session-updated', sync);
  }, []);

  const saveSession = (nextSession) => {
    setCustomerSession(nextSession);
    setSession(nextSession);
  };

  return [session, saveSession];
}

export default function App() {
  const [store, save] = useStore();
  const [path, navigate] = useRoute();
  const [session] = useAdminAuth();
  const [customerSession, setCustomerSessionState] = useCustomerAuth();
  const [theme, setTheme] = useState(getTheme());
  const [query, setQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('electrocables-sidebar-collapsed') === 'true';
  });

  const handleSetSidebarCollapsed = (collapsed) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('electrocables-sidebar-collapsed', collapsed);
  };

  const showToast = (message, type = 'success') => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => setToasts((items) => items.filter((toast) => toast.id !== id)), 3600);
  };

  const dismissToast = (id) => setToasts((items) => items.filter((toast) => toast.id !== id));

  useEffect(() => {
    document.body.dataset.theme = theme;
    setThemePreference(theme);
  }, [theme]);

  const addCart = (product) => {
    const exists = store.cart?.find((item) => item.id === product.id);
    const cart = exists
      ? store.cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
      : [...(store.cart || []), { ...product, qty: 1 }];
    
    // update localStorage and notify listeners
    localStorage.setItem('electrocables-store-v2', JSON.stringify({ ...store, cart }));
    window.dispatchEvent(new Event('store-updated'));
    showToast(`${product.name} agregado al carrito`);
  };

  const toggleFavorite = (id) => {
    const product = store.products?.find((item) => item.id === id);
    const active = store.favorites?.includes(id);
    const favorites = active 
      ? store.favorites.filter((item) => item !== id) 
      : [id, ...(store.favorites || [])];
      
    localStorage.setItem('electrocables-store-v2', JSON.stringify({ ...store, favorites }));
    window.dispatchEvent(new Event('store-updated'));
    showToast(active ? `${product?.name || 'Producto'} eliminado de favoritos` : `${product?.name || 'Producto'} agregado a favoritos`);
  };

  const handleSaveStore = (nextStore) => {
    localStorage.setItem('electrocables-store-v2', JSON.stringify(nextStore));
    window.dispatchEvent(new Event('store-updated'));
  };

  const productId = path.startsWith('/producto/') ? decodeURIComponent(path.replace('/producto/', '')) : null;
  const selectedProduct = store.products?.find((product) => product.id === productId && !product.hidden);
  const departmentId = path.startsWith('/departamentos/') ? path.replace('/departamentos/', '') : null;
  const isAdminRoute = path.startsWith('/admin');

  if (isAdminRoute) {
    if (path === '/admin/login' || !session) {
      return (
        <>
          <AdminLogin navigate={navigate} showToast={showToast} />
          <Toasts toasts={toasts} dismiss={dismissToast} />
        </>
      );
    }

    return (
      <>
        <AdminShell path={path} navigate={navigate} session={session}>
          <AdminRoute path={path} store={store} save={handleSaveStore} showToast={showToast} />
        </AdminShell>
        <Toasts toasts={toasts} dismiss={dismissToast} />
      </>
    );
  }

  return (
    <>
      <div className={`store-app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <StoreSidebar 
          path={path} 
          navigate={navigate} 
          store={store} 
          collapsed={sidebarCollapsed} 
          setCollapsed={handleSetSidebarCollapsed} 
        />
        <div className="store-workspace">
          <Header
            store={store}
            path={path}
            navigate={navigate}
            query={query}
            setQuery={setQuery}
            theme={theme}
            setTheme={setTheme}
            openCart={() => setCartOpen(true)}
            customerSession={customerSession}
          />
          <div className="store-content-scroll">
            <div className={`store-page-container ${path === '/catalogo' ? 'catalog-page-container' : ''}`}>
              {path === '/' ? <HomePage store={store} navigate={navigate} addCart={addCart} toggleFavorite={toggleFavorite} /> : null}
              {path === '/catalogo' ? <CatalogPage store={store} navigate={navigate} query={query} setQuery={setQuery} addCart={addCart} toggleFavorite={toggleFavorite} /> : null}
              {productId ? <ProductDetailPage product={selectedProduct} store={store} navigate={navigate} addCart={addCart} toggleFavorite={toggleFavorite} /> : null}
              {path === '/carrito' ? <CartPage store={store} save={handleSaveStore} navigate={navigate} showToast={showToast} /> : null}
              {path === '/checkout' ? <CheckoutPage store={store} save={handleSaveStore} navigate={navigate} showToast={showToast} customerSession={customerSession} /> : null}
              {path === '/favoritos' ? <FavoritesPage store={store} navigate={navigate} addCart={addCart} toggleFavorite={toggleFavorite} showToast={showToast} /> : null}
              {path === '/cuenta' ? (
                <AccountPage
                  store={store}
                  saveStore={handleSaveStore}
                  navigate={navigate}
                  customerSession={customerSession}
                  setCustomerSession={setCustomerSessionState}
                  showToast={showToast}
                />
              ) : null}
              {path === '/pedidos' ? (
                <OrdersPage 
                  store={store} 
                  navigate={navigate} 
                  addCart={addCart} 
                  showToast={showToast} 
                />
              ) : null}
              {path === '/perfil' ? <EmptyState title="Perfil de cliente" text="Vista preparada para datos reales de cliente cuando el backend se conecte." /> : null}
              {!['/', '/catalogo', '/carrito', '/checkout', '/favoritos', '/cuenta', '/pedidos', '/perfil'].includes(path) && !productId ? (
                <EmptyState title="Ruta no encontrada" text="La página solicitada no existe en la tienda." action="Volver al inicio" onAction={() => navigate('/')} />
              ) : null}
            </div>
            <StoreFooter />
          </div>
        </div>
      </div>
      <CartDrawer open={cartOpen} close={() => setCartOpen(false)} store={store} save={handleSaveStore} navigate={navigate} showToast={showToast} />
      <Toasts toasts={toasts} dismiss={dismissToast} />
    </>
  );
}
