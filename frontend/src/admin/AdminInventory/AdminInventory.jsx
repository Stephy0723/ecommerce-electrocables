import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Edit2, 
  Check, 
  X, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert,
  ClipboardList
} from 'lucide-react';
import { money, addLog } from '../../utils/storage';
import AdminPanel from '../AdminPanel/AdminPanel';
import './AdminInventory.css';

export default function AdminInventory({ store, save, showToast }) {
  const products = store.products || [];
  
  const [editingId, setEditingId] = useState(null);
  const [tempStock, setTempStock] = useState(0);
  const [tempCost, setTempCost] = useState(0);
  const [tempPrice, setTempPrice] = useState(0);
  const [tempReorder, setTempReorder] = useState(15);
  const [tempSku, setTempSku] = useState('');

  // Calculate summary metrics
  const metrics = useMemo(() => {
    let totalStockItems = 0;
    let totalValuationAtCost = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalMarginSum = 0;
    let productsWithMargin = 0;

    products.forEach((p) => {
      const stock = p.stock || 0;
      const price = p.price || 0;
      const cost = p.cost !== undefined ? p.cost : Math.round(price * 0.7 * 100) / 100;
      const reorder = p.reorderPoint !== undefined ? p.reorderPoint : 15;

      totalStockItems += stock;
      totalValuationAtCost += cost * stock;

      if (stock === 0) {
        outOfStockCount++;
      }
      if (stock <= reorder) {
        lowStockCount++;
      }

      if (price > 0) {
        const margin = ((price - cost) / price) * 100;
        totalMarginSum += margin;
        productsWithMargin++;
      }
    });

    const avgMargin = productsWithMargin > 0 ? totalMarginSum / productsWithMargin : 0;

    return {
      totalStockItems,
      totalValuationAtCost,
      lowStockCount,
      outOfStockCount,
      avgMargin
    };
  }, [products]);

  const startEdit = (product) => {
    const defaultCost = product.cost !== undefined ? product.cost : Math.round(product.price * 0.7 * 100) / 100;
    const defaultReorder = product.reorderPoint !== undefined ? product.reorderPoint : 15;
    const defaultSku = product.sku || `ELEC-${product.id.slice(0, 5).toUpperCase()}`;

    setEditingId(product.id);
    setTempStock(product.stock);
    setTempCost(defaultCost);
    setTempPrice(product.price);
    setTempReorder(defaultReorder);
    setTempSku(defaultSku);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const qty = Number(tempStock);
    const costVal = Number(tempCost);
    const priceVal = Number(tempPrice);
    const reorderVal = Number(tempReorder);
    const skuVal = tempSku.trim();

    if (Number.isNaN(qty) || qty < 0) {
      showToast('Stock inválido (debe ser mayor o igual a 0)', 'error');
      return;
    }
    if (Number.isNaN(costVal) || costVal < 0) {
      showToast('Precio de costo inválido', 'error');
      return;
    }
    if (Number.isNaN(priceVal) || priceVal <= 0) {
      showToast('Precio de venta inválido (debe ser mayor a 0)', 'error');
      return;
    }
    if (Number.isNaN(reorderVal) || reorderVal < 0) {
      showToast('Punto de reorden inválido', 'error');
      return;
    }

    save({
      ...store,
      products: store.products.map((item) => 
        item.id === id 
          ? { 
              ...item, 
              stock: qty, 
              cost: costVal,
              price: priceVal,
              reorderPoint: reorderVal,
              sku: skuVal || `ELEC-${item.id.slice(0, 5).toUpperCase()}`,
              availability: qty === 0 ? 'Agotado' : qty <= reorderVal ? 'Stock limitado' : 'Disponible' 
            } 
          : item
      )
    });

    addLog(`Ajuste de inventario ${product.name}: SKU=${skuVal || 'N/A'}, Stock=${qty}, Costo=${costVal}, Precio=${priceVal}`);
    showToast(`Inventario de "${product.name}" actualizado`);
    setEditingId(null);
  };

  return (
    <div className="admin-inventory-wrapper">
      {/* Metrics Summary Deck */}
      <div className="inventory-metrics-grid">
        <div className="inv-metric-card">
          <ClipboardList size={20} className="text-electric" />
          <div className="inv-metric-info">
            <span>Total de Productos en Stock</span>
            <strong>{metrics.totalStockItems} unidades</strong>
            <small>{products.length} referencias en catálogo</small>
          </div>
        </div>

        <div className="inv-metric-card">
          <DollarSign size={20} className="text-success" />
          <div className="inv-metric-info">
            <span>Valoración del Inventario</span>
            <strong>{money(metrics.totalValuationAtCost)}</strong>
            <small>Valor acumulado a precio costo</small>
          </div>
        </div>

        <div className="inv-metric-card">
          <TrendingUp size={20} className="text-success" />
          <div className="inv-metric-info">
            <span>Margen de Ganancia Promedio</span>
            <strong>{metrics.avgMargin.toFixed(1)}%</strong>
            <small>Retorno estimado sobre ventas</small>
          </div>
        </div>

        <div className="inv-metric-card">
          <AlertTriangle size={20} className="text-danger" />
          <div className="inv-metric-info">
            <span>Puntos Críticos / Alertas</span>
            <strong className="text-danger">{metrics.lowStockCount} artículos</strong>
            <small>{metrics.outOfStockCount} agotados actualmente</small>
          </div>
        </div>
      </div>

      <AdminPanel title="Hoja de Inventario Analítico (Bodega)">
        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Código SKU</th>
                <th>Material Eléctrico / Nombre</th>
                <th>Proveedor</th>
                <th className="text-right">P. Costo</th>
                <th className="text-right">P. Venta</th>
                <th className="text-center">Margen %</th>
                <th className="text-center">Stock</th>
                <th className="text-center">Reorden</th>
                <th className="text-right">Val. Costo</th>
                <th className="text-center">Operaciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isEditing = product.id === editingId;
                const costPrice = product.cost !== undefined ? product.cost : Math.round(product.price * 0.7 * 100) / 100;
                const retailPrice = product.price || 0;
                const skuCode = product.sku || `ELEC-${product.id.slice(0, 5).toUpperCase()}`;
                const reorderPt = product.reorderPoint !== undefined ? product.reorderPoint : 15;
                const isLowStock = product.stock <= reorderPt;
                
                const marginPercent = retailPrice > 0 
                  ? ((retailPrice - costPrice) / retailPrice) * 100 
                  : 0;

                const valuation = costPrice * product.stock;

                return (
                  <tr key={product.id} className={isLowStock ? 'low-stock-highlight' : ''}>
                    {/* SKU */}
                    <td>
                      {isEditing ? (
                        <input 
                          type="text"
                          className="inline-sku-input"
                          value={tempSku}
                          onChange={(e) => setTempSku(e.target.value)}
                        />
                      ) : (
                        <span className="sku-badge">{skuCode}</span>
                      )}
                    </td>

                    {/* Name */}
                    <td>
                      <div className="inventory-product-cell">
                        <Box size={14} className="text-muted" />
                        <strong>{product.name}</strong>
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="muted">{product.provider || 'Distribuidor local'}</td>

                    {/* Cost Price */}
                    <td className="text-right font-bold">
                      {isEditing ? (
                        <div className="currency-input-wrapper">
                          <span className="currency-symbol">$</span>
                          <input 
                            type="number"
                            step="0.01"
                            className="inline-price-input"
                            value={tempCost}
                            onChange={(e) => setTempCost(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      ) : (
                        money(costPrice)
                      )}
                    </td>

                    {/* Retail Price */}
                    <td className="text-right font-bold">
                      {isEditing ? (
                        <div className="currency-input-wrapper">
                          <span className="currency-symbol">$</span>
                          <input 
                            type="number"
                            step="0.01"
                            className="inline-price-input"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      ) : (
                        money(retailPrice)
                      )}
                    </td>

                    {/* Profit Margin */}
                    <td className="text-center">
                      <span className={`margin-pill ${marginPercent >= 30 ? 'margin-high' : 'margin-low'}`}>
                        {marginPercent.toFixed(1)}%
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="text-center">
                      {isEditing ? (
                        <input 
                          type="number"
                          className="inline-stock-input"
                          value={tempStock}
                          onChange={(e) => setTempStock(parseInt(e.target.value, 10) || 0)}
                          min="0"
                        />
                      ) : (
                        <strong className={isLowStock ? 'text-danger' : 'text-ink'}>
                          {product.stock} uds
                        </strong>
                      )}
                    </td>

                    {/* Reorder Point */}
                    <td className="text-center">
                      {isEditing ? (
                        <input 
                          type="number"
                          className="inline-stock-input"
                          value={tempReorder}
                          onChange={(e) => setTempReorder(parseInt(e.target.value, 10) || 0)}
                          min="0"
                        />
                      ) : (
                        <span className={`reorder-badge ${isLowStock ? 'reorder-alert' : ''}`}>
                          {reorderPt} uds
                        </span>
                      )}
                    </td>

                    {/* Stock Value at Cost */}
                    <td className="text-right text-success font-bold">
                      {money(valuation)}
                    </td>

                    {/* Operations */}
                    <td className="text-center">
                      {isEditing ? (
                        <div className="inline-edit-actions">
                          <button className="save-btn" onClick={() => saveEdit(product.id)} title="Guardar cambios">
                            <Check size={14} />
                          </button>
                          <button className="cancel-btn" onClick={cancelEdit} title="Cancelar edición">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button className="secondary adjust-btn" onClick={() => startEdit(product)}>
                          <Edit2 size={13} /> Ajustar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminPanel>
    </div>
  );
}
