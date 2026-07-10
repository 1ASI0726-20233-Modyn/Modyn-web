<template>
  <div class="wishlist-page">
    <div class="wishlist-header">
      <h1>Mis Favoritos</h1>
      <p>Los productos que más te han enamorado.</p>
      <span class="sparkle s1">✦</span>
      <span class="sparkle s2">✦</span>
    </div>

    <div class="wishlist-body">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Cargando tus favoritos...</p>
      </div>

      <div v-else-if="!productosFavoritos.length" class="wishlist-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h2>Aún no tienes favoritos</h2>
        <p>¡Explora nuestro catálogo y guarda los productos que más te gusten!</p>
        <RouterLink to="/productos" class="btn-explorar">Explorar Productos</RouterLink>
      </div>

      <div v-else class="productos-grid">
        <div
          v-for="producto in productosFavoritos"
          :key="producto.PRO_id"
          class="producto-card"
          @click="$router.push(`/productos/${producto.PRO_id}`)"
        >
          <span v-if="!producto.PRO_discount_price" class="badge badge-nuevo">NUEVO</span>
          <span v-else class="badge badge-oferta">
            OFERTA -{{ Math.round((1 - producto.PRO_discount_price / producto.PRO_price) * 100) }}%
          </span>

          <button class="btn-heart" @click.stop="toggleWishlist(producto)">♥</button>

          <div class="card-img">
            <img
              :src="
                imagenes[producto.PRO_id] ||
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'
              "
              :alt="producto.PRO_name"
            />
          </div>

          <div class="card-info">
            <span class="card-brand">{{ producto.PRO_brand }}</span>
            <h3 class="card-name">{{ producto.PRO_name }}</h3>
            <div class="card-precio">
              <span class="precio-actual"
                >{{ currency.formatear(producto.PRO_discount_price || producto.PRO_price) }}</span
              >
              <span v-if="producto.PRO_discount_price" class="precio-original"
                >{{ currency.formatear(producto.PRO_price) }}</span
              >
            </div>
            <div class="card-rating">
              <span class="stars">★ {{ producto.PRO_rating_avg || '0.0' }}</span>
              <span class="reviews">({{ producto.PRO_total_reviews || 0 }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '../../services/api'
import { useWishlistStore } from '../../stores/wishlistStore'
import { useCurrencyStore } from '../../stores/currencyStore'

const wishlist = useWishlistStore()
const currency = useCurrencyStore()
const router = useRouter()
const loading = ref(true)

const productosFavoritos = ref([])
const imagenes = ref({})

// El store de wishlist guarda los productos completos directamente en localStorage
// (wishlist.items es un array de productos, NO de { producto: ... }), así que solo
// hace falta traer las imágenes de cada uno.
const cargarFavoritos = async () => {
  loading.value = true
  try {
    const productos = (wishlist.items || []).filter((p) => p !== null && p !== undefined)

    if (productos.length === 0) {
      productosFavoritos.value = []
      return
    }

    const imagenesTemp = {}
    await Promise.all(
      productos.map(async (p) => {
        try {
          const imgs = await get(`/product-images/product/${p.PRO_id}`)
          if (imgs.length > 0) imagenesTemp[p.PRO_id] = imgs[0].IMG_url
        } catch (e) {
          console.warn(`No se pudo cargar la imagen del producto ${p.PRO_id}`)
        }
      }),
    )

    imagenes.value = imagenesTemp
    productosFavoritos.value = productos
  } catch (error) {
    console.error('Error cargando favoritos:', error)
  } finally {
    loading.value = false
  }
}

// Si el usuario agrega o quita un favorito (por ejemplo desde el catálogo en otra pestaña
// de la misma sesión, o desde el botón de corazón de esta misma vista), refrescamos la lista
watch(
  () => wishlist.items,
  (nuevosItems) => {
    productosFavoritos.value = (nuevosItems || []).filter((p) => p !== null && p !== undefined)
  },
  { deep: true },
)

const toggleWishlist = (producto) => {
  wishlist.quitar(producto.PRO_id)
}

onMounted(() => {
  cargarFavoritos()
})
</script>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  background: #fdf5f0;
  font-family: 'Poppins', sans-serif;
}

.wishlist-header {
  background: #fde8ec;
  padding: 3rem 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 2rem 2rem;
  margin: 0 1.5rem;
}

.wishlist-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #c2185b;
  margin-bottom: 0.5rem;
}

.wishlist-header p {
  color: #8a6a6a;
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.sparkle {
  position: absolute;
  color: rgba(244, 99, 122, 0.4);
  font-size: 1.5rem;
}
.s1 {
  top: 1.5rem;
  left: 3rem;
}
.s2 {
  bottom: 1.5rem;
  right: 3rem;
}

.wishlist-body {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  color: #8a6a6a;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0ddd8;
  border-top-color: #f4637a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty State */
.wishlist-empty {
  text-align: center;
  padding: 4rem 1.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(244, 99, 122, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.wishlist-empty svg {
  width: 80px;
  height: 80px;
  color: #f0ddd8;
}

.wishlist-empty h2 {
  color: #2d1b1b;
  font-size: 1.5rem;
}

.wishlist-empty p {
  color: #8a6a6a;
  max-width: 400px;
}

.btn-explorar {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: #c2185b;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-explorar:hover {
  background: #ad1457;
  transform: translateY(-2px);
}

/* Grid Productos */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.producto-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.producto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(244, 99, 122, 0.15);
}

.badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 50px;
  z-index: 1;
}

.badge-nuevo {
  background: #4caf50;
  color: white;
}
.badge-oferta {
  background: #f4637a;
  color: white;
}

.btn-heart {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  color: #f4637a;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.btn-heart:hover {
  transform: scale(1.1);
  background: #fff0f3;
}

.card-img {
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: #f5f5f5;
}

.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.producto-card:hover .card-img img {
  transform: scale(1.05);
}

.card-info {
  padding: 1rem;
}

.card-brand {
  font-size: 0.72rem;
  font-weight: 600;
  color: #8a6a6a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d1b1b;
  margin: 0.25rem 0;
}

.card-precio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.precio-actual {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f4637a;
}
.precio-original {
  font-size: 0.85rem;
  color: #aaa;
  text-decoration: line-through;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.stars {
  color: #f9a84d;
  font-size: 0.85rem;
  font-weight: 600;
}
.reviews {
  font-size: 0.8rem;
  color: #8a6a6a;
}
</style>
