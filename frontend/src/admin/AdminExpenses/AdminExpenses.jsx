import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Tag, 
  FileText, 
  Building2,
  Calendar,
  Search
} from 'lucide-react';
import { money, addLog } from '../../utils/storage';
import AdminPanel from '../AdminPanel/AdminPanel';
import './AdminExpenses.css';

export default function AdminExpenses({ store, save, showToast }) {
  const providers = store.providers || [];
  const expensesList = store.expenses || [];
  
  const [form, setForm] = useState({ 
    concept: '', 
    category: 'Operativo', 
    amount: '',
    refNo: '',
    provider: 'Ninguno / Gasto General',
    paymentMethod: 'Efectivo'
  });
  const [query, setQuery] = useState('');

  const total = useMemo(() => {
    return expensesList.reduce((sum, item) => sum + item.amount, 0);
  }, [expensesList]);

  const categoryBreakdown = useMemo(() => {
    const stats = {};
    expensesList.forEach((e) => {
      stats[e.category] = (stats[e.category] || 0) + e.amount;
    });
    return Object.entries(stats).map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percentage: Math.round((amt / (total || 1)) * 100)
    })).sort((a, b) => b.amount - a.amount);
  }, [expensesList, total]);

  const submit = (event) => {
    event.preventDefault();
    if (!form.concept || !form.amount) {
      showToast('Por favor, complete el concepto y el monto del egreso', 'error');
      return;
    }

    const expense = { 
      id: crypto.randomUUID(), 
      concept: form.concept,
      category: form.category,
      amount: Number(form.amount),
      refNo: form.refNo || 'F-GEN',
      provider: form.provider,
      paymentMethod: form.paymentMethod,
      date: new Date().toISOString() 
    };

    save({ 
      ...store, 
      expenses: [expense, ...store.expenses] 
    });

    addLog(`Egreso registrado: ${expense.concept} - ${money(expense.amount)}`);
    
    setForm({ 
      concept: '', 
      category: 'Operativo', 
      amount: '',
      refNo: '',
      provider: 'Ninguno / Gasto General',
      paymentMethod: 'Efectivo'
    });
    showToast('Egreso registrado en cuentas por pagar');
  };

  const deleteExpense = (id) => {
    if (!window.confirm('¿Está seguro de anular este registro de gasto?')) return;
    const item = store.expenses.find((e) => e.id === id);
    save({
      ...store,
      expenses: store.expenses.filter((e) => e.id !== id)
    });
    addLog(`Egreso anulado: ${item.concept}`);
    showToast('Egreso anulado');
  };

  const filteredExpenses = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return expensesList;
    return expensesList.filter((e) => {
      return (
        e.concept?.toLowerCase().includes(term) ||
        e.category?.toLowerCase().includes(term) ||
        e.provider?.toLowerCase().includes(term) ||
        e.refNo?.toLowerCase().includes(term)
      );
    });
  }, [expensesList, query]);

  return (
    <div className="admin-expenses-layout">
      {/* Metrics breakdown */}
      <div className="expenses-metrics-grid">
        <div className="expense-metric-card">
          <DollarSign size={20} className="text-danger" />
          <div className="expense-metric-info">
            <span>Egresos Totales</span>
            <strong>{money(total)}</strong>
            <small>{expensesList.length} transacciones registradas</small>
          </div>
        </div>
        
        {/* Top expenses category card */}
        {categoryBreakdown.slice(0, 2).map((item) => (
          <div key={item.category} className="expense-metric-card">
            <Tag size={20} className="text-accent" />
            <div className="expense-metric-info">
              <span>Gasto Líder: {item.category}</span>
              <strong>{money(item.amount)}</strong>
              <small>{item.percentage}% del total de egresos</small>
            </div>
          </div>
        ))}
      </div>

      <div className="expenses-sections-grid">
        {/* LEFT COLUMN: ADD EXPENSE FORM */}
        <section className="expense-form-section">
          <AdminPanel title="Registrar Egreso / Gasto">
            <form className="admin-expense-form" onSubmit={submit}>
              <label className="expense-input-label">
                Concepto del Gasto *
                <input 
                  placeholder="Ej. Compra de cables calibre #10" 
                  value={form.concept} 
                  onChange={(event) => setForm({ ...form, concept: event.target.value })} 
                  required
                />
              </label>

              <div className="form-row-2">
                <label className="expense-input-label">
                  Monto Egreso (DOP) *
                  <input 
                    type="number" 
                    placeholder="RD$" 
                    value={form.amount} 
                    onChange={(event) => setForm({ ...form, amount: event.target.value })} 
                    required
                  />
                </label>
                <label className="expense-input-label">
                  Categoría Gasto
                  <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                    <option>Operativo</option>
                    <option>Compra Inventario</option>
                    <option>Transporte / Combustible</option>
                    <option>Servicios Básicos</option>
                    <option>Nómina / Salarios</option>
                    <option>Impuestos / Tasas</option>
                  </select>
                </label>
              </div>

              <div className="form-row-2">
                <label className="expense-input-label">
                  Ref. Factura (NCF / Documento)
                  <input 
                    placeholder="Ej. F-1002 o B01004" 
                    value={form.refNo} 
                    onChange={(event) => setForm({ ...form, refNo: event.target.value })} 
                  />
                </label>
                <label className="expense-input-label">
                  Vía / Método Pago
                  <select value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}>
                    <option>Efectivo</option>
                    <option>Transferencia bancaria</option>
                    <option>Tarjeta corporativa</option>
                    <option>Crédito / Cuenta por pagar</option>
                  </select>
                </label>
              </div>

              <label className="expense-input-label">
                Vincular Proveedor
                <select value={form.provider} onChange={(event) => setForm({ ...form, provider: event.target.value })}>
                  <option>Ninguno / Gasto General</option>
                  {providers.map((p) => (
                    <option key={p.id}>{p.name}</option>
                  ))}
                </select>
              </label>

              <button type="submit" className="primary-btn save-expense-btn">
                <Plus size={16} /> Registrar Gasto
              </button>
            </form>
          </AdminPanel>
        </section>

        {/* RIGHT COLUMN: LIST OF EXPENSES IN A TABLE */}
        <section className="expense-table-section">
          <AdminPanel title="Historial y Registro de Egresos">
            <div className="table-actions-header">
              <div className="search-wrapper">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar gastos por concepto o proveedor..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Ref. Factura</th>
                    <th>Proveedor Vinculado</th>
                    <th>Concepto / Categoría</th>
                    <th>Forma Pago</th>
                    <th className="text-right">Monto</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center empty-cell">No se encontraron egresos registrados.</td>
                    </tr>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <tr key={expense.id}>
                        <td className="muted">{new Date(expense.date).toLocaleDateString('es-EC')}</td>
                        <td><span className="payment-badge">{expense.refNo || 'F-GEN'}</span></td>
                        <td>
                          <strong>{expense.provider || 'Gasto General'}</strong>
                        </td>
                        <td>
                          <strong>{expense.concept}</strong>
                          <span className="expense-cat-badge">{expense.category}</span>
                        </td>
                        <td><span className="payment-badge">{expense.paymentMethod || 'Efectivo'}</span></td>
                        <td className="text-right text-danger font-bold">-{money(expense.amount)}</td>
                        <td className="text-center">
                          <button 
                            className="delete-row-btn" 
                            onClick={() => deleteExpense(expense.id)} 
                            title="Anular registro"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </AdminPanel>
        </section>
      </div>
    </div>
  );
}
