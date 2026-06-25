import React, { useMemo, useState } from 'react';
import { Grid2X2, List, SlidersHorizontal, Tag, X } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import { visibleProducts } from '../../utils/storage';
import './CatalogPage.css';

const emptyFilters = {
  category: '',
  brand: '',
  provider: '',
  availability: '',
  type: '',
  minPrice: '',
  maxPrice: '',
  minRating: '',
  stock: '',
  offerOnly: false,
  sort: 'sold',
  view: 'grid'
};

export default function CatalogPage({ store, navigate, query, setQuery, addCart, toggleFavorite }) {
  const params = new URLSearchParams(window.location.search);
  const [filters, setFilters] = useState({
    ...emptyFilters,
    category: params.get('categoria') || ''
  });

  const catalogProducts = useMemo(() => visibleProducts(store.products || []), [store.products]);

  const priceBounds = useMemo(() => {
    const prices = catalogProducts.map((product) => product.offerPrice || product.price).filter(Boolean);
    return {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0
    };
  }, [catalogProducts]);

  const products = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = catalogProducts.filter((product) => {
      const price = product.offerPrice || product.price;
      const haystack = [product.name, product.description, product.category, product.brand, product.provider, product.type]
        .join(' ')
        .toLowerCase();
      const hasStock = product.stock > 0 && product.availability !== 'Agotado';

      return (
        (!term || haystack.includes(term)) &&
        (!filters.category || product.category === filters.category) &&
        (!filters.brand || product.brand === filters.brand) &&
        (!filters.provider || product.provider === filters.provider) &&
        (!filters.availability || product.availability === filters.availability) &&
        (!filters.type || product.type === filters.type) &&
        (!filters.minPrice || price >= Number(filters.minPrice)) &&
        (!filters.maxPrice || price <= Number(filters.maxPrice)) &&
        (!filters.minRating || product.rating >= Number(filters.minRating)) &&
        (!filters.stock || (filters.stock === 'available' ? hasStock : product.stock <= 15)) &&
        (!filters.offerOnly || Boolean(product.offerPrice))
      );
    });

    return filtered.sort((a, b) => {
      if (filters.sort === 'price-asc') return (a.offerPrice || a.price) - (b.offerPrice || b.price);
      if (filters.sort === 'price-desc') return (b.offerPrice || b.price) - (a.offerPrice || a.price);
      if (filters.sort === 'name') return a.name.localeCompare(b.name);
      if (filters.sort === 'new') return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sort === 'rating') return b.rating - a.rating;
      return b.sold - a.sold;
    });
  }, [catalogProducts, query, filters]);

  const brands = [...new Set(catalogProducts.map((product) => product.brand))].filter(Boolean);
  const types = [...new Set(catalogProducts.map((product) => product.type))].filter(Boolean);
  const availability = [...new Set(catalogProducts.map((product) => product.availability))].filter(Boolean);

  const activeFilters = [
    query ? { key: 'query', label: `Busqueda: ${query}` } : null,
    filters.category ? { key: 'category', label: filters.category } : null,
    filters.brand ? { key: 'brand', label: filters.brand } : null,
    filters.provider ? { key: 'provider', label: filters.provider } : null,
    filters.availability ? { key: 'availability', label: filters.availability } : null,
    filters.type ? { key: 'type', label: filters.type } : null,
    filters.minPrice ? { key: 'minPrice', label: `Desde RD$${filters.minPrice}` } : null,
    filters.maxPrice ? { key: 'maxPrice', label: `Hasta RD$${filters.maxPrice}` } : null,
    filters.minRating ? { key: 'minRating', label: `${filters.minRating}+ estrellas` } : null,
    filters.stock ? { key: 'stock', label: filters.stock === 'available' ? 'Con stock' : 'Stock bajo' } : null,
    filters.offerOnly ? { key: 'offerOnly', label: 'Solo ofertas' } : null
  ].filter(Boolean);

  const clearFilter = (key) => {
    if (key === 'query') {
      setQuery('');
      return;
    }
    setFilters({ ...filters, [key]: key === 'offerOnly' ? false : '' });
  };

  const resetFilters = () => {
    setQuery('');
    setFilters({ ...emptyFilters, view: filters.view });
  };

  return (
    <main className="catalog-layout">
      <section className="catalog-results">
        <div className="section-head tight">
          <div>
            <span className="eyebrow">{products.length} de {catalogProducts.length} productos</span>
            <h1>Catalogo profesional</h1>
          </div>
          <div className="catalog-toolbar">
            <button className={filters.view === 'grid' ? 'active' : ''} onClick={() => setFilters({ ...filters, view: 'grid' })} title="Vista en cuadricula">
              <Grid2X2 size={16} />
            </button>
            <button className={filters.view === 'list' ? 'active' : ''} onClick={() => setFilters({ ...filters, view: 'list' })} title="Vista en lista">
              <List size={16} />
            </button>
          </div>
        </div>

        {activeFilters.length ? (
          <div className="active-filter-chips">
            {activeFilters.map((item) => (
              <button key={item.key} onClick={() => clearFilter(item.key)}>
                <Tag size={12} />
                {item.label}
                <X size={12} />
              </button>
            ))}
          </div>
        ) : null}

        <div className={`product-grid ${filters.view === 'list' ? 'product-list-view' : ''}`}>
          {products.map((product) => (
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

        {!products.length ? (
          <EmptyState
            title="No encontramos productos"
            text="Ajusta los filtros o intenta una busqueda mas amplia."
          />
        ) : null}
      </section>

      <aside className="filters-panel">
        <div className="panel-title">
          <SlidersHorizontal size={16} />
          <b>Filtros avanzados</b>
        </div>
        <label className="filter-label">
          Buscar
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Producto, marca o tipo"
          />
        </label>
        <label className="filter-label">
          Categoria
          <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
            <option value="">Todas</option>
            {store.categories?.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="filter-label">
          Marca
          <select value={filters.brand} onChange={(event) => setFilters({ ...filters, brand: event.target.value })}>
            <option value="">Todas</option>
            {brands.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="filter-label">
          Proveedor
          <select value={filters.provider} onChange={(event) => setFilters({ ...filters, provider: event.target.value })}>
            <option value="">Todos</option>
            {store.providers?.map((item) => <option key={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="filter-label">
          Disponibilidad
          <select value={filters.availability} onChange={(event) => setFilters({ ...filters, availability: event.target.value })}>
            <option value="">Todas</option>
            {availability.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="filter-label">
          Tipo
          <select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>
            <option value="">Todos</option>
            {types.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="filter-label">
          Rango de precio (DOP)
          <div className="price-pair">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(event) => setFilters({ ...filters, minPrice: event.target.value })}
              placeholder={`Min ${priceBounds.min}`}
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })}
              placeholder={`Max ${priceBounds.max}`}
            />
          </div>
        </label>
        <label className="filter-label">
          Inventario
          <select value={filters.stock} onChange={(event) => setFilters({ ...filters, stock: event.target.value })}>
            <option value="">Todos</option>
            <option value="available">Con stock</option>
            <option value="low">Stock bajo</option>
          </select>
        </label>
        <label className="filter-label">
          Rating minimo
          <select value={filters.minRating} onChange={(event) => setFilters({ ...filters, minRating: event.target.value })}>
            <option value="">Cualquiera</option>
            <option value="4.8">4.8+</option>
            <option value="4.5">4.5+</option>
            <option value="4">4.0+</option>
          </select>
        </label>
        <label className="filter-check">
          <input
            type="checkbox"
            checked={filters.offerOnly}
            onChange={(event) => setFilters({ ...filters, offerOnly: event.target.checked })}
          />
          Solo productos en oferta
        </label>
        <label className="filter-label">
          Orden
          <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}>
            <option value="sold">Mas vendidos</option>
            <option value="new">Novedades</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="name">Nombre</option>
            <option value="rating">Mejor valorados</option>
          </select>
        </label>
        <button className="secondary clear-btn" onClick={resetFilters}>
          Limpiar filtros
        </button>
      </aside>
    </main>
  );
}
