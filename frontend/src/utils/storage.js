import { initialStore } from '../data/seed';

const KEY = 'electrocables-store-v2';
const OLD_KEY = 'electrocables-store-v1';
const THEME_KEY = 'electrocables-theme';
const ADMIN_KEY = 'electrocables-admin-session';
const CUSTOMER_KEY = 'electrocables-customer-session';

const cloneInitial = () => JSON.parse(JSON.stringify(initialStore));

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
    return { ...cloneInitial(), ...JSON.parse(localStorage.getItem(KEY) || '{}') };
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
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP', maximumFractionDigits: 0 }).format(value || 0);
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
