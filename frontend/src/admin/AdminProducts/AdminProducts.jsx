import React, { useState } from 'react';
import { Plus, Settings2, Eye, EyeOff, Trash2 } from 'lucide-react';
import { money, addLog } from '../../utils/storage';
import AdminPanel from '../AdminPanel/AdminPanel';
import './AdminProducts.css';

export default function AdminProducts({ store, save, showToast }) {
  const categories = store.categories || [];
  const providers = store.providers || [];

  const empty = {
    name: '',
    description: '',
    category: categories[0] || '',
    brand: '',
    provider: providers[0]?.name || '',
    price: '',
    offerPrice: '',
    stock: '',
    availability: 'Disponible',
    images: '',
    specs: '',
    type: '',
    tags: 'Nuevo'
  };

  const [form, setForm] = useState(empty);

  const createProduct = (event) => {
    event.preventDefault();
    if (!form.name || !form.brand || !form.price || !form.stock) {
      showToast('Completa nombre, marca, precio y stock', 'error');
      return;
    }
    
    const product = {
      id: crypto.randomUUID(),
      name: form.name,
      description: form.description || 'Producto eléctrico creado desde el panel administrativo.',
      category: form.category,
      brand: form.brand,
      provider: form.provider,
      price: Number(form.price),
      offerPrice: Number(form.offerPrice) || 0,
      stock: Number(form.stock),
      availability: Number(form.stock) <= 15 ? 'Stock limitado' : form.availability,
      images: form.images.split(',').map((url) => url.trim()).filter(Boolean).map((url) => ({ url, alt: form.name })),
      specs: Object.fromEntries(
        form.specs.split(',').map((item) => item.split(':').map((part) => part?.trim())).filter(([key, value]) => key && value)
      ),
      rating: 4.5,
      sold: 0,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      type: form.type || 'General',
      hidden: false,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    
    if (!product.images.length) {
      product.images = [{ url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80', alt: product.name }];
    }
    
    save({ ...store, products: [product, ...store.products] });
    addLog(`Creación de producto ${product.name}`);
    setForm(empty);
    showToast('Producto creado');
  };

  const toggleHidden = (id) => {
    const product = store.products.find((item) => item.id === id);
    save({ 
      ...store, 
      products: store.products.map((item) => item.id === id ? { ...item, hidden: !item.hidden } : item) 
    });
    addLog(`Visibilidad cambiada: ${product?.name}`);
    showToast('Visibilidad actualizada');
  };

  const editProduct = (id) => {
    const product = store.products.find((item) => item.id === id);
    const newStock = prompt('Nuevo stock', product.stock);
    const newPrice = prompt('Nuevo precio', product.price);
    if (newStock === null || newPrice === null) return;
    
    save({ 
      ...store, 
      products: store.products.map((item) => 
        item.id === id 
          ? { 
              ...item, 
              stock: Number(newStock), 
              price: Number(newPrice), 
              availability: Number(newStock) <= 15 ? 'Stock limitado' : 'Disponible' 
            } 
          : item
      ) 
    });
    addLog(`Edición de producto ${product.name}`);
    showToast('Producto actualizado');
  };

  const deleteProduct = (id) => {
    const product = store.products.find((item) => item.id === id);
    save({ ...store, products: store.products.filter((item) => item.id !== id) });
    addLog(`Eliminación de producto ${product?.name}`);
    showToast('Producto eliminado');
  };

  return (
    <div className="admin-grid-layout wide">
      <AdminPanel title="Crear producto">
        <form className="admin-product-form" onSubmit={createProduct}>
          <input 
            placeholder="Nombre" 
            value={form.name} 
            onChange={(event) => setForm({ ...form, name: event.target.value })} 
            required
          />
          <textarea 
            placeholder="Descripción comercial" 
            value={form.description} 
            onChange={(event) => setForm({ ...form, description: event.target.value })} 
          />
          <div className="form-sub-grid">
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <input 
              placeholder="Marca" 
              value={form.brand} 
              onChange={(event) => setForm({ ...form, brand: event.target.value })} 
              required
            />
            <select value={form.provider} onChange={(event) => setForm({ ...form, provider: event.target.value })}>
              {providers.map((item) => <option key={item.id}>{item.name}</option>)}
            </select>
            <input 
              placeholder="Tipo" 
              value={form.type} 
              onChange={(event) => setForm({ ...form, type: event.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Precio" 
              value={form.price} 
              onChange={(event) => setForm({ ...form, price: event.target.value })} 
              required
            />
            <input 
              type="number" 
              placeholder="Precio oferta" 
              value={form.offerPrice} 
              onChange={(event) => setForm({ ...form, offerPrice: event.target.value })} 
            />
            <input 
              type="number" 
              placeholder="Stock" 
              value={form.stock} 
              onChange={(event) => setForm({ ...form, stock: event.target.value })} 
              required
            />
            <select value={form.availability} onChange={(event) => setForm({ ...form, availability: event.target.value })}>
              <option>Disponible</option>
              <option>Stock limitado</option>
              <option>Agotado</option>
            </select>
          </div>
          <input 
            placeholder="URLs de imágenes separadas por coma" 
            value={form.images} 
            onChange={(event) => setForm({ ...form, images: event.target.value })} 
          />
          <input 
            placeholder="Especificaciones: clave:valor, clave:valor" 
            value={form.specs} 
            onChange={(event) => setForm({ ...form, specs: event.target.value })} 
          />
          <input 
            placeholder="Etiquetas separadas por coma" 
            value={form.tags} 
            onChange={(event) => setForm({ ...form, tags: event.target.value })} 
          />
          <button type="submit" className="primary-btn submit-prod-btn">
            <Plus size={16} /> Crear producto
          </button>
        </form>
      </AdminPanel>
      
      <AdminPanel title="Gestión de productos">
        <div className="admin-table-list">
          {store.products?.map((product) => {
            const prodImg = product.images?.[0]?.url || '';
            return (
              <div className="admin-product-row" key={product.id}>
                <img src={prodImg} alt={product.name} className="admin-prod-img" />
                <div className="admin-prod-details">
                  <b>{product.name}</b>
                  <span>{product.category} · {product.brand}</span>
                </div>
                <strong className="admin-prod-price">{money(product.offerPrice || product.price)}</strong>
                <span className="admin-prod-stock">{product.stock} uds</span>
                <div className="admin-prod-actions">
                  <button className="admin-action-btn" onClick={() => editProduct(product.id)} title="Editar stock/precio">
                    <Settings2 size={16} />
                  </button>
                  <button className="admin-action-btn" onClick={() => toggleHidden(product.id)} title="Visibilidad">
                    {product.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button className="admin-action-btn danger-text" onClick={() => deleteProduct(product.id)} title="Eliminar">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </AdminPanel>
    </div>
  );
}
