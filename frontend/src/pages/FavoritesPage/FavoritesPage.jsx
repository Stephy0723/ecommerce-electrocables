import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import './FavoritesPage.css';

export default function FavoritesPage({ store, navigate, addCart, toggleFavorite, showToast }) {
  const favorites = (store.products || []).filter((product) => store.favorites?.includes(product.id));

  if (!favorites.length) {
    return (
      <EmptyState 
        title="Aún no tienes favoritos" 
        text="Guarda productos para compararlos o moverlos rápido al carrito." 
        action="Explorar catálogo" 
        onAction={() => navigate('/catalogo')} 
      />
    );
  }

  return (
    <main className="favorites-page">
      <div className="section-head tight">
        <div>
          <span className="eyebrow">{favorites.length} guardados</span>
          <h1>Mis Productos Favoritos</h1>
        </div>
      </div>
      <div className="product-grid">
        {favorites.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            store={store}
            navigate={navigate}
            addCart={(item) => {
              addCart(item);
              showToast('Favorito agregado al carrito');
            }}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </main>
  );
}
