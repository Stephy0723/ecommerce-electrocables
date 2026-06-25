import React, { useState, useMemo } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Search, 
  Award, 
  ShoppingCart, 
  DollarSign, 
  FileText,
  Calendar,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { money, addLog } from '../../utils/storage';
import AdminPanel from '../AdminPanel/AdminPanel';
import EmptyState from '../../components/EmptyState/EmptyState';
import './AdminClients.css';

export default function AdminClients({ store, save, showToast }) {
  const clients = store.clients || [];
  const orders = store.orders || [];

  const [selectedId, setSelectedId] = useState(clients[0]?.id || null);
  const [query, setQuery] = useState('');

  // Find active client
  const activeClient = useMemo(() => {
    if (!clients.length) return null;
    return clients.find((c) => c.id === selectedId) || clients[0];
  }, [clients, selectedId]);

  // Filter clients by search query
  const filteredClients = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return clients;
    return clients.filter((c) => {
      return (
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.phone?.toLowerCase().includes(term) ||
        c.city?.toLowerCase().includes(term)
      );
    });
  }, [clients, query]);

  // Find orders related to the active client
  const clientOrders = useMemo(() => {
    if (!activeClient) return [];
    return orders.filter(
      (o) => 
        o.email?.toLowerCase() === activeClient.email?.toLowerCase() ||
        o.name?.toLowerCase() === activeClient.name?.toLowerCase()
    );
  }, [orders, activeClient]);

  // Compute metrics for active client
  const metrics = useMemo(() => {
    if (!activeClient) return { count: 0, spent: 0, average: 0 };
    const count = clientOrders.length;
    const spent = clientOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const average = count > 0 ? spent / count : 0;
    return { count, spent, average };
  }, [activeClient, clientOrders]);

  // Handle client status updates
  const handleStatusChange = (status) => {
    if (!activeClient) return;
    save({
      ...store,
      clients: store.clients.map((c) => 
        c.id === activeClient.id ? { ...c, status } : c
      )
    });
    addLog(`Estado de cliente ${activeClient.name} cambiado a: ${status}`);
    showToast(`Estado de cliente actualizado a ${status}`);
  };

  return (
    <div className="admin-clients-layout">
      <div className="clients-split-pane">
        
        {/* LEFT COLUMN: LIST & SEARCH */}
        <aside className="clients-sidebar">
          <div className="search-pane-header">
            <h2 className="pane-subtitle">Clientes ({filteredClients.length})</h2>
            <div className="search-wrapper">
              <Search size={15} />
              <input 
                type="text" 
                placeholder="Buscar cliente..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="clients-cards-container">
            {filteredClients.length === 0 ? (
              <p className="no-results-text">No se encontraron clientes.</p>
            ) : (
              filteredClients.map((c) => {
                const isActive = c.id === activeClient?.id;
                return (
                  <button 
                    key={c.id}
                    className={`client-list-card ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <div className="client-card-header">
                      <User size={15} />
                      <strong>{c.name}</strong>
                    </div>
                    <div className="client-card-body">
                      <span>{c.city || 'Santo Domingo'} · {c.phone}</span>
                      <span className={`status-pill status-${c.status?.toLowerCase() || 'nuevo'}`}>
                        {c.status || 'Nuevo'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: DETAIL CRM HUB */}
        {activeClient ? (
          <section className="client-details-panel animate-fade">
            {/* Header */}
            <div className="client-details-header">
              <div className="client-title-wrapper">
                <span className="client-tag">Ficha de CRM Cliente</span>
                <h2>{activeClient.name}</h2>
                <p>Perfil comercial, consumo acumulado, preferencias e historial de compras.</p>
              </div>
              
              {/* Dropdown status changer */}
              <div className="status-editor-wrapper">
                <label htmlFor="client-status-select">Estado:</label>
                <select 
                  id="client-status-select"
                  className="client-status-select"
                  value={activeClient.status || 'Nuevo'}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Verificado">Verificado</option>
                  <option value="Frecuente">Frecuente</option>
                  <option value="Suspendido">Suspendido</option>
                </select>
              </div>
            </div>

            {/* Quick stats cards */}
            <div className="client-metrics-grid">
              <div className="cli-metric-card">
                <ShoppingCart size={20} className="text-electric" />
                <div className="cli-metric-info">
                  <span>Pedidos Realizados</span>
                  <strong>{metrics.count} compras</strong>
                  <small>Órdenes registradas por email</small>
                </div>
              </div>

              <div className="cli-metric-card">
                <DollarSign size={20} className="text-success" />
                <div className="cli-metric-info">
                  <span>Total Facturado</span>
                  <strong>{money(metrics.spent)}</strong>
                  <small>Inversión total acumulada</small>
                </div>
              </div>

              <div className="cli-metric-card">
                <Sparkles size={20} className="text-accent" />
                <div className="cli-metric-info">
                  <span>Ticket Promedio</span>
                  <strong>{money(metrics.average)}</strong>
                  <small>Valor promedio por orden</small>
                </div>
              </div>
            </div>

            {/* Client Profile Details Card */}
            <div className="client-info-grid">
              <div className="info-cell">
                <User size={15} className="text-electric" />
                <div>
                  <span>Nombre / Razón Social</span>
                  <strong>{activeClient.name}</strong>
                </div>
              </div>

              <div className="info-cell">
                <Mail size={15} className="text-electric" />
                <div>
                  <span>Correo Electrónico</span>
                  <strong>{activeClient.email}</strong>
                </div>
              </div>

              <div className="info-cell">
                <Phone size={15} className="text-electric" />
                <div>
                  <span>Teléfono Móvil</span>
                  <strong>{activeClient.phone || 'No registrado'}</strong>
                </div>
              </div>

              <div className="info-cell">
                <MapPin size={15} className="text-electric" />
                <div>
                  <span>Ciudad de Preferencia</span>
                  <strong>{activeClient.city || 'Santo Domingo'}</strong>
                </div>
              </div>
            </div>

            {/* Sub-Panel 1: Orders History */}
            <div className="cli-sub-panel">
              <h3>Historial de Órdenes Adquiridas</h3>
              <div className="table-responsive-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Pedido ID</th>
                      <th>Fecha</th>
                      <th>Entrega</th>
                      <th>Estado Despacho</th>
                      <th>Método Pago</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center empty-cell">No se registran compras para este cliente en el sistema.</td>
                      </tr>
                    ) : (
                      clientOrders.map((order) => (
                        <tr key={order.id}>
                          <td><span className="sku-badge">{order.id}</span></td>
                          <td className="muted">{new Date(order.date).toLocaleDateString('es-EC')}</td>
                          <td>{order.delivery || 'Retiro en Almacén'}</td>
                          <td>
                            <span className={`status-pill status-${order.status?.toLowerCase() || 'pendiente'}`}>
                              {order.status || 'Pendiente'}
                            </span>
                          </td>
                          <td><span className="payment-badge">{order.paymentMethod || 'Efectivo'}</span></td>
                          <td className="text-right font-bold">{money(order.total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-Panel 2: Delivery details */}
            {clientOrders.length > 0 && (
              <div className="cli-sub-panel">
                <h3>Detalles de Entrega Recientes</h3>
                <div className="delivery-log-summary">
                  {clientOrders.slice(0, 3).map((order, idx) => (
                    <div key={order.id} className="delivery-card">
                      <div className="delivery-card-header">
                        <Calendar size={13} />
                        <span>Pedido del {new Date(order.date).toLocaleDateString('es-EC')}</span>
                      </div>
                      <div className="delivery-card-details">
                        <p><strong>Destinatario:</strong> {order.name} - {order.phone}</p>
                        <p><strong>Ubicación:</strong> {order.address || 'N/A'}, {order.city}</p>
                        {order.driver && <p><strong>Motorizado / Driver:</strong> {order.driver}</p>}
                        {order.currentLocation && <p><strong>Estado en Ruta:</strong> {order.currentLocation}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </section>
        ) : (
          <EmptyState compact title="Seleccionar Cliente" text="Seleccione un cliente del panel de búsqueda para ver sus métricas de facturación y perfil." />
        )}
      </div>
    </div>
  );
}
