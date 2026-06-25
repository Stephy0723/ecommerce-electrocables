import {
  Home,
  Boxes,
  ShoppingCart,
  Heart,
  ClipboardList,
  LayoutDashboard,
  Package,
  Users,
  Truck,
  WalletCards,
  Receipt,
  BarChart3,
  ShieldCheck
} from 'lucide-react';

export const adminCredentials = { email: 'admin@electrocables.com', password: 'admin123' };

export const publicLinks = [
  { path: '/', label: 'Inicio', icon: Home },
  { path: '/catalogo', label: 'Catalogo', icon: Boxes },
  { path: '/carrito', label: 'Carrito', icon: ShoppingCart },
  { path: '/favoritos', label: 'Favoritos', icon: Heart },
  { path: '/pedidos', label: 'Pedidos', icon: ClipboardList }
];

export const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/productos', label: 'Productos', icon: Package },
  { path: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
  { path: '/admin/clientes', label: 'Clientes', icon: Users },
  { path: '/admin/proveedores', label: 'Proveedores', icon: Truck },
  { path: '/admin/inventario', label: 'Inventario', icon: Boxes },
  { path: '/admin/caja', label: 'Caja', icon: WalletCards },
  { path: '/admin/gastos', label: 'Gastos', icon: Receipt },
  { path: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
  { path: '/admin/logs', label: 'Logs', icon: ShieldCheck }
];
