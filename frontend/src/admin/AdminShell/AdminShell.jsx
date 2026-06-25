import React, { useState } from 'react';
import { LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { adminLinks } from '../../utils/constants';
import { setAdminSession, addLog } from '../../utils/storage';
import './AdminShell.css';

const pageDescriptions = {
  '/admin/dashboard': 'Resumen ejecutivo de la tienda, análisis de ventas, balance de caja y registro de actividad reciente.',
  '/admin/productos': 'Administre el catálogo público de productos. Añada nuevos materiales o edite los existentes.',
  '/admin/pedidos': 'Monitoree pedidos de clientes, gestione los estados de envío y revise facturas electrónicas.',
  '/admin/clientes': 'Consulte la base de datos de clientes registrados, volumen de compra y detalles de contacto.',
  '/admin/proveedores': 'Gestione la red de proveedores oficiales y marcas autorizadas para distribución.',
  '/admin/inventario': 'Consulte existencias de stock, alertas críticas de reposición y realice ajustes manuales.',
  '/admin/caja': 'Auditoría del flujo de caja, balance neto de ingresos liquidados y métodos de pago.',
  '/admin/gastos': 'Controle egresos corporativos, compras de mercadería y gastos de operaciones generales.',
  '/admin/reportes': 'Reporte analítico gráfico comparativo de ingresos frente a egresos y rentabilidad.',
  '/admin/logs': 'Bitácora de seguridad del sistema y registro detallado de operaciones de usuario.'
};

export default function AdminShell({ path, navigate, session, children }) {
  const [collapsed, setCollapsed] = useState(false);

  const currentLink = adminLinks.find((link) => link.path === path);

  return (
    <div className={`admin-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-header-wrapper">
          <button className="admin-brand" onClick={() => navigate('/admin/dashboard')}>
            <span className="brand-mark admin-brand-mark">EC</span>
            {!collapsed && (
              <span className="admin-brand-text">
                <b>ElectroAdmin</b>
                <small>{session?.role || 'Administrador'}</small>
              </span>
            )}
          </button>
          <button 
            className="admin-collapse-btn" 
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expandir menú" : "Contraer menú"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="admin-side-nav">
          {adminLinks.map(({ path: itemPath, label, icon: Icon }) => {
            const isActive = path === itemPath;
            return (
              <button 
                key={itemPath} 
                className={`admin-nav-item ${isActive ? 'active' : ''}`} 
                onClick={() => navigate(itemPath)}
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="nav-icon" />
                {!collapsed && <span>{label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>
      
      <section className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-title-section">
            <span className="eyebrow">Panel de Administración</span>
            <h2>{currentLink?.label || 'Dashboard'}</h2>
            <p className="page-description-text">
              {pageDescriptions[path] || 'Gestión interna de ElectroCables Pro.'}
            </p>
          </div>
          <div className="admin-user">
            <div className="admin-user-info">
              <span className="admin-user-name">Administrador de Turno</span>
              <span className="admin-user-email">{session?.email}</span>
            </div>
            <button 
              className="secondary logout-btn" 
              onClick={() => { 
                setAdminSession(null); 
                addLog('Logout admin', 'admin'); 
                navigate('/admin/login'); 
              }}
            >
              <LogOut size={14} />
              Salir
            </button>
          </div>
        </header>
        <div className="admin-content-view">
          {children}
        </div>
      </section>
    </div>
  );
}
