import React, { useState, useMemo } from 'react';
import { Search, Sun, Moon, Bell, Heart, ShoppingCart, Menu, X, Check, UserRound } from 'lucide-react';
import { publicLinks } from '../../utils/constants';
import { money } from '../../utils/storage';
import './Header.css';

export default function Header({
  store,
  path,
  navigate,
  query,
  setQuery,
  theme,
  setTheme,
  openCart,
  customerSession
}) {
  const cartCount = store.cart.reduce((sum, item) => sum + item.qty, 0);
  const favCount = store.favorites.length;
  const [open, setOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [readIds, setReadIds] = useState([]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Dynamic notification list from orders and system logs
  const notificationsList = useMemo(() => {
    const list = [];
    
    // Add orders as notifications
    (store.orders || []).slice(0, 3).forEach((order) => {
      list.push({
        id: `order-${order.id}`,
        text: `Nuevo pedido ${order.id} por ${money(order.total)}`,
        date: order.date,
        type: 'order'
      });
    });

    // Add logs as notifications
    (store.logs || []).slice(0, 4).forEach((log) => {
      list.push({
        id: `log-${log.id}`,
        text: `${log.action} (${log.user})`,
        date: log.date,
        type: 'log'
      });
    });

    return list.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  }, [store.orders, store.logs]);

  const unreadNotifs = useMemo(() => {
    return notificationsList.filter((n) => !readIds.includes(n.id));
  }, [notificationsList, readIds]);

  const notificationCount = unreadNotifs.length;

  const clearAllNotifications = (e) => {
    e.stopPropagation();
    const allIds = notificationsList.map((n) => n.id);
    setReadIds(allIds);
  };

  const handleNotifClick = (item) => {
    setReadIds((prev) => [...prev, item.id]);
    setShowNotif(false);
    if (item.type === 'order') {
      navigate('/pedidos');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <header className="store-header">
      <label className="search-box">
        <Search size={18} />
        <input
          value={query}
          placeholder="Buscar cables, breakers, herramientas..."
          onChange={(event) => {
            setQuery(event.target.value);
            if (path !== '/catalogo') navigate('/catalogo');
          }}
        />
      </label>

      <div className="header-actions">
        {/* Toggle Theme Button (Color switcher) */}
        <button 
          className="icon-button theme-toggle-btn" 
          onClick={toggleTheme} 
          aria-label="Cambiar tema" 
          title="Cambiar tema"
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Notifications Dropdown Trigger */}
        <div className="notification-dropdown-wrapper">
          <button 
            className={`icon-button notification-button ${showNotif ? 'active' : ''}`} 
            onClick={() => setShowNotif(!showNotif)}
            aria-label="Notificaciones" 
            title="Notificaciones"
          >
            <Bell size={19} />
            {notificationCount > 0 && <span className="badge">{notificationCount}</span>}
          </button>

          {showNotif && (
            <div className="notifications-dropdown-menu">
              <div className="notif-dropdown-header">
                <h3>Notificaciones</h3>
                {notificationCount > 0 && (
                  <button className="notif-clear-btn" onClick={clearAllNotifications}>
                    <Check size={12} /> Marcar leídas
                  </button>
                )}
              </div>
              <div className="notif-dropdown-body">
                {notificationsList.length === 0 ? (
                  <p className="notif-empty-text">No tienes notificaciones recientes.</p>
                ) : (
                  notificationsList.map((item) => {
                    const isUnread = !readIds.includes(item.id);
                    return (
                      <div 
                        key={item.id} 
                        className={`notif-dropdown-item ${isUnread ? 'unread' : ''}`}
                        onClick={() => handleNotifClick(item)}
                      >
                        <span className="notif-indicator" />
                        <div className="notif-item-content">
                          <p>{item.text}</p>
                          <small>{new Date(item.date).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}</small>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <button className="icon-button" onClick={() => navigate('/favoritos')} aria-label="Favoritos" title="Favoritos">
          <Heart size={19} />
          <span className="badge">{favCount}</span>
        </button>

        <button className="icon-button" onClick={openCart} aria-label="Abrir carrito" title="Carrito">
          <ShoppingCart size={19} />
          <span className="badge">{cartCount}</span>
        </button>

        <button
          className={`customer-pill ${customerSession ? 'signed' : ''}`}
          onClick={() => navigate('/cuenta')}
          aria-label="Cuenta de cliente"
          title="Cuenta de cliente"
        >
          <UserRound size={18} />
          <span>{customerSession?.name?.split(' ')[0] || 'Entrar'}</span>
        </button>

        <button className="icon-button menu-button" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className={open ? 'mobile-nav open' : 'mobile-nav'}>
        {publicLinks.map(({ path: itemPath, label, icon: Icon }) => (
          <button key={itemPath} className={path === itemPath ? 'active' : ''} onClick={() => { navigate(itemPath); setOpen(false); }}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
