# ElectroCables Pro - E-commerce profesional

Proyecto dividido desde el inicio en dos carpetas independientes:

```txt
ecommerce-electrocables/
├── frontend/   # React + Vite, funciona 100% con LocalStorage
└── backend/    # Node.js + Express preparado, todavía NO conectado al frontend
```

## Frontend

Incluye tienda tipo marketplace enfocada en electro cables y materiales eléctricos:

- Home profesional.
- Catálogo con buscador y filtros.
- Detalle de producto con varias imágenes y links.
- Carrito funcional.
- Checkout simulado.
- Favoritos.
- Historial de pedidos.
- Perfil de cliente.
- Panel admin funcional usando LocalStorage.
- Gestión de productos, clientes, proveedores, pedidos, caja, ingresos, gastos y logs.
- Tema claro, oscuro y blanco/negro.
- Animaciones suaves con Framer Motion.
- Diseño responsive.

### Ejecutar frontend

```bash
cd frontend
npm install
npm run dev
```

Abrir la URL que indique Vite, normalmente:

```txt
http://localhost:5173
```

## Backend

Backend profesional preparado con Node.js + Express.

Incluye:

- `server.js` y `app.js`.
- Configuración de entorno.
- Rutas CRUD preparadas.
- Controladores.
- Modelos mock preparados.
- Middlewares de auth/roles/error.
- Validaciones base.
- Servicios.
- Utils.
- Configuración de base de datos preparada.
- Endpoints para módulos de tienda.

Módulos preparados:

- Auth
- Usuarios
- Clientes
- Productos
- Categorías
- Proveedores
- Inventario
- Pedidos
- Pagos
- Caja
- Ingresos
- Gastos
- Reportes
- Logs
- Configuración de tienda

### Ejecutar backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API preparada en:

```txt
http://localhost:4000
```

Ejemplos de endpoints:

```txt
GET  /api/products
POST /api/products
GET  /api/orders
POST /api/auth/login
GET  /api/reports
```

## Importante

El frontend NO consume el backend todavía.
El backend NO depende de una base de datos real todavía.
Más adelante se puede conectar MongoDB o PostgreSQL en `backend/src/config/database.js`.
