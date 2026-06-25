import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Truck, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle,
  FileCheck,
  ChevronRight,
  Clipboard,
  ShieldAlert,
  Save
} from 'lucide-react';
import { money, addLog } from '../../utils/storage';
import AdminPanel from '../AdminPanel/AdminPanel';
import EmptyState from '../../components/EmptyState/EmptyState';
import './AdminOrders.css';

export default function AdminOrders({ store, save, showToast }) {
  const ordersList = store.orders || [];
  const [selectedId, setSelectedId] = useState(ordersList[0]?.id || null);
  
  // Local state for temporary inputs in the detailed view
  const [notes, setNotes] = useState('');
  const [lastSelected, setLastSelected] = useState(null);

  const activeOrder = useMemo(() => {
    if (!ordersList.length) return null;
    const active = ordersList.find((o) => o.id === selectedId) || ordersList[0];
    
    // Sync note state when active order changes
    if (active && active.id !== lastSelected) {
      setNotes(active.adminNotes || '');
      setLastSelected(active.id);
    }
    return active;
  }, [ordersList, selectedId, lastSelected]);

  const updateOrderData = (id, fields) => {
    save({ 
      ...store, 
      orders: store.orders.map((order) => 
        order.id === id ? { ...order, ...fields } : order
      ) 
    });
  };

  const handleStatusChange = (status) => {
    if (!activeOrder) return;
    const fields = { status };
    
    // Auto-update timestamps based on status
    if (status === 'Enviado' && !activeOrder.dispatchedAt) {
      fields.dispatchedAt = new Date().toISOString();
      fields.currentLocation = 'Tránsito - Salida de Bodega';
    } else if (status === 'Entregado' && !activeOrder.arrivedAt) {
      fields.arrivedAt = new Date().toISOString();
      fields.currentLocation = 'En Destino - Entregado';
    }
    
    updateOrderData(activeOrder.id, fields);
    addLog(`Estado de pedido ${activeOrder.id} cambiado a: ${status}`);
    showToast(`Pedido cambiado a ${status}`);
  };

  const handleAssignDriver = (driver) => {
    if (!activeOrder) return;
    updateOrderData(activeOrder.id, { driver });
    addLog(`Conductor asignado al pedido ${activeOrder.id}: ${driver}`);
    showToast(`Conductor asignado: ${driver}`);
  };

  const handleUpdateLocation = (location) => {
    if (!activeOrder) return;
    updateOrderData(activeOrder.id, { currentLocation: location });
    addLog(`Ubicación de pedido ${activeOrder.id} actualizada: ${location}`);
    showToast(`Ubicación actualizada: ${location}`);
  };

  const handleSaveNotes = () => {
    if (!activeOrder) return;
    updateOrderData(activeOrder.id, { adminNotes: notes });
    showToast('Notas de administración guardadas');
  };

  const markDispatched = () => {
    if (!activeOrder) return;
    const now = new Date().toISOString();
    updateOrderData(activeOrder.id, { 
      dispatchedAt: now, 
      status: 'Enviado',
      currentLocation: 'Tránsito - Salida de Bodega'
    });
    addLog(`Salida de despacho registrada para pedido ${activeOrder.id}`);
    showToast('Salida registrada (Estado: Enviado)');
  };

  const markArrived = () => {
    if (!activeOrder) return;
    const now = new Date().toISOString();
    updateOrderData(activeOrder.id, { 
      arrivedAt: now, 
      status: 'Entregado',
      currentLocation: 'En Destino - Entregado'
    });
    addLog(`Entrega confirmada para pedido ${activeOrder.id}`);
    showToast('Entrega registrada (Estado: Entregado)');
  };

  if (!ordersList.length) {
    return (
      <EmptyState 
        title="No hay pedidos registrados" 
        text="Las compras generadas en la tienda pública se mostrarán en este panel de control." 
      />
    );
  }

  const isDelivery = activeOrder?.delivery?.toLowerCase().includes('domicilio') || activeOrder?.delivery?.toLowerCase().includes('obra');

  return (
    <div className="admin-orders-layout">
      <div className="orders-split-pane">
        
        {/* LEFT COLUMN: LIST */}
        <aside className="orders-sidebar">
          <h2 className="pane-subtitle">Órdenes Recibidas ({ordersList.length})</h2>
          <div className="orders-cards-container">
            {ordersList.map((order) => {
              const isActive = order.id === activeOrder?.id;
              const dateObj = new Date(order.date);
              return (
                <button 
                  key={order.id}
                  className={`order-list-card ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedId(order.id)}
                >
                  <div className="order-card-meta">
                    <span className="order-card-code">{order.id}</span>
                    <span className="order-card-date">
                      {dateObj.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="order-card-summary">
                    <span className="order-card-items-count">
                      {order.customer?.name || 'Cliente'}
                    </span>
                    <strong className="order-card-amount">{money(order.total)}</strong>
                  </div>
                  <div className="order-card-footer">
                    <span className={`order-status-dot status-${order.status?.toLowerCase() || 'pendiente'}`} />
                    <span className="order-card-status">{order.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT COLUMN: DETAILED DISPATCH COMMAND CENTER */}
        {activeOrder && (
          <section className="order-details-panel animate-fade">
            {/* Header */}
            <div className="order-details-header">
              <div>
                <span className="order-detail-tag">Consola de Control de Pedidos</span>
                <h2>Orden {activeOrder.id}</h2>
                <p>Monitoree despachos, asigne conductores e indique estados internos de tránsito.</p>
              </div>
              <div className="status-selector-wrapper">
                <span className="status-label">Estado:</span>
                <select 
                  value={activeOrder.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`admin-status-dropdown status-${activeOrder.status?.toLowerCase() || 'pendiente'}`}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Enviado">Enviado (En Camino)</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Client and Fiscal Details */}
            <div className="order-customer-card">
              <h3 className="section-title-small">Datos del Cliente & Factura</h3>
              <div className="customer-info-grid">
                <div className="customer-info-cell">
                  <User size={15} className="text-electric" />
                  <div>
                    <span>Razón Social / Cliente</span>
                    <strong>{activeOrder.customer?.name}</strong>
                  </div>
                </div>
                <div className="customer-info-cell">
                  <FileText size={15} className="text-electric" />
                  <div>
                    <span>Comprobante SRI / DGII</span>
                    <strong>{activeOrder.customer?.taxType} (ID: {activeOrder.customer?.taxId})</strong>
                  </div>
                </div>
                <div className="customer-info-cell">
                  <Phone size={15} className="text-electric" />
                  <div>
                    <span>Teléfono</span>
                    <strong>{activeOrder.customer?.phone}</strong>
                  </div>
                </div>
                <div className="customer-info-cell">
                  <Mail size={15} className="text-electric" />
                  <div>
                    <span>Correo</span>
                    <strong>{activeOrder.customer?.email}</strong>
                  </div>
                </div>
                <div className="customer-info-cell col-span-2">
                  <MapPin size={15} className="text-electric" />
                  <div>
                    <span>Dirección de Despacho ({activeOrder.delivery})</span>
                    <strong>{activeOrder.customer?.address}, {activeOrder.customer?.city}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Tracking Command Panel */}
            {isDelivery && (
              <div className="dispatch-controller-panel">
                <h3 className="section-title-small">Control de Despacho & Reparto</h3>
                
                <div className="dispatch-form-grid">
                  <label className="dispatch-label">
                    Asignar Conductor de Reparto
                    <select 
                      value={activeOrder.driver || ''} 
                      onChange={(e) => handleAssignDriver(e.target.value)}
                    >
                      <option value="">-- Seleccionar Conductor --</option>
                      <option value="Carlos Mendoza - Toyota Hilux (GPX-921)">Carlos Mendoza - Toyota Hilux (GPX-921)</option>
                      <option value="Milton Noboa - Hino Dutro (GBA-8821)">Milton Noboa - Hino Dutro (GBA-8821)</option>
                      <option value="Andrés López - Suzuki Carry (MAA-5521)">Andrés López - Suzuki Carry (MAA-5521)</option>
                    </select>
                  </label>

                  <label className="dispatch-label">
                    Ubicación de Tránsito / Courier
                    <select 
                      value={activeOrder.currentLocation || 'En Almacén'} 
                      onChange={(e) => handleUpdateLocation(e.target.value)}
                    >
                      <option value="Bodega Central">Bodega Central</option>
                      <option value="En Bodega - Empacado">En Bodega - Empacado</option>
                      <option value="En Tránsito - Av. de las Américas">En Tránsito - Av. de las Américas</option>
                      <option value="En Tránsito - Av. Francisco de Orellana">En Tránsito - Av. Francisco de Orellana</option>
                      <option value="En Tránsito - Próximo al destino">En Tránsito - Próximo al destino</option>
                      <option value="En Destino - Entregado">En Destino - Entregado</option>
                    </select>
                  </label>
                </div>

                {/* Dispatch Time Actions */}
                <div className="dispatch-actions-row">
                  <div className="action-card">
                    <Clock size={16} />
                    <div>
                      <span>Salida de Almacén</span>
                      {activeOrder.dispatchedAt ? (
                        <strong>{new Date(activeOrder.dispatchedAt).toLocaleString('es-EC')}</strong>
                      ) : (
                        <button className="small-action-btn dispatch" onClick={markDispatched}>
                          <Truck size={12} /> Registrar Salida
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="action-card">
                    <CheckCircle size={16} />
                    <div>
                      <span>Entrega en Obra / Destino</span>
                      {activeOrder.arrivedAt ? (
                        <strong>{new Date(activeOrder.arrivedAt).toLocaleString('es-EC')}</strong>
                      ) : (
                        <button className="small-action-btn complete" onClick={markArrived}>
                          <FileCheck size={12} /> Confirmar Entrega
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Items list table */}
            <div className="order-items-table-section">
              <h3 className="section-title-small">Materiales Solicitados</h3>
              <div className="table-responsive-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descripción / Nombre del Material</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-right">Precio Unitario</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeOrder.items?.map((item) => (
                      <tr key={item.id}>
                        <td><code>{item.sku || `P-${item.id.slice(-4).toUpperCase()}`}</code></td>
                        <td>
                          <strong>{item.name}</strong>
                          <span className="item-sub-meta">Marca: {item.brand} | Categoría: {item.category}</span>
                        </td>
                        <td className="text-center font-bold">{item.qty} uds</td>
                        <td className="text-right">{money(item.offerPrice || item.price)}</td>
                        <td className="text-right font-bold">{money((item.offerPrice || item.price) * item.qty)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals and Admin Notes row */}
            <div className="order-footer-grid">
              {/* Left side: admin notes */}
              <div className="admin-notes-card">
                <label className="dispatch-label">
                  Notas de Administración Interna
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Escriba comentarios internos sobre el despacho (ej. coordinar entrega con Ing. Díaz, requiere montacarga, etc.)"
                  />
                </label>
                <button className="secondary save-notes-btn" onClick={handleSaveNotes}>
                  <Save size={12} /> Guardar Notas
                </button>
              </div>

              {/* Right side: totals */}
              <div className="order-totals-card">
                <div className="totals-row">
                  <span>Subtotal</span>
                  <span>{money(activeOrder.totals?.subtotal)}</span>
                </div>
                <div className="totals-row">
                  <span>ITBIS / IVA (18%)</span>
                  <span>{money(activeOrder.totals?.taxes)}</span>
                </div>
                {activeOrder.totals?.shipping > 0 ? (
                  <div className="totals-row">
                    <span>Costo de Envío</span>
                    <span>{money(activeOrder.totals?.shipping)}</span>
                  </div>
                ) : null}
                <div className="totals-row total grand-total">
                  <span>Total General</span>
                  <strong>{money(activeOrder.total)}</strong>
                </div>
                <div className="payment-method-badge">
                  <span>Método de cobro: <strong>{activeOrder.payment}</strong></span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
