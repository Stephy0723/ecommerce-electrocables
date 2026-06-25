import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import Rating from '../Rating/Rating';
import { money } from '../../utils/storage';
import './ProductCard.css';

export default function ProductCard({ product, store, navigate, addCart, toggleFavorite }) {
  const favorite = store.favorites?.includes(product.id);
  const mainImage = product.images?.[0] || { url: '', alt: product.name };

  return (
    <motion.article 
      className="product-card" 
      whileHover={{ y: -6 }} 
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <button 
        className={`favorite-btn ${favorite ? 'active' : ''}`} 
        onClick={() => toggleFavorite(product.id)} 
        aria-label="Favorito"
      >
        <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
      </button>

      <button className="product-image-container" onClick={() => navigate(`/producto/${product.id}`)}>
        <img src={mainImage.url} alt={mainImage.alt || product.name} className="product-image" loading="lazy" />
      </button>

      <div className="product-info">
        <div className="product-tags">
          {product.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="product-tag">{tag}</span>
          ))}
        </div>
        
        <button className="product-name-link" onClick={() => navigate(`/producto/${product.id}`)}>
          {product.name}
        </button>
        
        <p className="product-meta">{product.brand} · {product.provider}</p>
        
        <Rating value={product.rating} />
        
        <div className="product-price-row">
          <span className="product-price">{money(product.offerPrice || product.price)}</span>
          {product.offerPrice ? <del className="product-price-old">{money(product.price)}</del> : null}
        </div>
        
        <div className="product-stock-status">
          <span className={`stock-indicator ${product.stock <= 15 ? 'low' : ''}`}>
            {product.availability} · {product.stock} uds
          </span>
        </div>
        
        <div className="product-actions-btn">
          <button className="add-cart-btn" onClick={() => addCart(product)}>
            <ShoppingCart size={15} />
            Agregar
          </button>
          <button className="view-btn secondary" onClick={() => navigate(`/producto/${product.id}`)}>
            <Eye size={15} />
            Ver
          </button>
        </div>
      </div>
    </motion.article>
  );
}
