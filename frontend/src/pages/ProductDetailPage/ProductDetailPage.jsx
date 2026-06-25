import React, { useState } from 'react';
import { Package, Truck, ShieldCheck, ShoppingCart, Heart } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import Rating from '../../components/Rating/Rating';
import { money, visibleProducts } from '../../utils/storage';
import './ProductDetailPage.css';

export default function ProductDetailPage({ product, store, navigate, addCart, toggleFavorite }) {
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <EmptyState 
        title="Producto no encontrado" 
        text="El producto solicitado no existe o fue ocultado." 
        action="Volver al catálogo" 
        onAction={() => navigate('/catalogo')} 
      />
    );
  }

  const related = visibleProducts(store.products || [])
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  const favorite = store.favorites?.includes(product.id);

  return (
    <main className="product-detail-page">
      <section className="detail-layout">
        <div className="product-gallery">
          <div className="main-photo-container">
            <img className="main-photo" src={product.images?.[activeImage]?.url} alt={product.name} />
          </div>
          <div className="thumb-row">
            {product.images?.map((image, index) => (
              <button 
                key={image.url} 
                className={`thumb-btn ${activeImage === index ? 'active' : ''}`} 
                onClick={() => setActiveImage(index)}
              >
                <img src={image.url} alt={image.alt || product.name} />
              </button>
            ))}
          </div>
        </div>

        <article className="detail-copy">
          <span className="eyebrow">{product.category} · {product.type}</span>
          <h1 className="detail-title">{product.name}</h1>
          <div className="detail-rating">
            <Rating value={product.rating} />
          </div>
          <p className="detail-desc">{product.description}</p>
          
          <div className="detail-price-row">
            <span className="detail-price">{money(product.offerPrice || product.price)}</span>
            {product.offerPrice ? <del className="detail-price-old">{money(product.price)}</del> : null}
          </div>

          <div className="detail-meta">
            <span><Package size={15} /> Stock {product.stock}</span>
            <span><Truck size={15} /> {product.provider}</span>
            <span><ShieldCheck size={15} /> {product.availability}</span>
          </div>

          <div className="detail-actions">
            <button className="add-cart-detail-btn" onClick={() => addCart(product)}>
              <ShoppingCart size={18} /> Agregar al carrito
            </button>
            <button className={`fav-detail-btn secondary ${favorite ? 'active' : ''}`} onClick={() => toggleFavorite(product.id)}>
              <Heart size={18} fill={favorite ? 'currentColor' : 'none'} /> Favorito
            </button>
          </div>

          <div className="technical-specs">
            <h3>Especificaciones técnicas</h3>
            <div className="spec-grid">
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-key">{key}</span>
                  <b className="spec-val">{value}</b>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="related-section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Relacionados</span>
            <h2>También se compra para esta categoría</h2>
          </div>
        </div>
        <div className="product-grid">
          {related.map((item) => (
            <ProductCard 
              key={item.id} 
              product={item} 
              store={store} 
              navigate={navigate} 
              addCart={addCart} 
              toggleFavorite={toggleFavorite} 
            />
          ))}
        </div>
      </section>
    </main>
  );
}
