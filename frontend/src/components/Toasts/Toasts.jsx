import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import './Toasts.css';

export default function Toasts({ toasts, dismiss }) {
  return (
    <div className="toast-stack">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            className={`toast toast-${toast.type || 'info'}`}
            key={toast.id}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
          >
            <CheckCircle2 size={18} />
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => dismiss(toast.id)} aria-label="Cerrar notificacion">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
