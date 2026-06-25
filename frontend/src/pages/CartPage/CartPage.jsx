import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { money, orderTotals } from '../../utils/storage';
import EmptyState from '../../components/EmptyState/EmptyState';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import './CartPage.css';

export default function CartPage({ store, save, navigate, showToast }) {
  const totals = orderTotals(store.cart || []);

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

  if (!store.cart?.length) {
    return (
      <EmptyState 
        title="Tu carrito está vacío" 
        text="Explora el catálogo y agrega materiales a tu orden." 
        action="Ir al catálogo" 
        onAction={() => navigate('/catalogo')} 
      />
    );
  }

  return (
    <main className="cart-page-layout">
      <section className="cart-items-section">
        <div className="section-head tight">
          <div>
            <span className="eyebrow">Mi Carrito</span>
            <h1>Tu Carrito de Compras</h1>
          </div>
        </div>

        <div className="cart-rows-container">
          {store.cart.map((item) => {
            const itemImg = item.images?.[0]?.url || '';
            return (
              <article className="cart-row-item" key={item.id}>
                <img src={itemImg} alt={item.name} className="cart-row-img" />
                <div className="cart-row-info">
                  <b className="cart-row-name" onClick={() => navigate(`/producto/${item.id}`)}>{item.name}</b>
                  <span className="cart-row-meta">{item.brand} · {item.provider}</span>
                </div>
                <strong className="cart-row-price">{money(item.offerPrice || item.price)}</strong>
                <div className="qty-control cart-row-qty">
                  <button onClick={() => changeQty(item.id, -1)} aria-label="Disminuir"><Minus size={14} /></button>
                  <b className="qty-val">{item.qty}</b>
                  <button onClick={() => changeQty(item.id, 1)} aria-label="Aumentar"><Plus size={14} /></button>
                </div>
                <strong className="cart-row-subtotal">{money((item.offerPrice || item.price) * item.qty)}</strong>
                <button className="delete-row-btn" onClick={() => remove(item.id)} aria-label="Eliminar item">
                  <Trash2 size={16} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <OrderSummary 
        totals={totals} 
        actionLabel="Proceder al pago" 
        onAction={() => navigate('/checkout')} 
      />
    </main>
  );
}
