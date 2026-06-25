import { initialStore } from '../data/seed';

const KEY = 'electrocables-store-v2';
const OLD_KEY = 'electrocables-store-v1';
const THEME_KEY = 'electrocables-theme';
const ADMIN_KEY = 'electrocables-admin-session';
const CUSTOMER_KEY = 'electrocables-customer-session';
const CATALOG_ASSETS_VERSION = 2;

const cloneInitial = () => JSON.parse(JSON.stringify(initialStore));

const syncCatalogAssets = (store) => {
  if (store.catalogAssetsVersion === CATALOG_ASSETS_VERSION) return store;

  const seedImages = new Map(initialStore.products.map((product) => [product.id, product.images]));
  const products = (store.products || []).map((product) => {
    const images = seedImages.get(product.id);
    return images ? { ...product, images } : product;
  });

  return { ...store, products, catalogAssetsVersion: CATALOG_ASSETS_VERSION };
};

export function initStore() {
  const current = localStorage.getItem(KEY);
  if (!current) {
    localStorage.setItem(KEY, JSON.stringify(cloneInitial()));
    localStorage.removeItem(OLD_KEY);
  }
  return getStore();
}

export function getStore() {
  try {
    const store = syncCatalogAssets({ ...cloneInitial(), ...JSON.parse(localStorage.getItem(KEY) || '{}') });
    localStorage.setItem(KEY, JSON.stringify(store));
    return store;
  } catch {
    localStorage.setItem(KEY, JSON.stringify(cloneInitial()));
    return cloneInitial();
  }
}

export function setStore(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('store-updated'));
}

export function updateStore(updater) {
  const next = updater(getStore());
  setStore(next);
  return next;
}

export function addLog(action, user = 'admin') {
  updateStore((store) => ({
    ...store,
    logs: [{ id: crypto.randomUUID(), action, user, date: new Date().toISOString() }, ...(store.logs || [])]
  }));
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function setThemePreference(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function getAdminSession() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setAdminSession(session) {
  if (session) localStorage.setItem(ADMIN_KEY, JSON.stringify(session));
  else localStorage.removeItem(ADMIN_KEY);
  window.dispatchEvent(new Event('admin-session-updated'));
}

export function getCustomerSession() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setCustomerSession(session) {
  if (session) localStorage.setItem(CUSTOMER_KEY, JSON.stringify(session));
  else localStorage.removeItem(CUSTOMER_KEY);
  window.dispatchEvent(new Event('customer-session-updated'));
}

export function money(value) {
  const formatted = new Intl.NumberFormat('es-DO', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(Number(value) || 0);
  return `RD$ ${formatted} DOP`;
}

export function orderTotals(items = []) {
  const subtotal = items.reduce((sum, item) => sum + (item.offerPrice || item.price) * item.qty, 0);
  const shipping = subtotal > 8000 || subtotal === 0 ? 0 : 350;
  const taxes = Math.round(subtotal * 0.18);
  return { subtotal, shipping, taxes, total: subtotal + shipping + taxes };
}

export function visibleProducts(products = []) {
  return products.filter((product) => !product.hidden);
}
