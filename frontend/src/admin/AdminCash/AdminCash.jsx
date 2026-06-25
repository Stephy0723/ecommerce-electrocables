import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Search, 
  Activity, 
  CreditCard,
  Trash2,
  Lock
} from 'lucide-react';
import { money, addLog } from '../../utils/storage';
import AdminPanel from '../AdminPanel/AdminPanel';
import './AdminCash.css';

export default function AdminCash({ store, save, showToast }) {
  const incomes = store.incomes || [];
  const [form, setForm] = useState({
    concept: '',
    method: 'Transferencia bancaria',
    amount: '',
    client: '',
    status: 'Conciliado'
  });
  const [query, setQuery] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!form.concept || !form.amount) {
      showToast('Por favor, complete el concepto y monto', 'error');
      return;
    }

    const nextIncome = {
      id: crypto.randomUUID(),
      concept: form.concept,
      method: form.method,
      amount: Number(form.amount),
      client: form.client || 'Consumidor Final',
      status: form.status,
      date: new Date().toISOString()
    };

    save({
      ...store,
      incomes: [nextIncome, ...store.incomes]
    });

    addLog(`Ingreso registrado manualmente: ${nextIncome.concept} - ${money(nextIncome.amount)}`);
    showToast('Ingreso registrado en caja con éxito');
    setForm({
      concept: '',
      method: 'Transferencia bancaria',
      amount: '',
      client: '',
      status: 'Conciliado'
    });
  };

  const toggleConciliation = (id) => {
    const item = store.incomes.find((i) => i.id === id);
    const nextStatus = item.status === 'Conciliado' ? 'Pendiente' : 'Conciliado';
    
    save({
      ...store,
      incomes: store.incomes.map((i) => i.id === id ? { ...i, status: nextStatus } : i)
    });
    
    showToast(`Ingreso ${item.concept} cambiado a ${nextStatus}`);
  };

  const deleteIncome = (id) => {
    if (!window.confirm('¿Está seguro de anular este ingreso de caja?')) return;
    const item = store.incomes.find((i) => i.id === id);
    save({
      ...store,
      incomes: store.incomes.filter((i) => i.id !== id)
    });
    addLog(`Ingreso anulado: ${item.concept}`);
    showToast('Ingreso anulado');
  };

  const totals = useMemo(() => {
    const total = incomes.reduce((sum, i) => sum + i.amount, 0);
    const reconciled = incomes.filter((i) => i.status === 'Conciliado').reduce((sum, i) => sum + i.amount, 0);
    const pending = incomes.filter((i) => i.status === 'Pendiente').reduce((sum, i) => sum + i.amount, 0);
    
    // Payment method breakdown
    const transfer = incomes.filter((i) => i.method?.toLowerCase().includes('trans')).reduce((sum, i) => sum + i.amount, 0);
    const cash = incomes.filter((i) => i.method?.toLowerCase().includes('efec')).reduce((sum, i) => sum + i.amount, 0);
    
    return { total, reconciled, pending, transfer, cash };
  }, [incomes]);

  const filteredIncomes = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return incomes;
    return incomes.filter((i) => {
      return (
        i.concept?.toLowerCase().includes(term) ||
        i.client?.toLowerCase().includes(term) ||
        i.method?.toLowerCase().includes(term)
      );
    });
  }, [incomes, query]);

  return (
    <div className="admin-cash-layout">
      {/* ── METRICS GRID ── */}
      <div className="cash-metrics-grid">
        <div className="cash-metric-card">
          <DollarSign size={20} className="text-success" />
          <div className="cash-metric-info">
            <span>Caja Total (Ingresos)</span>
            <strong>{money(totals.total)}</strong>
            <small>{incomes.length} cobros registrados</small>
          </div>
        </div>
        <div className="cash-metric-card">
          <CheckCircle size={20} className="text-success" />
          <div className="cash-metric-info">
            <span>Ingresos Conciliados</span>
            <strong>{money(totals.reconciled)}</strong>
            <small>Dinero verificado en banco/caja</small>
          </div>
        </div>
        <div className="cash-metric-card">
          <AlertCircle size={20} className="text-accent" />
          <div className="cash-metric-info">
            <span>Cobros Pendientes</span>
            <strong>{money(totals.pending)}</strong>
            <small>Transacciones por conciliar</small>
          </div>
        </div>
        <div className="cash-metric-card">
          <CreditCard size={20} className="text-electric" />
          <div className="cash-metric-info">
            <span>Transferencias / Tarjetas</span>
            <strong>{money(totals.transfer)}</strong>
            <small>Vías de cobro electrónico</small>
          </div>
        </div>
      </div>

      <div className="cash-sections-grid">
        {/* LEFT COLUMN: ADD INCOME FORM */}
        <section className="cash-form-section">
          <AdminPanel title="Registrar Cobro / Ingreso Manual">
            <form onSubmit={submit} className="cash-form">
              <label className="cash-input-label">
                Concepto del Ingreso *
                <input 
                  value={form.concept} 
                  onChange={(e) => setForm({ ...form, concept: e.target.value })} 
                  placeholder="Ej. Cobro factura Nº 1004"
                  required
                />
              </label>

              <div className="form-row-2">
                <label className="cash-input-label">
                  Monto Cobrado (DOP) *
                  <input 
                    type="number" 
                    value={form.amount} 
                    onChange={(e) => setForm({ ...form, amount: e.target.value })} 
                    placeholder="RD$" 
                    required
                  />
                </label>
                <label className="cash-input-label">
                  Forma de Pago
                  <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                    <option>Transferencia bancaria</option>
                    <option>Tarjeta simulada</option>
                    <option>Pago contra entrega</option>
                    <option>Efectivo</option>
                  </select>
                </label>
              </div>

              <div className="form-row-2">
                <label className="cash-input-label">
                  Cliente / Origen
                  <input 
                    value={form.client} 
                    onChange={(e) => setForm({ ...form, client: e.target.value })} 
                    placeholder="Ej. Constructora Naco o Consumidor Final"
                  />
                </label>
                <label className="cash-input-label">
                  Estado
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="Conciliado">Conciliado (Verificado)</option>
                    <option value="Pendiente">Pendiente (Por revisar)</option>
                  </select>
                </label>
              </div>

              <button type="submit" className="primary-btn save-cash-btn">
                <Plus size={16} /> Agregar Cobro a Caja
              </button>
            </form>
          </AdminPanel>
        </section>

        {/* RIGHT COLUMN: LIST OF INCOMES WITH ACTIONS */}
        <section className="cash-table-section">
          <AdminPanel title="Registro de Operaciones de Caja">
            <div className="table-actions-header">
              <div className="search-wrapper">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar cobros por concepto o cliente..." 
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
                    <th>Concepto / Cliente</th>
                    <th>Forma Pago</th>
                    <th>Estado</th>
                    <th className="text-right">Monto</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncomes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center empty-cell">No se encontraron movimientos de caja correspondientes.</td>
                    </tr>
                  ) : (
                    filteredIncomes.map((income) => {
                      const isPending = income.status === 'Pendiente';
                      return (
                        <tr key={income.id}>
                          <td className="muted">{new Date(income.date).toLocaleDateString('es-EC')}</td>
                          <td>
                            <strong>{income.concept}</strong>
                            <span className="cash-client-text">Cliente: {income.client || 'Consumidor Final'}</span>
                          </td>
                          <td><span className="payment-badge">{income.method || 'Transferencia'}</span></td>
                          <td>
                            <button 
                              className={`status-pill status-${income.status?.toLowerCase() || 'conciliado'} conciliate-toggle-btn`}
                              onClick={() => toggleConciliation(income.id)}
                              title="Haga clic para cambiar estado"
                            >
                              {income.status || 'Conciliado'}
                            </button>
                          </td>
                          <td className="text-right text-success font-bold">+{money(income.amount)}</td>
                          <td className="text-center">
                            <button 
                              className="delete-row-btn" 
                              onClick={() => deleteIncome(income.id)} 
                              title="Anular ingreso"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
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
