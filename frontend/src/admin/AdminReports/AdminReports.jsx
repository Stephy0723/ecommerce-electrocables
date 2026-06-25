import React from 'react';
import { money } from '../../utils/storage';
import AdminPanel from '../AdminPanel/AdminPanel';
import './AdminReports.css';

export default function AdminReports({ store }) {
  const incomesList = store.incomes || [];
  const expensesList = store.expenses || [];
  const ordersList = store.orders || [];
  const productsList = store.products || [];

  const income = incomesList.reduce((sum, item) => sum + item.amount, 0);
  const expenses = expensesList.reduce((sum, item) => sum + item.amount, 0);
  const top = [...productsList].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 6);
  const lowStockCount = productsList.filter((item) => item.stock <= 15).length;

  return (
    <div className="admin-reports-layout">
      <AdminPanel title="Reporte de ventas">
        <div className="report-item">Pedidos: <b>{ordersList.length}</b></div>
        <div className="report-item">Ingresos: <b className="income-text">{money(income)}</b></div>
      </AdminPanel>
      
      <AdminPanel title="Reporte de inventario">
        <div className="report-item">Productos: <b>{productsList.length}</b></div>
        <div className="report-item">Stock bajo: <b className={lowStockCount > 0 ? 'danger-text' : ''}>{lowStockCount}</b></div>
      </AdminPanel>
      
      <AdminPanel title="Productos más vendidos">
        <div className="report-items-list">
          {top.map((product) => (
            <div key={product.id} className="top-sold-item">
              <span className="top-sold-name">{product.name}</span>
              <b>{product.sold || 0} vendidos</b>
            </div>
          ))}
        </div>
      </AdminPanel>
      
      <AdminPanel title="Ingresos y gastos">
        <div className="report-item">Ingresos: <b className="income-text">{money(income)}</b></div>
        <div className="report-item">Gastos: <b className="danger-text">{money(expenses)}</b></div>
        <div className="report-item total-net-row">
          Neto: <b className={income - expenses >= 0 ? 'income-text' : 'danger-text'}>{money(income - expenses)}</b>
        </div>
      </AdminPanel>
    </div>
  );
}
