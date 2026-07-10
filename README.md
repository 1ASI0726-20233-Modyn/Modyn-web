# Modyn — E-commerce de Moda

<p align="center">
  <img src="client/src/assets/logo.png" alt="Modyn Logo" height="80"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-42b883?style=for-the-badge&logo=vue.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express%205-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Pinia-3-F7D336?style=for-the-badge&logo=pinia&logoColor=black" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

---

## Descripción

Aplicación web full-stack para **Modyn** — una tienda de ropa y accesorios online. Los clientes navegan el catálogo, gestionan su carrito y wishlist, dejan reseñas y reciben notificaciones de sus pedidos; los administradores gestionan productos (con subida real de imágenes), pedidos, cupones y analítica desde un panel dedicado. Precios convertibles a más de 15 monedas en tiempo real.

---

## Vistas principales

| Vista | Ruta | Descripción |
|---|---|---|
| **Home** | `/` | Landing con productos destacados y tendencias |
| **Catálogo** | `/productos` | Explora productos con filtros de categoría, precio, color y rating |
| **Detalle de producto** | `/productos/:id` | Variantes, galería, preguntas y reseñas |
| **Carrito** | `/carrito` | Gestión de ítems con límite de cantidad por stock |
| **Checkout** | `/checkout` | Proceso de compra y aplicación de cupones |
| **Wishlist** | `/wishlist` | Lista de deseos del usuario |
| **Perfil** | `/perfil` | Datos personales, direcciones e historial de pedidos |
| **Admin — Dashboard** | `/admin` | Métricas de ventas, pedidos y productos top |
| **Admin — Productos** | `/admin/productos` | CRUD de productos con subida de imágenes |
| **Admin — Pedidos** | `/admin/pedidos` | Gestión y cambio de estado de pedidos |
| **Admin — Análisis** | `/admin/analisis` | Reportes y estadísticas de la tienda |
| **Admin — Ajustes** | `/admin/ajustes` | Configuración de tienda y notificaciones |

---

## Características

- **Selector de moneda** — precios en soles convertidos en tiempo real a 15+ monedas (USD, EUR, y monedas de Latinoamérica y Asia), con preferencia guardada por usuario.
- **Notificaciones en tiempo real** — confirmación de pedido, cambio de estado de envío y anuncios de cupones, respetando las preferencias de cada usuario.
- **Subida real de imágenes** — el admin sube archivos de producto directamente (Multer), sin depender de enlaces externos.
- **Reseñas y calificaciones** — el rating promedio de cada producto se calcula dinámicamente a partir de las reseñas reales.
- **Carrito con límites de stock** — validado en frontend y backend.
- **Diseño responsive** — adaptado a desktop, tablet y mobile en toda la tienda y el panel admin.
- **Autenticación JWT** — con roles de cliente y administrador.

---

## Tech Stack

