import React, { useMemo } from 'react';
import { Boxes, ChevronRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import { visibleProducts } from '../../utils/storage';
import './DepartmentsPage.css';

const descriptions = {
  Cables: 'Conductores, rollos y acometidas para instalaciones residenciales, comerciales e industriales.',
  Breakers: 'Proteccion electrica para circuitos, tableros y equipos de mayor demanda.',
  Tomacorrientes: 'Dispositivos de conexion para terminaciones limpias y seguras.',
  Interruptores: 'Controles de encendido para instalaciones interiores y remodelaciones.',
  Canaletas: 'Soluciones para ordenar, proteger y distribuir cableado visible.',
  Conectores: 'Accesorios, cajas, empalmes y consumibles para montaje electrico.',
  Tuberias: 'Canalizacion PVC y EMT para obras, muros, techos y pisos.',
  Herramientas: 'Equipos de medicion, corte y trabajo profesional para electricistas.',
  Extensiones: 'Extensiones y alimentacion portatil para talleres, obra y uso industrial.'
};

export default function DepartmentsPage({ store, navigate, addCart, toggleFavorite, department }) {
  const products = visibleProducts(store.products || []);
  const normalizedDepartment = department ? decodeURIComponent(department) : '';

  const departments = useMemo(() => {
    return (store.categories || []).map((category) => {
      const items = products.filter((product) => product.category === category);
      return {
        category,
        description: descriptions[category] || 'Productos seleccionados para este departamento.',
        items,
        featured: items.slice(0, 4)
      };
    }).filter((item) => item.items.length);
  }, [store.categories, products]);

  const activeDepartment = departments.find((item) => item.category === normalizedDepartment);

  if (normalizedDepartment && !activeDepartment) {
    return (
      <EmptyState
        title="Departamento no encontrado"
        text="Ese departamento no existe o no tiene productos disponibles."
        action="Ver departamentos"
        onAction={() => navigate('/departamentos')}
      />
    );
  }

  if (activeDepartment) {
    return (
      <main className="departments-page">
        <section className="department-hero">
          <div className="department-icon"><Boxes size={28} /></div>
          <div>
            <span className="eyebrow">Departamento</span>
            <h1>{activeDepartment.category}</h1>
            <p>{activeDepartment.description}</p>
          </div>
          <button className="secondary" onClick={() => navigate('/departamentos')}>Todos los departamentos</button>
        </section>

        <div className="department-summary-row">
          <span>{activeDepartment.items.length} productos disponibles</span>
          <button className="secondary" onClick={() => navigate('/catalogo')}>Abrir catalogo completo</button>
        </div>

        <div className="product-grid">
          {activeDepartment.items.map((product) => (
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

  return (
    <main className="departments-page">
      <section className="section-head department-main-head">
        <div>
          <span className="eyebrow">Departamentos</span>
          <h1>Compra por area de trabajo</h1>
          <p>Elige un departamento y revisa las cartas de productos disponibles para ese tipo de material.</p>
        </div>
      </section>

      <div className="departments-list">
        {departments.map(({ category, description, items, featured }) => (
          <section className="department-section" key={category}>
            <div className="department-section-head">
              <div>
                <span className="eyebrow">{items.length} productos</span>
                <h2>{category}</h2>
                <p>{description}</p>
              </div>
              <button className="secondary" onClick={() => navigate(`/departamentos/${encodeURIComponent(category)}`)}>
                Ver departamento <ChevronRight size={16} />
              </button>
            </div>
            <div className="department-card-row">
              {featured.map((product) => (
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
          </section>
        ))}
      </div>
    </main>
  );
}
