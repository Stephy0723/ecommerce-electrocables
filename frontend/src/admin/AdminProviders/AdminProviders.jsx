import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  DollarSign, 
  ShoppingBag,
  Plus,
  Activity,
  User
} from 'lucide-react';
import { money } from '../../utils/storage';
import AdminPanel from '../AdminPanel/AdminPanel';
import EmptyState from '../../components/EmptyState/EmptyState';
import './AdminProviders.css';

export default function AdminProviders({ store, save, showToast }) {
  const providers = store.providers || [];
  const products = store.products || [];
  const expenses = store.expenses || [];
  
  const [selectedId, setSelectedId] = useState(providers[0]?.id || null);

  const activeProvider = useMemo(() => {
    if (!providers.length) return null;
    return providers.find((p) => p.id === selectedId) || providers[0];
  }, [providers, selectedId]);

  // Find products supplied by active provider
  const suppliedProducts = useMemo(() => {
    if (!activeProvider) return [];
    // We match by provider name
    return products.filter((p) => p.provider === activeProvider.name);
  }, [products, activeProvider]);

  // Find expenses related to this provider
  const providerExpenses = useMemo(() => {
    if (!activeProvider) return [];
    return expenses.filter((e) => e.provider === activeProvider.name);
  }, [expenses, activeProvider]);

  const totalExpense = useMemo(() => {
    return providerExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [providerExpenses]);

  return (
    <div className="admin-providers-layout">
      {/* Split-pane container */}
      <div className="providers-split-pane">
        
        {/* LEFT COLUMN: LIST */}
        <aside className="providers-sidebar">
          <h2 className="pane-subtitle">Proveedores ({providers.length})</h2>
          <div className="providers-cards-container">
            {providers.map((p) => {
              const isActive = p.id === activeProvider?.id;
              return (
                <button 
                  key={p.id}
                  className={`provider-list-card ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <div className="provider-card-header">
                    <Building2 size={16} />
                    <strong>{p.name}</strong>
                  </div>
                  <div className="provider-card-body">
                    <span>{p.city} · {p.phone}</span>
                    <span className={`status-pill status-${p.status?.toLowerCase() || 'activo'}`}>
                      {p.status || 'Activo'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT COLUMN: DETAILS command hub */}
        {activeProvider ? (
          <section className="provider-details-panel animate-fade">
            {/* Header */}
            <div className="provider-details-header">
              <div className="provider-title-wrapper">
                <span className="provider-tag">Ficha de Proveedor</span>
                <h2>{activeProvider.name}</h2>
                <p>Información detallada, compras realizadas y catálogo suministrado.</p>
              </div>
              <span className={`status-badge status-${activeProvider.status?.toLowerCase() || 'activo'}`}>
                {activeProvider.status}
              </span>
            </div>

            {/* General Information Card */}
            <div className="provider-info-grid">
              <div className="info-cell">
                <Building2 size={16} className="text-electric" />
                <div>
                  <span>Razón Social</span>
                  <strong>{activeProvider.name} S.A.</strong>
                </div>
              </div>
              <div className="info-cell">
                <Phone size={16} className="text-electric" />
                <div>
                  <span>Teléfono Comercial</span>
                  <strong>{activeProvider.phone}</strong>
                </div>
              </div>
              <div className="info-cell">
                <Mail size={16} className="text-electric" />
                <div>
                  <span>Correo de Contacto</span>
                  <strong>contacto@{activeProvider.name.toLowerCase().replace(/\s+/g, '')}.com</strong>
                </div>
              </div>
              <div className="info-cell">
                <MapPin size={16} className="text-electric" />
                <div>
                  <span>Ubicación / Ciudad</span>
                  <strong>{activeProvider.city}, Ecuador</strong>
                </div>
              </div>
              <div className="info-cell col-span-2">
                <FileText size={16} className="text-electric" />
                <div>
                  <span>Dirección Fiscal</span>
                  <strong>Av. de las Américas, Parque Industrial Bodega 12, {activeProvider.city}</strong>
                </div>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="provider-metrics-grid">
              <div className="prov-metric-card">
                <DollarSign size={20} className="text-danger" />
                <div className="prov-metric-info">
                  <span>Gastos / Compras Totales</span>
                  <strong>{money(totalExpense)}</strong>
                  <small>Gastos registrados en el sistema</small>
                </div>
              </div>
              <div className="prov-metric-card">
                <ShoppingBag size={20} className="text-electric" />
                <div className="prov-metric-info">
                  <span>Productos en Catálogo</span>
                  <strong>{suppliedProducts.length} artículos</strong>
                  <small>Materiales en bodega pública</small>
                </div>
              </div>
            </div>

            {/* Sub-Panel 1: Products supplied by this provider */}
            <div className="prov-sub-panel">
              <h3>Materiales Suministrados</h3>
              <div className="table-responsive-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th className="text-right">Precio</th>
                      <th className="text-center">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center empty-cell">No hay productos vinculados a este proveedor.</td>
                      </tr>
                    ) : (
                      suppliedProducts.map((prod) => (
                        <tr key={prod.id}>
                          <td><strong>{prod.name}</strong></td>
                          <td>{prod.category}</td>
                          <td className="text-right">{money(prod.offerPrice || prod.price)}</td>
                          <td className="text-center font-bold">{prod.stock} uds</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-Panel 2: Billing & Expenses with this provider */}
            <div className="prov-sub-panel">
              <h3>Historial de Facturas y Egresos</h3>
              <div className="table-responsive-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ref. Factura</th>
                      <th>Concepto</th>
                      <th>Fecha</th>
                      <th>Método de Pago</th>
                      <th className="text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerExpenses.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center empty-cell">No hay egresos registrados con este proveedor.</td>
                      </tr>
                    ) : (
                      providerExpenses.map((exp) => (
                        <tr key={exp.id}>
                          <td><span className="payment-badge">{exp.refNo || 'F-GEN'}</span></td>
                          <td>{exp.concept}</td>
                          <td className="muted">{new Date(exp.date).toLocaleDateString()}</td>
                          <td>{exp.paymentMethod || 'Efectivo'}</td>
                          <td className="text-right text-danger font-bold">-{money(exp.amount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </section>
        ) : (
          <EmptyState compact title="Seleccionar Proveedor" text="Elija un proveedor de la lista lateral para ver su perfil detallado." />
        )}
      </div>
    </div>
  );
}
