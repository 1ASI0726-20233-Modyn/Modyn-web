<template>
    <div class="productos-page">

        <!-- Header -->
        <div class="productos-header">
            <h1>Catálogo de Moda</h1>
            <p>Descubre las últimas tendencias y renueva tu estilo con nuestra colección exclusiva.</p>
            <span class="sparkle s1">✦</span>
            <span class="sparkle s2">✦</span>
        </div>

        <div class="productos-body">

            <!-- Sidebar filtros -->
            <aside class="sidebar">
                <div class="filter-group">
                    <h3>Precio</h3>
                    <input type="range" v-model="precioMax" min="0" max="1000" class="range-slider" />
                    <div class="range-labels">
                        <span>$0</span>
                        <span>${{ precioMax }}+</span>
                    </div>
                </div>

                <div class="filter-group">
                    <h3>Talla</h3>
                    <div class="tallas">
                        <button
                            v-for="t in tallas"
                            :key="t"
                            @click="tallaActiva = tallaActiva === t ? null : t"
                            :class="['talla-btn', { active: tallaActiva === t }]"
                        >{{ t }}</button>
                    </div>
                </div>

                <div class="filter-group">
                    <h3>Color</h3>
                    <div class="colores">
                        <button
                            v-for="c in colores"
                            :key="c.valor"
                            @click="colorActivo = colorActivo === c.valor ? null : c.valor"
                            :class="['color-btn', { active: colorActivo === c.valor }]"
                            :style="{ background: c.hex }"
                            :title="c.valor"
                        ></button>
                    </div>
                </div>

                <div class="filter-group">
                    <h3>Valoración</h3>
                    <div class="rating-filter">
                        <button
                            v-for="r in [4, 3, 2, 1]"
                            :key="r"
                            @click="ratingMin = ratingMin === r ? 0 : r"
                            :class="['rating-btn', { active: ratingMin === r }]"
                        >
                            <span v-for="i in 5" :key="i" :class="['star', { filled: i <= r }]">★</span>
                            <span class="y-mas">& más</span>
                        </button>
                    </div>
                </div>

                <button @click="limpiarFiltros" class="btn-aplicar">LIMPIAR FILTROS</button>
            </aside>

            <!-- Contenido principal -->
            <div class="productos-main">

                <!-- Buscador -->
                <div class="search-bar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                        v-model="searchText"
                        placeholder="Buscar productos..."
                        class="search-input"
                    />
                    <button v-if="searchText" @click="searchText = ''" class="search-clear">✕</button>
                </div>

                <!-- Pills categorías + sort -->
                <div class="productos-top">
                    <div class="cat-pills">
                        <button
                            v-for="cat in categorias"
                            :key="cat.CAT_id"
                            @click="categoriaActiva = cat.CAT_id"
                            :class="['cat-pill', { active: categoriaActiva === cat.CAT_id }]"
                        >{{ cat.CAT_name }}</button>
                    </div>
                    <div class="productos-sort">
                        <span class="mostrando">Mostrando {{ productosPaginados.length }} de {{ productosFiltrados.length }}</span>
                        <select v-model="sortBy" class="sort-select">
                            <option value="relevancia">Relevancia</option>
                            <option value="precio_asc">Precio menor</option>
                            <option value="precio_desc">Precio mayor</option>
                            <option value="rating">Mejor rating</option>
                            <option value="nuevo">Más nuevo</option>
                        </select>
                    </div>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="loading">
                    <div class="loading-spinner"></div>
                    <p>Cargando productos...</p>
                </div>

                <!-- Grid productos -->
                <div v-else class="productos-grid">
                    <div
                        v-for="producto in productosPaginados"
                        :key="producto.PRO_id"
                        class="producto-card"
                        @click="$router.push(`/productos/${producto.PRO_id}`)"
                    >
                        <span v-if="!producto.PRO_discount_price" class="badge badge-nuevo">NUEVO</span>
                        <span v-else class="badge badge-oferta">
                            OFERTA -{{ Math.round((1 - producto.PRO_discount_price / producto.PRO_price) * 100) }}%
                        </span>

                        <button class="btn-heart" @click.stop="toggleWishlist(producto)">
                            {{ wishlist.esFavorito(producto.PRO_id) ? '♥' : '♡' }}
                        </button>

                        <div class="card-img">
                            <img
                                :src="imagenes[producto.PRO_id] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'"
                                :alt="producto.PRO_name"
                            />
                        </div>

                        <div class="card-info">
                            <span class="card-brand">{{ producto.PRO_brand }}</span>
                            <h3 class="card-name">{{ producto.PRO_name }}</h3>
                            <div class="card-precio">
                                <span class="precio-actual">${{ (producto.PRO_discount_price || producto.PRO_price).toFixed(2) }}</span>
                                <span v-if="producto.PRO_discount_price" class="precio-original">${{ producto.PRO_price.toFixed(2) }}</span>
                            </div>
                            <div class="card-rating">
                                <span class="stars">★ {{ producto.PRO_rating_avg }}</span>
                                <span class="reviews">({{ producto.PRO_total_reviews }})</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sin resultados -->
                <div v-if="!loading && productosFiltrados.length === 0" class="sin-resultados">
                    <p>😕 No se encontraron productos</p>
                    <button @click="limpiarFiltros" class="btn-aplicar" style="width: auto; padding: 0.5rem 1.5rem;">Limpiar filtros</button>
                </div>

                <!-- Paginación -->
                <div class="paginacion" v-if="totalPaginas > 1">
                    <button @click="paginaActual > 1 && paginaActual--" class="pag-arrow">‹</button>
                    <button
                        v-for="p in totalPaginas"
                        :key="p"
                        @click="paginaActual = p"
                        :class="['pag-dot', { active: paginaActual === p }]"
                    ></button>
                    <button @click="paginaActual < totalPaginas && paginaActual++" class="pag-arrow">›</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { get } from '../../services/api'
