<template>
    <div class="home">

        <!-- HERO -->
        <section class="hero">
            <!-- Sparkles decorativos -->
            <span class="sparkle sparkle-1">✦</span>
            <span class="sparkle sparkle-2">✦</span>

            <div class="hero-inner">
                <!-- Texto -->
                <div class="hero-text">
                    <h1>Tu estilo,<br>tu mundo ✨</h1>
                    <p>Descubre las últimas tendencias de moda. Eleva tu look con nuestra nueva colección diseñada para destacar en cualquier ocasión.</p>
                    <div class="hero-buttons">
                        <RouterLink to="/productos" class="btn-hero-primary">Ver colección</RouterLink>
                        <RouterLink to="/tendencias" class="btn-hero-secondary">Ver trending 🔥</RouterLink>
                    </div>
                </div>

                <!-- Imagen -->
                <div class="hero-image">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1Qi-QfOAh5dyKs6TDg2Hkj52jsHVsEJ2PcOrvncqCPLidAx9z5slQuWQsSuUONoQdDEQ90IXr78kWCbuCmNX-wj46pX7e1fmZwy811F2BZEa0IV33R7RsLAjwydNaU717iW4U_XDKSQZcQStth4-_r_jrOnVw6l2Xblf61P6m1LEH7XTp6MbP4wFWyj_JdNSgw0Vz4Cxl0iP-ihkiF5KoQhhN-J3D9qZtCVihogf7dB9l4B6pUtbKhtxq3oBiNgGm2s-74AysDR4c" alt="Modyn Fashion" />
                </div>
            </div>
        </section>

        <!-- CATEGORÍAS -->
<section class="categorias">
    <div class="categorias-inner">
        <h2>Compra por categoría 🛍️</h2>
        <div class="categorias-pills">
            <button
                v-for="cat in categorias"
                :key="cat.CAT_id"
                @click="categoriaActiva = cat.CAT_id"
                :class="['pill', { active: categoriaActiva === cat.CAT_id }]"
            >
                {{ cat.CAT_name }}
            </button>
        </div>
    </div>
</section>

<!-- TRENDING -->
<section class="trending">
    <div class="trending-inner">
        <div class="trending-header">
            <div>
                <h2>🔥 Trending Ahora</h2>
                <p>Los más amados de la semana</p>
            </div>
            <RouterLink to="/tendencias" class="ver-todo">Ver todo el trending</RouterLink>
        </div>

        <div class="trending-grid">
            <div
                v-for="(producto, index) in trending"
                :key="producto.PRO_id"
                class="trending-card"
                @click="$router.push(`/productos/${producto.PRO_id}`)"
            >
                <!-- Badge -->
                <div class="rank-badge">
                    🏆 #{{ index + 1 }}
                </div>

                <!-- Imagen -->
                <div class="trending-img">
                    <img
                        :src="imagenes[producto.PRO_id] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'"
                        :alt="producto.PRO_name"
                    />
                </div>

                <!-- Info -->
                <div class="trending-info">
                    <h3>{{ producto.PRO_name }}</h3>
                    <p class="trending-price">{{ currency.formatear(producto.PRO_price) }}</p>
                    <div class="trending-bar"></div>
                    <div class="trending-stats">
                        <span>👁 {{ (producto.PRO_trending_score * 100).toFixed(0) }}k</span>
                        <span>♡ {{ producto.PRO_total_reviews }}k</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { get } from '../../services/api'
import { useCurrencyStore } from '../../stores/currencyStore'

const currency = useCurrencyStore()
const categorias      = ref([])
const categoriaActiva = ref(0)

onMounted(async () => {
    const cats = await get('/categories')
    categorias.value = [{ CAT_id: 0, CAT_name: 'Todos' }, ...cats]
})

const trending = ref([])
const imagenes = ref({})

onMounted(async () => {
    const cats = await get('/categories')
    categorias.value = [{ CAT_id: 0, CAT_name: 'Todos' }, ...cats]

    const prods = await get('/products/trending')
    trending.value = prods.slice(0, 3)

    // Cargar primera imagen de cada producto
    for (const p of trending.value) {
        const imgs = await get(`/product-images/product/${p.PRO_id}`)
        if (imgs.length > 0) imagenes.value[p.PRO_id] = imgs[0].IMG_url
    }
})

</script>

<style scoped>
.home {
    min-height: 100vh;
}