| Tecnología | Versión | Rol |
|---|---|---|
| [Vue 3](https://vuejs.org) | 3.5 | Framework de frontend (Composition API) |
| [Vite](https://vitejs.dev) | 8 | Build tool y servidor de desarrollo |
| [Pinia](https://pinia.vuejs.org) | 3 | Manejo de estado global |
| [Vue Router](https://router.vuejs.org) | 5 | Enrutamiento del lado del cliente |
| [PrimeIcons](https://primevue.org/icons) | 7 | Librería de íconos |
| [Node.js](https://nodejs.org) | ≥22 | Runtime del backend |
| [Express](https://expressjs.com) | 5 | Framework del servidor / API REST |
| [MongoDB](https://www.mongodb.com) | — | Base de datos NoSQL |
| [Mongoose](https://mongoosejs.com) | 9 | ODM para MongoDB |
| [JSON Web Token](https://jwt.io) | 9 | Autenticación basada en tokens |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | 3 | Hash de contraseñas |
| [Multer](https://github.com/expressjs/multer) | 1.4 | Subida de archivos (imágenes de producto) |
| [Docker](https://www.docker.com) / Docker Compose | — | Contenedores para despliegue |

---

## Tabla de contenidos

- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Ejecutar el proyecto](#ejecutar-el-proyecto)
- [Levantar con Docker](#levantar-con-docker)
- [Scripts disponibles](#scripts-disponibles)
- [Usuarios de prueba](#usuarios-de-prueba)
- [Modelo de datos](#modelo-de-datos)
- [Solución de problemas](#solución-de-problemas)
- [Equipo](#equipo)
- [Guía de estilo](#guía-de-estilo)

---

## Estructura del proyecto

```
Modyn-web/
├── server/                  # Backend Express
│   ├── src/
│   │   ├── models/          # ~32 modelos Mongoose
│   │   ├── routes/          # Rutas REST agrupadas por dominio
│   │   ├── middleware/       # Auth, subida de archivos, etc.
│   │   ├── utils/            # Helpers (ej. notificaciones)
│   │   ├── database.js
│   │   └── index.js
│   ├── uploads/              # Imágenes de producto subidas
│   ├── scripts/              # Scripts de mantenimiento (ej. recalcular ratings)
│   └── package.json
├── client/                  # Frontend Vue
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # Componentes reutilizables (navbar, footer, admin, etc.)
│   │   ├── views/            # Vistas por ruta (catálogo, admin, auth, etc.)
│   │   ├── router/
│   │   ├── stores/           # Pinia (auth, carrito, wishlist, moneda...)
│   │   └── services/         # Cliente HTTP hacia la API
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Requisitos previos

- Node.js `^22.18.0` o `>=24.12.0`
- npm
- Una instancia de MongoDB (local, Docker o MongoDB Atlas)
- Docker y Docker Compose (opcional, para despliegue con contenedores)

## Instalación

```bash
git clone https://github.com/1ASI0726-20233-Modyn/Modyn-web.git
cd Modyn-web

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

> El proyecto usa [PrimeIcons](https://primevue.org/icons/) para los íconos de la interfaz. Ya está declarado en `client/package.json`, así que `npm install` lo instala junto con el resto.
>
> Cada vez que hagas `git pull` y el `package.json` de alguna carpeta haya cambiado, vuelve a correr `npm install` en esa carpeta antes de `npm run dev`.

## Variables de entorno

Crea un archivo `.env` dentro de `server/` con las siguientes claves:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/modyn_db
JWT_SECRET=coloca-un-secreto-largo-y-aleatorio-aqui
PORT=3000
CLIENT_URL=http://localhost:5173
```

Y un `.env` dentro de `client/` (opcional, si el backend no corre en `localhost:3000`):

```env
VITE_API_URL=http://localhost:3000
```

> No subas nunca el `.env` con credenciales reales al repositorio. Usa un `JWT_SECRET` distinto y robusto en cada entorno (desarrollo, producción).

## Ejecutar el proyecto

**Backend**
```bash
cd server
npm run dev
```
Corre en `http://localhost:3000`

**Frontend**
```bash
cd client
npm run dev
```
Corre en `http://localhost:5173`

## Levantar con Docker

```bash
# Construir y levantar contenedores
docker-compose up --build -d

# Ver contenedores corriendo
docker ps

# Detener
docker-compose down
```

| Contenedor      | Descripción     | Puerto |
|-----------------|-----------------|--------|
| `modyn_webapp`  | API Express     | 5000   |
| `modyn_db`      | MongoDB         | 27018  |

**Desarrollo local sin levantar todo el stack en Docker:**
```bash
docker start modyn_db     # solo la base de datos
cd server && npm run dev  # backend
cd client && npm run dev  # frontend
```

## Scripts disponibles

**server/**
| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor con recarga automática (nodemon) |
| `npm start` | Inicia el servidor en modo producción |
| `npm run recalcular-ratings` | Recalcula `PRO_rating_avg` / `PRO_total_reviews` de todos los productos a partir de las reseñas reales |

**client/**
| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Compila para producción |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Corre oxlint + eslint con auto-fix |
| `npm run format` | Formatea el código con Prettier |

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Admin | `admin@modyn.com` | `admin123` |
| Cliente | `sofia@gmail.com` | `sofia123` |

> Estas credenciales son solo para el entorno de desarrollo/demo. Cámbialas o elimínalas antes de un despliegue real.

## Modelo de datos

El backend define alrededor de 32 modelos Mongoose organizados por dominio, entre ellos:

- **Usuarios y sesiones:** `User`, `Session`, `Address`
- **Catálogo:** `Product`, `ProductVariant`, `ProductImage`, `Category`, `ProductLike`, `ProductView`, `ProductQA`, `Review`, `ProductReviewImage`
- **Carrito y pedidos:** `Cart`, `CartItem`, `Order`, `OrderDetail`, `Payment`, `Shipment`, `Return`
- **Promociones:** `Coupon`, `CouponUsage`
- **Notificaciones:** `Notification`, `NotificationPreference`, `NotificationEvent`
- **Configuración y wishlist:** `Setting`, `Wishlist`, `WishlistItem`

Todos los modelos usan un identificador numérico propio (ej. `PRO_id`, `USU_id`, `ORD_id`) como clave primaria de negocio, además del `_id` interno de MongoDB.

## Solución de problemas

**Puerto 3000 ocupado (Windows)**
```bash
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

**Matar todos los procesos Node (Windows)**
```bash
taskkill /IM node.exe /F
```

**Detener el contenedor de la app**
```bash
docker stop modyn_webapp
```

**Error `Unable to resolve "primeicons/primeicons.css"` tras un `git pull`**

Tu `node_modules` está desactualizado — vuelve a instalar dependencias:
```bash
cd client
npm install
```

## Equipo

Proyecto desarrollado en equipo, dividido por módulo funcional:

| Integrante | Módulo | Vistas principales |
|---|---|---|
| Brianna | Auth, Home y Catálogo | Login, Registro, Home, Catálogo, Tendencias |
| Mathias | Compras y Detalle | Perfil, Carrito, Checkout, Detalle de producto |
| Howards | Panel Admin | Dashboard, Productos, Pedidos, Análisis |
| Luis | Admin Ajustes y Wishlist | Ajustes, Wishlist |

## Guía de estilo

Paleta de colores del proyecto (definida como variables CSS globales):

| Variable | Color | Uso |
|---|---|---|
| `--color-primary` | `#F4637A` | Rosa principal, botones |
| `--color-secondary` | `#F9A84D` | Naranja, acentos |
| `--color-accent` | `#F7C948` | Amarillo, brillos |
| `--color-bg` | `#FDF5F0` | Fondo crema |
| `--color-text` | `#3D2B2B` | Texto principal |
| `--color-bg-dark` | `#2D1B1B` | Sidebar del panel admin |

Tipografía: **Poppins** en toda la interfaz, incluyendo elementos de formulario (`button`, `input`).
