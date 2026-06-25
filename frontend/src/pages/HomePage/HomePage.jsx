import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Truck, ShieldCheck, CreditCard, Boxes } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { visibleProducts } from '../../utils/storage';
import './HomePage.css';

export default function HomePage({ store, navigate, addCart, toggleFavorite }) {
  const products = visibleProducts(store.products || []);
  const featured = products.filter((product) => product.tags?.includes('Mas vendido') || product.tags?.includes('Oferta')).slice(0, 8);
  const categories = (store.categories || []).map((category) => ({
    category,
    count: products.filter((product) => product.category === category).length
  }));

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> Tienda eléctrica profesional</span>
          <h1>Compra materiales eléctricos de forma rápida y confiable.</h1>
          <p>Cables, breakers, conectores, canaletas y herramientas con stock real y simulación de compra inmediata.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate('/catalogo')}>
              Explorar catálogo <ChevronRight size={16} />
            </button>
            <button className="secondary" onClick={() => navigate('/admin/login')}>
              Entrada admin
            </button>
          </div>
          <div className="trust-row">
            <span><Truck size={14} /> Entrega local</span>
            <span><ShieldCheck size={14} /> Simulación segura</span>
            <span><CreditCard size={14} /> 3 métodos de pago</span>
          </div>
        </div>
        <div className="hero-market">
          {featured.slice(0, 4).map((product) => {
            const prodImg = product.images?.[0]?.url || '';
            return (
              <motion.button
                key={product.id}
                className="hero-tile"
                onClick={() => navigate(`/producto/${product.id}`)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
              >
                <img src={prodImg} alt={product.name} />
                <span>{product.category}</span>
                <b>{product.name}</b>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="promo-strip">
        <article className="promo-card">
          <b>Ofertas de obra</b>
          <span>Hasta 12% en cables y canalización seleccionada.</span>
        </article>
        <article className="promo-card">
          <b>Stock crítico visible</b>
          <span>Identifica productos de baja existencia antes de comprar.</span>
        </article>
        <article className="promo-card">
          <b>Admin separado</b>
          <span>Dashboard interno protegido con login local.</span>
        </article>
      </section>

      <section className="section-head">
        <div>
          <span className="eyebrow">Categorías</span>
          <h2>Encuentra rápido lo que necesita tu proyecto</h2>
        </div>
        <button className="secondary" onClick={() => navigate('/departamentos')}>Ver todo</button>
      </section>
      
      <div className="category-grid">
        {categories.map(({ category, count }) => (
          <button key={category} className="category-card" onClick={() => navigate(`/departamentos/${encodeURIComponent(category)}`)}>
            <div className="cat-icon"><Boxes size={20} /></div>
            <b>{category}</b>
            <span>{count} productos</span>
            <small>Ver departamento</small>
          </button>
        ))}
      </div>

      <section className="section-head">
        <div>
          <span className="eyebrow">Destacados</span>
          <h2>Productos con mejor salida comercial</h2>
        </div>
      </section>
      
      <div className="product-grid">
        {featured.slice(0, 4).map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            store={store} 
            navigate={navigate} 
            addCart={addCart} 
            toggleFavorite={toggleFavorite} 
          />
        ))}
      </div>
    </main>
  );
}