/* ── HERO ── */
.hero {
    background: linear-gradient(160deg, #F4637A 0%, #F7889A 40%, #FBBFC8 80%, #FDE8EC 100%);
    padding: 4rem 1.5rem 5rem;
    position: relative;
    overflow: hidden;
}

.hero-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 3rem;
}

/* Sparkles */
.sparkle {
    position: absolute;
    color: rgba(255,255,255,0.6);
    font-size: 1.5rem;
    pointer-events: none;
}

.sparkle-1 { top: 2rem; left: 2rem; font-size: 1.2rem; }
.sparkle-2 { bottom: 3rem; right: 45%; font-size: 1rem; }

/* Texto */
.hero-text {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.hero-text h1 {
    font-size: 3.5rem;
    font-weight: 800;
    color: #1E0F0F;
    line-height: 1.1;
}

.hero-text p {
    font-size: 1rem;
    color: rgba(30, 15, 15, 0.75);
    line-height: 1.7;
    max-width: 380px;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.btn-hero-primary {
    padding: 0 2rem;
    height: 56px;
    background: #C2185B;
    color: white;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(194, 24, 91, 0.3);
}

.btn-hero-primary:hover {
    background: #ad1457;
    transform: translateY(-1px);
}

.btn-hero-secondary {
    padding: 0 2rem;
    height: 56px;
    background: transparent;
    color: #aa691e;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    border: 2px solid #b17026;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-hero-secondary:hover {
    background: rgba(193, 123, 42, 0.1);
    transform: translateY(-1px);
}

/* Imagen */
.hero-image {
    display: flex;
    justify-content: center;
}

.hero-image img {
    width: 100%;
    max-width: 480px;
    height: 520px;
    object-fit: cover;
    object-position: top;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

/* ── CATEGORÍAS ── */
.categorias {
    background: #FDF5F0;
    padding: 2.5rem 1.5rem;
}

.categorias-inner {
    max-width: 1200px;
    margin: 0 auto;
}

.categorias-inner h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2D1B1B;
    margin-bottom: 1.25rem;
}

.categorias-pills {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
}

.pill {
    padding: 0.4rem 1.1rem;
    border-radius: 50px;
    border: 1.5px solid #E0D0D0;
    background: white;
    color: #3D2B2B;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Poppins', sans-serif;
}

.pill:hover {
    border-color: #F4637A;
    color: #F4637A;
}

.pill.active {
    background: #C2185B;
    border-color: #C2185B;
    color: white;
}

/* ── TRENDING ── */
/* ── TRENDING ── */
.trending {
    padding: 1.5rem;
    background: #FDF5F0;
}

.trending-inner {
    max-width: 1200px;
    margin: 0 auto;
    background: #FDE8EC;
    border-radius: 3rem;
    padding: 2.5rem;
}

.trending-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 1.5rem;
}

.trending-header h2 {
    font-size: 1.6rem;
    font-weight: 700;
    color: #2D1B1B;
    margin-bottom: 0.25rem;
}

.trending-header p {
    font-size: 0.88rem;
    color: #8A6A6A;
    margin-top: 0.25rem;
}

.ver-todo {
    color: #F4637A;
    font-size: 0.88rem;
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 4px;
    white-space: nowrap;
}

.ver-todo:hover { color: #C2185B; }

.trending-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
}

.trending-card {
    position: relative;
    cursor: pointer;
    border-radius: 1.5rem;
    overflow: hidden;
    background: white;
    transition: all 0.3s;
}

.trending-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(244, 99, 122, 0.15);
}

.rank-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: #F9A84D;
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.3rem 0.75rem;
    border-radius: 50px;
    z-index: 1;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.trending-img {
    width: 100%;
    height: 260px;
    background: #F5F5F5;
    overflow: hidden;
}

.trending-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
}

.trending-card:hover .trending-img img {
    transform: scale(1.05);
}

.trending-info {
    padding: 1rem;
}

.trending-info h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #2D1B1B;
    margin-bottom: 0.25rem;
}

.trending-price {
    font-size: 1rem;
    font-weight: 700;
    color: #F4637A;
    margin-bottom: 0.5rem;
}

.trending-bar {
    height: 3px;
    background: linear-gradient(to right, #F4637A, #F9A84D);
    border-radius: 2px;
    margin-bottom: 0.5rem;
}

.trending-stats {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #8A6A6A;
}

</style>
