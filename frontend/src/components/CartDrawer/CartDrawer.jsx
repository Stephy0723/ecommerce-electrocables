import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { money, orderTotals } from '../../utils/storage';
import EmptyState from '../EmptyState/EmptyState';
import './CartDrawer.css';

export default function CartDrawer({ open, close, store, save, navigate, showToast }) {
  const totals = orderTotals(store.cart);
  
  const changeQty = (id, delta) => {
    save({ 
      ...store, 
      cart: store.cart.map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item) 
    });
  };
  
  const remove = (id) => {
    const product = store.cart.find((item) => item.id === id);
    save({ ...store, cart: store.cart.filter((item) => item.id !== id) });
    showToast(`${product?.name || 'Producto'} eliminado del carrito`);
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          {/* Backdrop */}
          <motion.div 
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          
          {/* Drawer content */}
          <motion.aside 
            className="cart-drawer" 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="drawer-head">
              <div>
                <span className="eyebrow">Mi Carrito</span>
                <h2>Resumen de compra</h2>
              </div>
              <button className="close-btn" onClick={close} aria-label="Cerrar carrito">
                <X size={20} />
              </button>
            </div>
            
            <div className="drawer-items">
              {store.cart.map((item) => {
                const itemImg = item.images?.[0]?.url || '';
                return (
                  <article className="cart-line" key={item.id}>
                    <img src={itemImg} alt={item.name} className="cart-line-img" />
                    <div className="cart-line-details">
                      <b className="cart-line-name">{item.name}</b>
                      <span className="cart-line-price">{money(item.offerPrice || item.price)}</span>
                      <div className="qty-control">
                        <button onClick={() => changeQty(item.id, -1)} aria-label="Disminuir"><Minus size={14} /></button>
                        <strong className="qty-val">{item.qty}</strong>
                        <button onClick={() => changeQty(item.id, 1)} aria-label="Aumentar"><Plus size={14} /></button>
                        <button className="delete-btn" onClick={() => remove(item.id)} aria-label="Eliminar"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </article>
                );
              })}
              {!store.cart.length ? (
                <EmptyState compact title="Carrito vacío" text="Agrega productos desde el catálogo para iniciar una orden." />
              ) : null}
            </div>
            
            <div className="drawer-total">
              <div className="subtotal-row">
                <span>Subtotal</span>
                <b>{money(totals.subtotal)}</b>
              </div>
              <button 
                className="checkout-btn" 
                disabled={!store.cart.length} 
                onClick={() => { close(); navigate('/checkout'); }}
              >
                Proceder al pago
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
