import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { publicLinks } from '../../utils/constants';
import './StoreSidebar.css';

export default function StoreSidebar({ path, navigate, store, collapsed, setCollapsed }) {
  const topCategories = store.categories?.slice(0, 6) || [];

  return (
    <aside className={`store-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-container">
          <button className="brand-logo" onClick={() => navigate('/')}>
            <span className="brand-mark">EC</span>
            {!collapsed && (
              <span className="brand-text">
                <b>ElectroCables</b>
                <small>Supply Store</small>
              </span>
            )}
          </button>
        </div>
        <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expandir barra" : "Colapsar barra"}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="side-nav">
        {publicLinks.map(({ path: itemPath, label, icon: Icon }) => (
          <button
            key={itemPath}
            className={`nav-item ${path === itemPath ? 'active' : ''}`}
            onClick={() => navigate(itemPath)}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} />
            {!collapsed && <span className="nav-label">{label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <>
          <div className="side-section animate-fade">
            <span className="section-title">Departamentos</span>
            <div className="category-links">
              {topCategories.map((category) => (
                <button
                  key={category}
                  className="cat-link"
                  onClick={() => navigate(`/departamentos/${encodeURIComponent(category)}`)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>


        </>
      )}
    </aside>
  );
}
