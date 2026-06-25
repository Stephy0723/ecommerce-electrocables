import React from 'react';
import { ShoppingBag } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({ title, text, action, onAction, compact = false }) {
  return (
    <div className={`empty-state ${compact ? 'compact' : ''}`}>
      <div className="icon-wrapper">
        <ShoppingBag size={compact ? 24 : 40} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action ? (
        <button className="primary-btn action-btn" onClick={onAction}>
          {action}
        </button>
      ) : null}
    </div>
  );
}
