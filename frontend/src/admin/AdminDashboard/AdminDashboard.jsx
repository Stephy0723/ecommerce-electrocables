import React, { useMemo } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Activity, 
  Package,
  ArrowRight
} from 'lucide-react';
import { money } from '../../utils/storage';
import AdminPanel from '../AdminPanel/AdminPanel';
import './AdminDashboard.css';

function StatCard({ icon: Icon, label, value, note, trend, trendType }) {
  return (
    <article className="stat-card">
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">
          <Icon size={18} />
        </div>
        <span>{label}</span>
      </div>
      <div className="stat-card-body">
        <b>{value}</b>
        {trend ? (
          <span className={`stat-trend ${trendType}`}>
            {trendType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
        ) : null}
      </div>
      {note ? <small className="stat-card-note">{note}</small> : null}
    </article>
  );
}

export default function AdminDashboard({ store }) {
  const incomesList = store.incomes || [];
  const expensesList = store.expenses || [];
  const ordersList = store.orders || [];
  const productsList = store.products || [];
  const clientsList = store.clients || [];

  // Core calculations
  const totalIncome = useMemo(() => incomesList.reduce((sum, item) => sum + item.amount, 0), [incomesList]);
  const totalExpenses = useMemo(() => expensesList.reduce((sum, item) => sum + item.amount, 0), [expensesList]);
  const netBalance = totalIncome - totalExpenses;
  const avgOrderValue = useMemo(() => {
    return ordersList.length ? (totalIncome / ordersList.length) : 0;
  }, [ordersList, totalIncome]);

  const lowStockProducts = useMemo(() => {
    return productsList.filter((product) => product.stock <= 15);
  }, [productsList]);

  // Unified financial flow
  const unifiedCashFlow = useMemo(() => {
    const incs = incomesList.map(item => ({ ...item, type: 'income', label: 'Ingreso' }));
    const exps = expensesList.map(item => ({ ...item, type: 'expense', label: 'Egreso' }));
    return [...incs, ...exps].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  }, [incomesList, expensesList]);

  // Statistics per Category
  const categoryStats = useMemo(() => {
    const stats = {};
    ordersList.forEach(order => {
      order.items?.forEach(item => {
        stats[item.category] = (stats[item.category] || 0) + item.qty;
      });
    });
    
    const totalQty = Object.values(stats).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(stats).map(([category, qty]) => ({
      category,
      qty,
      percentage: Math.round((qty / totalQty) * 100)
    })).sort((a, b) => b.qty - a.qty);
  }, [ordersList]);

  // Star Product Calculation
  const starProduct = useMemo(() => {
    const sales = {};
    ordersList.forEach(order => {
      order.items?.forEach(item => {
        sales[item.name] = (sales[item.name] || 0) + item.qty;
      });
    });
    
    let topName = 'Ninguno';
    let topQty = 0;
    Object.entries(sales).forEach(([name, qty]) => {
      if (qty > topQty) {
        topQty = qty;
        topName = name;
      }
    });
    return { name: topName, qty: topQty };
  }, [ordersList]);

  return (
    <div className="admin-dashboard">
      {/* ── Metric Cards Grid ── */}
      <div className="stats-grid">
        <StatCard 
          icon={DollarSign} 
          label="Facturación Total" 
          value={money(totalIncome)} 
          note="Ingresos netos por checkout" 
          trend="+12.4%" 
          trendType="up"
        />
        <StatCard 
          icon={TrendingDown} 
          label="Gastos Operativos" 
          value={money(totalExpenses)} 
          note="Pagos y reposición de stock" 
          trend="+4.8%" 
          trendType="down"
        />
        <StatCard 
          icon={Activity} 
          label="Balance Neto (Caja)" 
          value={money(netBalance)} 
          note="Ganancia líquida disponible" 
          trend={netBalance >= 0 ? "+18.2%" : "-5.1%"} 
          trendType={netBalance >= 0 ? "up" : "down"}
        />
        <StatCard 
          icon={ShoppingCart} 
          label="Ticket Promedio" 
          value={money(avgOrderValue)} 
          note="Consumo medio por orden"
        />
      </div>

      {/* ── Secondary indicators (Star product, Client counts) ── */}
      <div className="admin-sub-metrics-grid">
        <div className="sub-metric-card">
          <Award size={20} className="text-electric" />
          <div className="sub-metric-info">
            <span>Producto Más Vendido (Estrella)</span>
            <strong>{starProduct.name}</strong>
            <small>{starProduct.qty} unidades despachadas</small>
          </div>
        </div>
        <div className="sub-metric-card">
          <Users size={20} className="text-electric" />
          <div className="sub-metric-info">
            <span>Clientes Activos</span>
            <strong>{clientsList.length} Clientes registrados</strong>
            <small>Público local en Santo Domingo / Guayaquil</small>
          </div>
        </div>
        <div className="sub-metric-card">
          <AlertTriangle size={20} className={lowStockProducts.length > 0 ? "text-danger" : "text-success"} />
          <div className="sub-metric-info">
            <span>Alertas de Inventario</span>
            <strong>{lowStockProducts.length} productos con stock bajo</strong>
            <small>Menos de 15 unidades en almacén</small>
          </div>
        </div>
      </div>

      {/* ── Primary Panels Grid ── */}
      <div className="admin-dashboard-grid">
        {/* Panel 1: Unified Cash Flow (Incomes & Expenses) */}
        <AdminPanel title="Flujo de Caja Reciente">
          <div className="unified-cash-list">
            {unifiedCashFlow.length === 0 ? (
              <p className="empty-text">Sin movimientos de caja registrados.</p>
            ) : (
              unifiedCashFlow.map((flow) => {
                const isIncome = flow.type === 'income';
                return (
                  <div key={flow.id} className="cash-flow-item">
                    <div className="flow-meta">
                      <span className={`flow-indicator ${flow.type}`} />
                      <div className="flow-details">
                        <b>{flow.concept || `Pedido ${flow.id}`}</b>
                        <span>{new Date(flow.date).toLocaleString('es-EC')} · {flow.method || 'Transferencia'}</span>
                      </div>
                    </div>
                    <strong className={`flow-amount ${isIncome ? 'income' : 'expense'}`}>
                      {isIncome ? '+' : '-'}{money(flow.amount)}
                    </strong>
                  </div>
                );
              })
            )}
          </div>
        </AdminPanel>

        {/* Panel 2: Sales distribution per category */}
        <AdminPanel title="Ventas por Categoría">
          <div className="category-sales-distribution">
            {categoryStats.length === 0 ? (
              <p className="empty-text">Sin datos de ventas para mostrar gráficos.</p>
            ) : (
              categoryStats.map((stat) => (
                <div key={stat.category} className="cat-bar-row">
                  <div className="cat-bar-labels">
                    <span className="cat-name">{stat.category}</span>
                    <span className="cat-vals"><strong>{stat.qty} uds</strong> ({stat.percentage}%)</span>
                  </div>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{ width: `${stat.percentage}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminPanel>

        {/* Panel 3: Low stock alarms */}
        <AdminPanel title="Alertas Críticas de Stock">
          <div className="dashboard-low-stock-list">
            {lowStockProducts.length === 0 ? (
              <p className="empty-text text-success">Inventario saludable. Ninguna alerta de stock.</p>
            ) : (
              lowStockProducts.slice(0, 5).map((prod) => (
                <div key={prod.id} className="low-stock-row">
                  <div className="low-stock-info">
                    <b>{prod.name}</b>
                    <span>Categoría: {prod.category}</span>
                  </div>
                  <div className="low-stock-badge-col">
                    <span className="critical-stock-badge">
                      {prod.stock} uds
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
