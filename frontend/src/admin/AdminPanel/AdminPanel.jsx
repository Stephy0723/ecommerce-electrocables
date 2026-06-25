import React from 'react';
import './AdminPanel.css';

export default function AdminPanel({ title, children }) {
  return (
    <section className="admin-panel">
      <h3 className="panel-title-text">{title}</h3>
      <div className="panel-content-body">
        {children || <p className="muted">Sin registros todavía.</p>}
      </div>
    </section>
  );
}
