import React from 'react';
import { money } from '../utils/storage';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import AdminProducts from './AdminProducts/AdminProducts';
import AdminOrders from './AdminOrders/AdminOrders';
import AdminInventory from './AdminInventory/AdminInventory';
import AdminExpenses from './AdminExpenses/AdminExpenses';
import AdminReports from './AdminReports/AdminReports';
import AdminPanel from './AdminPanel/AdminPanel';
import AdminProviders from './AdminProviders/AdminProviders';
import AdminCash from './AdminCash/AdminCash';
import AdminClients from './AdminClients/AdminClients';

export default function AdminRoute({ path, store, save, showToast }) {
  
  if (path === '/admin/productos') {
    return <AdminProducts store={store} save={save} showToast={showToast} />;
  }
  
  if (path === '/admin/pedidos') {
    return <AdminOrders store={store} save={save} showToast={showToast} />;
  }
  
  if (path === '/admin/clientes') {
    return <AdminClients store={store} save={save} showToast={showToast} />;
  }
  
  if (path === '/admin/proveedores') {
    return <AdminProviders store={store} save={save} showToast={showToast} />;
  }
  
  if (path === '/admin/inventario') {
    return <AdminInventory store={store} save={save} showToast={showToast} />;
  }
  
  if (path === '/admin/caja') {
    return <AdminCash store={store} save={save} showToast={showToast} />;
  }
  
  if (path === '/admin/gastos') {
    return <AdminExpenses store={store} save={save} showToast={showToast} />;
  }
  
  if (path === '/admin/reportes') {
    return <AdminReports store={store} />;
  }
  
  if (path === '/admin/logs') {
    const logsList = store.logs || [];
    return (
      <AdminPanel title="Bitácora de Auditoría del Sistema">
        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Usuario</th>
                <th>Operación Realizada</th>
              </tr>
            </thead>
            <tbody>
              {logsList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center empty-cell">No hay logs registrados.</td>
                </tr>
              ) : (
                logsList.map((log) => (
                  <tr key={log.id}>
                    <td className="muted">{new Date(log.date).toLocaleString('es-EC')}</td>
                    <td><strong>{log.user}</strong></td>
                    <td>{log.action}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminPanel>
    );
  }
  
  return <AdminDashboard store={store} />;
}