import { useWishlistStore } from '../../stores/wishlistStore'

const wishlist   = useWishlistStore()
const route      = useRoute()
const searchText = ref('')
const loading    = ref(true)

const productos       = ref([])
const categorias      = ref([])
const imagenes        = ref({})
const categoriaActiva = ref(0)
const precioMax       = ref(1000)
const tallaActiva     = ref(null)
const colorActivo     = ref(null)
const ratingMin       = ref(0)
const sortBy          = ref('relevancia')
const paginaActual    = ref(1)
const porPagina       = 6

const tallas = ['S', 'M', 'L', 'XL', 'XXL']

const colores = [
    { valor: 'Negro',    hex: '#1a1a1a' },
    { valor: 'Blanco',   hex: '#f0f0f0' },
    { valor: 'Rosa',     hex: '#F4637A' },
    { valor: 'Rojo',     hex: '#C2185B' },
    { valor: 'Azul',     hex: '#1976D2' },
    { valor: 'Verde',    hex: '#388E3C' },
    { valor: 'Amarillo', hex: '#F7C948' },
    { valor: 'Naranja',  hex: '#F9A84D' },
    { valor: 'Beige',    hex: '#D4B896' },
    { valor: 'Lila',     hex: '#9C27B0' }
]

const productosFiltrados = computed(() => {
    let lista = [...productos.value]

    if (searchText.value)
        lista = lista.filter(p =>
            p.PRO_name.toLowerCase().includes(searchText.value.toLowerCase()) ||
            p.PRO_brand?.toLowerCase().includes(searchText.value.toLowerCase())
        )

    if (categoriaActiva.value !== 0)
        lista = lista.filter(p => p.CAT_id === categoriaActiva.value)

    if (precioMax.value < 1000)
        lista = lista.filter(p => (p.PRO_discount_price || p.PRO_price) <= precioMax.value)

    if (colorActivo.value)
        lista = lista.filter(p =>
            p.PRO_name.toLowerCase().includes(colorActivo.value.toLowerCase()) ||
            p.PRO_description?.toLowerCase().includes(colorActivo.value.toLowerCase())
        )

    if (ratingMin.value > 0)
        lista = lista.filter(p => parseFloat(p.PRO_rating_avg) >= ratingMin.value)

    if (sortBy.value === 'precio_asc')
        lista.sort((a, b) => (a.PRO_discount_price || a.PRO_price) - (b.PRO_discount_price || b.PRO_price))
    else if (sortBy.value === 'precio_desc')
        lista.sort((a, b) => (b.PRO_discount_price || b.PRO_price) - (a.PRO_discount_price || a.PRO_price))
    else if (sortBy.value === 'rating')
        lista.sort((a, b) => b.PRO_rating_avg - a.PRO_rating_avg)
    else if (sortBy.value === 'nuevo')
        lista.sort((a, b) => b.PRO_id - a.PRO_id)

    return lista
})

