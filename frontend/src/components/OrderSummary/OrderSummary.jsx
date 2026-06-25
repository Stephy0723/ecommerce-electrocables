import React from 'react';
import { money } from '../../utils/storage';
import './OrderSummary.css';

export default function OrderSummary({ totals, actionLabel, onAction }) {
  return (
    <aside className="summary-card">
      <h3 className="summary-title">Resumen del pedido</h3>
      <div className="summary-row">
        <span>Subtotal</span>
        <b>{money(totals.subtotal)}</b>
      </div>
      <div className="summary-row">
        <span>Envío</span>
        <b>{totals.shipping ? money(totals.shipping) : 'Gratis'}</b>
      </div>
      <div className="summary-row">
        <span>ITBIS simulado</span>
        <b>{money(totals.taxes)}</b>
      </div>
      <div className="summary-total-row">
        <span>Total</span>
        <b>{money(totals.total)}</b>
      </div>
      {onAction ? (
        <button className="primary-btn checkout-btn-summary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </aside>
  );
}
