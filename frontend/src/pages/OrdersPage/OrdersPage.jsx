import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Phone, 
  MapPin, 
  CreditCard, 
  Package, 
  CheckCircle2, 
  Navigation, 
  ChevronRight, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  Info,
  ChevronLeft,
  Star,
  Plus,
  Printer,
  RotateCcw
} from 'lucide-react';
import { money, visibleProducts } from '../../utils/storage';
import EmptyState from '../../components/EmptyState/EmptyState';
import './OrdersPage.css';

export default function OrdersPage({ store, navigate, addCart, showToast }) {
  const orders = store.orders || [];
  const [selectedId, setSelectedId] = useState(orders[0]?.id || null);

  const activeOrder = useMemo(() => {
    if (!orders.length) return null;
    return orders.find((o) => o.id === selectedId) || orders[0];
  }, [orders, selectedId]);

  const recommendedProducts = useMemo(() => {
    const allProducts = visibleProducts(store.products || []);
    if (!activeOrder || !activeOrder.items?.length) return allProducts.slice(0, 8);
    
    const orderedIds = activeOrder.items.map((item) => item.id);
    const category = activeOrder.items[0].category;
    
    // Recommendations from the same category
    let recs = allProducts.filter((p) => p.category === category && !orderedIds.includes(p.id));
    
    // If not enough, backfill with others
    if (recs.length < 4) {
      const backfill = allProducts.filter((p) => p.category !== category && !orderedIds.includes(p.id));
      recs = [...recs, ...backfill];
    }
    return recs.slice(0, 8);
  }, [store.products, activeOrder]);

  const getEstimatedDelivery = (orderDateStr) => {
    const orderDate = new Date(orderDateStr);
    
    // Deliver next day
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 1);
    
    // In Spanish
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dayFormatted = deliveryDate.toLocaleDateString('es-EC', options);
    
    return {
      day: dayFormatted.charAt(0).toUpperCase() + dayFormatted.slice(1),
      time: '13:00 - 16:30 (Hora Estimada)'
    };
  };

  const handleAddCart = (product) => {
    addCart(product);
    showToast(`${product.name} agregado al carrito`);
  };

  const getTrackingSteps = (order) => {
    const normalized = order?.status?.toLowerCase() || 'procesado';
    const delivered = normalized.includes('entregado');
    const cancelled = normalized.includes('cancel');
    const paid = order?.payment !== 'Pago contra entrega';
    const pickup = order?.delivery?.toLowerCase().includes('recoger');

    const steps = [
      { key: 'confirmed', title: 'Confirmado', text: 'Pedido recibido', icon: CheckCircle2 },
      { key: 'payment', title: paid ? 'Pago validado' : 'Pago pendiente', text: paid ? order.payment : 'Se paga al recibir', icon: CreditCard },
      { key: 'preparing', title: 'Preparando', text: 'Bodega central', icon: Package },
      { key: 'shipping', title: pickup ? 'Listo para retiro' : 'En transito', text: pickup ? 'Almacen central' : 'Camino a destino', icon: pickup ? ShoppingBag : Truck },
      { key: 'delivered', title: 'Entregado', text: 'Pedido cerrado', icon: CheckCircle2 }
    ];

    let current = delivered ? 5 : 4;
    if (cancelled) current = 2;
    if (normalized.includes('pendiente')) current = 2;
    return { steps, current, cancelled };
  };

  const repeatOrder = () => {
    activeOrder.items?.forEach((item) => addCart(item));
    showToast('Productos del pedido agregados al carrito');
  };

  const printOrder = () => {
    window.print();
  };

  if (!orders.length) {
    return (
      <EmptyState 
        title="No tienes pedidos registrados" 
        text="Tus compras confirmadas aparecerán en esta sección con seguimiento en tiempo real." 
        action="Ir al catálogo" 
        onAction={() => navigate('/catalogo')} 
      />
    );
  }

  const deliveryEst = activeOrder ? getEstimatedDelivery(activeOrder.date) : null;
  const isDelivery = activeOrder?.delivery?.toLowerCase().includes('domicilio') || activeOrder?.delivery?.toLowerCase().includes('obra');
  const tracking = activeOrder ? getTrackingSteps(activeOrder) : null;

  return (
    <main className="orders-page-layout">
      <div className="section-head tight">
        <div>
          <span className="eyebrow">Seguimiento</span>
          <h1>Seguimiento de mis Pedidos</h1>
        </div>
      </div>

      <div className="orders-split-pane">
        {/* LEFT COLUMN: LIST OF ORDERS */}
        <aside className="orders-sidebar-list">
          <h2 className="pane-subtitle">Mis Órdenes ({orders.length})</h2>
          <div className="order-cards-container">
            {orders.map((order) => {
              const isActive = order.id === activeOrder?.id;
              const dateObj = new Date(order.date);
              const dateFormatted = dateObj.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' });
              return (
                <button 
                  key={order.id} 
                  className={`order-list-card ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedId(order.id)}
                >
                  <div className="order-card-meta">
                    <span className="order-card-code">{order.id}</span>
                    <span className="order-card-date">{dateFormatted}</span>
                  </div>
                  <div className="order-card-summary">
                    <span className="order-card-items-count">
                      {order.items?.length} {order.items?.length === 1 ? 'artículo' : 'artículos'}
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

        {/* RIGHT COLUMN: DETAILED ORDER TRACKING PANEL */}
        {activeOrder && (
          <section className="order-detail-panel animate-fade">
            {/* Header Details */}
            <div className="order-detail-header">
              <div>
                <span className="order-detail-tag">Detalles del Pedido</span>
                <h2>Orden {activeOrder.id}</h2>
                <p className="order-date-full">
                  Realizado el {new Date(activeOrder.date).toLocaleString('es-EC')}
                </p>
              </div>
              <div className="order-detail-status-box">
                <span className={`status-badge status-${activeOrder.status?.toLowerCase() || 'pendiente'}`}>
                  {activeOrder.status}
                </span>
              </div>
            </div>

            <div className="order-action-strip no-print">
              <button className="secondary" onClick={repeatOrder}>
                <RotateCcw size={15} /> Repetir compra
              </button>
              <button className="secondary" onClick={printOrder}>
                <Printer size={15} /> Imprimir pedido
              </button>
              <button className="primary-btn" onClick={() => navigate('/catalogo')}>
                Comprar mas
              </button>
            </div>

            {/* Delivery / Shipping details */}
            {isDelivery && (
              <div className="order-delivery-grid">
                <div className="delivery-card">
                  <div className="delivery-card-icon"><Calendar size={18} /></div>
                  <div className="delivery-card-content">
                    <span>Fecha Programada de Entrega</span>
                    <strong>{deliveryEst?.day}</strong>
                  </div>
                </div>
                <div className="delivery-card">
                  <div className="delivery-card-icon"><Clock size={18} /></div>
                  <div className="delivery-card-content">
                    <span>Horario de Entrega</span>
                    <strong>{deliveryEst?.time}</strong>
                  </div>
                </div>
                <div className="delivery-card">
                  <div className="delivery-card-icon"><Phone size={18} /></div>
                  <div className="delivery-card-content">
                    <span>Teléfono de Contacto</span>
                    <strong>{activeOrder.customer?.phone}</strong>
                  </div>
                </div>
                <div className="delivery-card col-span-2">
                  <div className="delivery-card-icon"><MapPin size={18} /></div>
                  <div className="delivery-card-content">
                    <span>Dirección de Despacho</span>
                    <strong>{activeOrder.customer?.address}, {activeOrder.customer?.city}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Progress */}
            <div className="tracking-timeline-box">
              <h3 className="tracking-section-title">Estado del Despacho</h3>
              <div className="timeline-container">
                <div className="timeline-line">
                  <div className={`timeline-progress-fill step-${tracking?.current || 1}`} />
                </div>

                {tracking?.steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const position = index + 1;
                  const state = position < tracking.current ? 'completed' : position === tracking.current ? 'active' : 'pending';
                  return (
                    <div className={`timeline-step ${state}`} key={step.key}>
                      <div className="step-circle">
                        <StepIcon size={16} className={state === 'active' && step.key === 'shipping' ? 'truck-pulse-icon' : ''} />
                      </div>
                      <div className="step-content">
                        <b>{step.title}</b>
                        <span>{step.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {tracking?.cancelled ? <p className="tracking-warning">Este pedido fue cancelado y no continuara el despacho.</p> : null}
            </div>

            {/* Simulated Live Tracking Map */}
            {isDelivery && activeOrder.status !== 'Entregado' && (
              <div className="simulated-tracker-card">
                <div className="tracker-header">
                  <Navigation size={16} className="navigation-pulse" />
                  <span>Monitoreo de Reparto en Vivo (Simulado)</span>
                </div>
                <div className="simulated-map-container">
                  <div className="map-grid-lines" />
                  <div className="map-road-line" />
                  <div className="map-marker origin" title="Bodega Central">
                    <span>Bodega</span>
                  </div>
                  <div className="map-truck-icon animate-truck">
                    <Truck size={18} />
                  </div>
                  <div className="map-marker destination" title="Tu Dirección">
                    <span>Destino</span>
                  </div>
                </div>
                <div className="tracker-driver-details">
                  <Info size={16} className="text-electric" />
                  <div className="driver-desc">
                    <b>Transportista asignado: Carlos Mendoza | Cel: +593 99 821 7384</b>
                    <p>Vehículo: Toyota Hilux Doble Cabina (Placa: GPX-921). Unidad en tránsito por Av. de las Américas, Guayaquil.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items list */}
            <div className="order-items-list-box">
              <h3 className="tracking-section-title">Productos en este pedido</h3>
              <div className="order-items-rows">
                {activeOrder.items?.map((item) => {
                  const imgUrl = item.images?.[0]?.url || '';
                  return (
                    <div key={item.id} className="order-item-row">
                      <img src={imgUrl} alt={item.name} className="order-item-img" />
                      <div className="order-item-info">
                        <b>{item.name}</b>
                        <span>Marca: {item.brand} | Categoría: {item.category}</span>
                      </div>
                      <div className="order-item-calculation">
                        <span>{item.qty} x {money(item.offerPrice || item.price)}</span>
                        <strong>{money((item.offerPrice || item.price) * item.qty)}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals Section */}
            <div className="order-totals-summary-box">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{money(activeOrder.totals?.subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Impuestos / ITBIS (18%)</span>
                <span>{money(activeOrder.totals?.taxes)}</span>
              </div>
              {activeOrder.totals?.shipping > 0 ? (
                <div className="summary-row">
                  <span>Envío</span>
                  <span>{money(activeOrder.totals?.shipping)}</span>
                </div>
              ) : null}
              <div className="summary-row total-row">
                <span>Total pagado</span>
                <strong>{money(activeOrder.total)}</strong>
              </div>
              <div className="payment-method-indicator">
                <CreditCard size={14} />
                <span>Pago liquidado mediante: <strong>{activeOrder.payment}</strong></span>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* RECOMMENDED PRODUCTS CAROUSEL */}
      {recommendedProducts.length > 0 && (
        <section className="recommendations-section">
          <div className="recommendations-header">
            <h2>Productos que te podrían interesar</h2>
            <p>Complementa tu obra con estos materiales relacionados con lo que has comprado</p>
          </div>
          
          <div className="recommendations-carousel-container">
            <div className="recommendations-carousel">
              {recommendedProducts.map((product) => {
                const img = product.images?.[0]?.url || '';
                const finalPrice = product.offerPrice || product.price;
                return (
                  <article key={product.id} className="recommended-card">
                    <div className="rec-img-container" onClick={() => navigate(`/producto/${product.id}`)}>
                      <img src={img} alt={product.name} />
                    </div>
                    <div className="rec-body">
                      <span className="rec-brand">{product.brand}</span>
                      <b className="rec-title" onClick={() => navigate(`/producto/${product.id}`)}>{product.name}</b>
                      
                      <div className="rec-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < 4 ? "#eab308" : "none"} color="#eab308" />
                        ))}
                        <span>(4.0)</span>
                      </div>

                      <div className="rec-footer">
                        <strong className="rec-price">{money(finalPrice)}</strong>
                        <button 
                          className="rec-add-btn" 
                          onClick={() => handleAddCart(product)}
                          title="Añadir rápido al carrito"
                        >
                          <Plus size={14} /> Agregar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
