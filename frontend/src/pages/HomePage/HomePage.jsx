import React from 'react';
import { motion } from 'framer-motion';
import {
  Boxes,
  ChevronRight,
  Clock3,
  CreditCard,
  Percent,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  Zap
} from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { money, visibleProducts } from '../../utils/storage';
import './HomePage.css';

export default function HomePage({ store, navigate, addCart, toggleFavorite }) {
  const products = visibleProducts(store.products || []);
  const offers = products
    .filter((product) => product.offerPrice && product.offerPrice < product.price)
    .sort((a, b) => ((b.price - b.offerPrice) / b.price) - ((a.price - a.offerPrice) / a.price));
  const featured = products
    .filter((product) => product.tags?.includes('Mas vendido') || product.tags?.includes('Oferta'))
    .slice(0, 8);
  const heroOffer = offers[0] || featured[0];
  const categories = (store.categories || []).map((category) => ({
    category,
    count: products.filter((product) => product.category === category).length
  }));

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> Tienda electrica profesional</span>
          <h1>Compra materiales electricos como en una tienda online real.</h1>
          <p>Ofertas, departamentos, carrito, checkout, pedidos y panel administrativo para vender cables, breakers, herramientas y consumibles.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate('/catalogo')}>
              Comprar ahora <ChevronRight size={16} />
            </button>
            <button className="secondary" onClick={() => navigate('/departamentos')}>
              Ver departamentos
            </button>
          </div>
          <div className="trust-row">
            <span><Truck size={14} /> Entrega local</span>
            <span><ShieldCheck size={14} /> Compra segura</span>
            <span><CreditCard size={14} /> 4 metodos de pago</span>
          </div>
        </div>

        <div className="hero-market ecommerce-hero-card">
          {heroOffer ? (
            <motion.article
              className="hero-deal-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="deal-ribbon"><Zap size={14} /> Oferta destacada</div>
              <button className="hero-deal-image" onClick={() => navigate(`/producto/${heroOffer.id}`)}>
                <img src={heroOffer.images?.[0]?.url || ''} alt={heroOffer.name} />
              </button>
              <div className="hero-deal-body">
                <span>{heroOffer.category} · {heroOffer.brand}</span>
                <h2>{heroOffer.name}</h2>
                <div className="hero-price-row">
                  <strong>{money(heroOffer.offerPrice || heroOffer.price)}</strong>
                  {heroOffer.offerPrice ? <del>{money(heroOffer.price)}</del> : null}
                </div>
                <button className="primary-btn" onClick={() => addCart(heroOffer)}>
                  <ShoppingCart size={16} /> Agregar al carrito
                </button>
              </div>
            </motion.article>
          ) : null}
        </div>
      </section>

      <section className="offers-section" id="ofertas">
        <div className="section-head offers-head">
          <div>
            <span className="eyebrow"><Percent size={14} /> Ofertas</span>
            <h2>Descuentos para comprar hoy</h2>
            <p>Productos rebajados, stock disponible y acceso directo al carrito.</p>
          </div>
          <button className="secondary" onClick={() => navigate('/catalogo')}>Ver catalogo</button>
        </div>

        <div className="offer-grid">
          {offers.slice(0, 4).map((product) => {
            const discount = Math.round(((product.price - product.offerPrice) / product.price) * 100);
            return (
              <article className="offer-card" key={product.id}>
                <button className="offer-image" onClick={() => navigate(`/producto/${product.id}`)}>
                  <img src={product.images?.[0]?.url || ''} alt={product.name} />
                  <span>-{discount}%</span>
                </button>
                <div className="offer-body">
                  <small>{product.category}</small>
                  <button className="offer-title" onClick={() => navigate(`/producto/${product.id}`)}>{product.name}</button>
                  <div className="offer-meta">
                    <span><Clock3 size={13} /> Oferta activa</span>
                    <span>{product.stock} uds</span>
                  </div>
                  <div className="offer-price">
                    <strong>{money(product.offerPrice)}</strong>
                    <del>{money(product.price)}</del>
                  </div>
                  <button className="primary-btn offer-cart-btn" onClick={() => addCart(product)}>
                    <ShoppingCart size={15} /> Agregar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-head">
        <div>
          <span className="eyebrow">Departamentos</span>
          <h2>Encuentra rapido lo que necesita tu proyecto</h2>
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
          <span className="eyebrow">Mas vendidos</span>
          <h2>Productos con mejor salida comercial</h2>
        </div>
        <button className="secondary" onClick={() => navigate('/catalogo')}>Ir al catalogo</button>
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