const totalPaginas = computed(() => Math.ceil(productosFiltrados.value.length / porPagina))

const productosPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * porPagina
    return productosFiltrados.value.slice(inicio, inicio + porPagina)
})

watch([categoriaActiva, precioMax, tallaActiva, colorActivo, ratingMin, sortBy, searchText], () => {
    paginaActual.value = 1
})

const limpiarFiltros = () => {
    precioMax.value       = 1000
    tallaActiva.value     = null
    colorActivo.value     = null
    ratingMin.value       = 0
    categoriaActiva.value = 0
    searchText.value      = ''
    paginaActual.value    = 1
}

const toggleWishlist = (producto) => {
    if (wishlist.esFavorito(producto.PRO_id)) {
        wishlist.quitar(producto.PRO_id)
    } else {
        wishlist.agregar(producto)
    }
}

onMounted(async () => {
    loading.value = true
    try {
        const [prods, cats] = await Promise.all([
            get('/products'),
            get('/categories')
        ])
        productos.value  = prods
        categorias.value = [{ CAT_id: 0, CAT_name: 'Todos' }, ...cats]

        if (route.query.search) {
            searchText.value = route.query.search
        }

        // Cargar todas las imágenes en paralelo
        const imagenesTemp = {}
        await Promise.all(
            prods.map(async (p) => {
                try {
                    const imgs = await get(`/product-images/product/${p.PRO_id}`)
                    if (imgs.length > 0) imagenesTemp[p.PRO_id] = imgs[0].IMG_url
                } catch (e) {}
            })
        )
        imagenes.value = imagenesTemp
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.productos-page {
    min-height: 100vh;
    background: #FDF5F0;
    font-family: 'Poppins', sans-serif;
}

.productos-header {
    background: #FDE8EC;
    padding: 3rem 1.5rem;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-radius: 0 0 2rem 2rem;
    margin: 0 1.5rem;
}

.productos-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #C2185B;
    margin-bottom: 0.5rem;
}

.productos-header p {
    color: #8A6A6A;
    font-size: 1rem;
    max-width: 500px;
    margin: 0 auto;
}

.sparkle {
    position: absolute;
    color: rgba(244, 99, 122, 0.4);
    font-size: 1.5rem;
}

.s1 { top: 1.5rem; left: 3rem; }
.s2 { bottom: 1.5rem; right: 3rem; }

.productos-body {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1.5rem;
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 2rem;
    align-items: start;
}

.sidebar {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(244, 99, 122, 0.08);
    position: sticky;
    top: 80px;
}

.filter-group {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #F0DDD8;
}

.filter-group:last-of-type { border-bottom: none; }

.filter-group h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #2D1B1B;
    margin-bottom: 0.75rem;
}

.range-slider {
    width: 100%;
    accent-color: #F4637A;
}

.range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #8A6A6A;
    margin-top: 0.25rem;
}

.tallas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.talla-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.5px solid #E0D0D0;
    background: white;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Poppins', sans-serif;
}

