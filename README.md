# Modyn E-commerce — Fullstack

## Tecnologías

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcryptjs
- Docker + Docker Compose

### Frontend
- Vue 3 + Vite
- Pinia (estado global)
- Vue Router (navegación)

---

## Estructura del proyecto

Modyn-web/

├── server/    ← Backend Express

│   ├── src/

│   │   ├── models/         ← 32 modelos MongoDB

│   │   ├── routes/         ← 32 rutas CRUD

│   │   ├── index.js

│   │   └── database.js

│   ├── package.json

│   ├── .env

│   └── Dockerfile

├── client/                 ← Frontend Vue

│   ├── src/

│   │   ├── assets/

│   │   ├── components/

│   │   ├── views/

│   │   ├── router/

│   │   ├── stores/

│   │   └── services/

│   └── package.json

├── docker-compose.yml

└── README.md

---

## Instalación

### Clonar el repositorio
git clone https://github.com/1ASI0726-20233-Modyn/Modyn-web.git
cd Modyn-web

### Instalar dependencias del backend
cd server
npm install

### Instalar dependencias del frontend
cd client
npm install

---

## Correr el proyecto

### Backend
cd server
npm run dev
Corre en: http://localhost:3000

### Frontend
cd client
npm run dev
Corre en: http://localhost:5173

---

## Levantar con Docker

### Construir y levantar los contenedores
docker-compose up --build -d

### Ver contenedores corriendo
docker ps

### Detener los contenedores
docker-compose down

---

## Desarrollo local (sin Docker)

### 1. Levantar solo la base de datos
docker start modyn_db

### 2. Correr el servidor
cd server
npm run dev

### 3. Correr el frontend
cd client
npm run dev

---

## Variables de entorno

Crea un archivo `.env` dentro de `server/`:
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/modyn_db
JWT_SECRET=modyn-secret-2026
PORT=3000

---

## Solución de errores

### Puerto 3000 ocupado
netstat -ano | findstr :3000
taskkill /PID aqui-el-pid /F

### Matar todos los procesos Node
taskkill /IM node.exe /F

### Detener contenedor de la app
docker stop modyn_webapp

---

## Contenedores

| Nombre | Descripción | Puerto |
|---|---|---|
| modyn_webapp | App Express | 5000 |
| modyn_db | MongoDB | 27018 |

---

## Acceso

| Entorno | URL |
|---|---|
| Backend local | http://localhost:3000 |
| Frontend local | http://localhost:5173 |
| MongoDB Compass | mongodb://localhost:27018 |

---

## División del equipo — Frontend

### 👤 Luis — Admin Ajustes y Wishlist
Pantallas:
- WishlistView.vue
- AdminAjustesView.vue

Tablas: wishlist, wishlist_items, products, product_images, users, settings, notification_preferences

---

### 👤 Brianna — Auth, Home y Catálogo
Pantallas:
- LoginView.vue
- RegisterView.vue
- HomeView.vue
- ProductosView.vue
- TendenciasView.vue

Componentes:
- Navbar.vue
- Footer.vue
- ProductCard.vue
- ProductFilter.vue

Tablas: users, sessions, categories, products, product_images, product_likes, product_views, notifications

---

### 👤 Mathias — Compras y Detalle
Pantallas:
- PerfilView.vue
- CarritoView.vue
- CheckoutView.vue
- ProductoDetalleView.vue

Componentes:
- CartItem.vue
- CartSummary.vue

Tablas: users, addresses, cart, cart_items, products, product_variants, coupons, coupon_usage, orders, order_detail, payments, shipments, reviews, product_review_images, product_qa

---

### 👤 Howards — Panel Admin
Pantallas:
- AdminDashboardView.vue
- AdminProductosView.vue
- AdminPedidosView.vue
- AdminAnalisisView.vue

Componentes:
- AdminSidebar.vue
- StatsCard.vue

Tablas: orders, order_detail, payments, shipments, returns, products, categories, suppliers, product_images, product_variants, users, coupons, coupon_usage

---

## Colores del proyecto

| Variable | Color | Uso |
|---|---|---|
| --color-primary | #F4637A | Rosa principal, botones |
| --color-secondary | #F9A84D | Naranja, acentos |
| --color-accent | #F7C948 | Amarillo, brillos |
| --color-bg | #FDF5F0 | Fondo crema |
| --color-text | #3D2B2B | Texto principal |
| --color-bg-dark | #2D1B1B | Sidebar admin |

---

## Flujo de trabajo Git
main          ← rama principal estable
develop       ← rama de desarrollo
feat/luis     ← rama de Luis
feat/brianna  ← rama de Brianna
feat/mathias  ← rama de Mathias
feat/howards  ← rama de Howards

Cada compañero trabaja en su rama y hace PR a develop.

---

## Tablas de la base de datos

| # | Tabla | Descripción |
|---|---|---|
| 1-29 | Colecciones originales | CRUD completo |
| 30 | settings | Configuración global de la tienda |
| 31 | notification_preferences | Preferencias de notificaciones |
| 32 | newsletter_subscribers | Suscriptores al boletín |