.talla-btn:hover { border-color: #F4637A; color: #F4637A; }
.talla-btn.active { background: #2D1B1B; border-color: #2D1B1B; color: white; }

.colores {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.color-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}

.color-btn.active {
    border-color: #F4637A;
    transform: scale(1.2);
}

.rating-filter {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.rating-btn {
    background: none;
    border: 1.5px solid transparent;
    cursor: pointer;
    font-size: 0.85rem;
    text-align: left;
    padding: 0.4rem 0.6rem;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.2rem;
    width: 100%;
}

.rating-btn:hover { border-color: #F9A84D; }
.rating-btn.active { border-color: #F9A84D; background: #FFF8EC; }

.star { color: #E0D0D0; font-size: 1rem; transition: color 0.2s; }
.star.filled { color: #F9A84D; }
.y-mas { font-size: 0.78rem; color: #8A6A6A; margin-left: 0.25rem; }

.btn-aplicar {
    width: 100%;
    padding: 0.75rem;
    background: #C2185B;
    color: white;
    border: none;
    border-radius: 50px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: all 0.2s;
    margin-top: 0.5rem;
}

.btn-aplicar:hover { background: #ad1457; }

.search-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    border: 1.5px solid #F0DDD8;
    border-radius: 50px;
    padding: 0.6rem 1rem;
    margin-bottom: 1rem;
    transition: border-color 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.search-bar:focus-within { border-color: #F4637A; }

.search-bar svg {
    width: 18px;
    height: 18px;
    color: #8A6A6A;
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;
    color: #3D2B2B;
}

.search-input::placeholder { color: #ccc; }

.search-clear {
    background: none;
    border: none;
    color: #aaa;
    cursor: pointer;
    font-size: 0.85rem;
    padding: 0;
}

.search-clear:hover { color: #F4637A; }

.productos-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    background: white;
    padding: 1rem 1.25rem;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.cat-pills {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.cat-pill {
    padding: 0.4rem 1rem;
    border-radius: 50px;
    border: 1.5px solid #E0D0D0;
    background: white;
    color: #3D2B2B;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Poppins', sans-serif;
}

.cat-pill:hover { border-color: #F4637A; color: #F4637A; }
.cat-pill.active { background: #C2185B; border-color: #C2185B; color: white; }

.productos-sort {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.mostrando {
    font-size: 0.82rem;
    color: #8A6A6A;
    white-space: nowrap;
}

.sort-select {
    padding: 0.4rem 0.75rem;
    border: 1.5px solid #E0D0D0;
    border-radius: 50px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.85rem;
    color: #3D2B2B;
    outline: none;
    cursor: pointer;
}

/* Loading */
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
    gap: 1rem;
    color: #8A6A6A;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #F0DDD8;
    border-top-color: #F4637A;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Sin resultados */
.sin-resultados {
    text-align: center;
    padding: 3rem;
    color: #8A6A6A;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.productos-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
}

.producto-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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

.badge-nuevo  { background: #4CAF50; color: white; }
.badge-oferta { background: #F4637A; color: white; }

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
    color: #F4637A;
    z-index: 1;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.2s;
}

.btn-heart:hover { transform: scale(1.1); }

.card-img {
    width: 100%;
    height: 240px;
    overflow: hidden;
    background: #F5F5F5;
}

.card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.producto-card:hover .card-img img { transform: scale(1.05); }

.card-info { padding: 1rem; }

.card-brand {
    font-size: 0.72rem;
    font-weight: 600;
    color: #8A6A6A;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.card-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #2D1B1B;
    margin: 0.25rem 0;
}

.card-precio {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
}

.precio-actual { font-size: 1.1rem; font-weight: 700; color: #F4637A; }
.precio-original { font-size: 0.85rem; color: #aaa; text-decoration: line-through; }

.card-rating { display: flex; align-items: center; gap: 0.25rem; }
.stars   { color: #F9A84D; font-size: 0.85rem; font-weight: 600; }
.reviews { font-size: 0.8rem; color: #8A6A6A; }

.paginacion {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
    padding-bottom: 2rem;
}

.pag-arrow {
    background: white;
    border: 1.5px solid #E0D0D0;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.1rem;
    color: #3D2B2B;
    transition: all 0.2s;
}

.pag-arrow:hover { border-color: #F4637A; color: #F4637A; }

.pag-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background: #E0D0D0;
    cursor: pointer;
    transition: all 0.2s;
}

.pag-dot.active {
    background: #F4637A;
    width: 24px;
    border-radius: 5px;
}
</style>