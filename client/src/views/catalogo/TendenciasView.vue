<template>
    <div class="tendencias-page">

        <!-- Header -->
        <div class="tendencias-header">
            <span class="sparkle sp1">✦</span>
            <span class="sparkle sp2">✦</span>
            <span class="sparkle sp3">✦</span>
            <h1>🔥 EN TENDENCIA AHORA</h1>
            <p>Los productos más virales de la semana</p>
            <div class="filtros">
                <button
                    v-for="f in filtros"
                    :key="f.valor"
                    @click="filtroActivo = f.valor"
                    :class="['filtro-btn', { active: filtroActivo === f.valor }]"
                >{{ f.label }}</button>
            </div>
        </div>

        <div class="tendencias-body">

            <!-- Card #1 Principal -->
            <div class="card-top" v-if="trending[0]" @click="ir(trending[0].PRO_id)">
                <div class="card-top-rank">1</div>
                <span class="badge-viral">● VIRAL</span>

                <div class="card-top-inner">
                    <div class="card-top-img">
                        <img :src="imagenes[trending[0].PRO_id] || imgDefault" :alt="trending[0].PRO_name" />
                        <span class="sparkle-img">✦</span>
                    </div>
                    <div class="card-top-info">
                        <span class="trend-label">TREND OF THE WEEK</span>
                        <div class="brand-price">
                            <span class="brand-tag">{{ trending[0].PRO_brand }}</span>
                            <span class="price-big">${{ trending[0].PRO_price.toFixed(2) }}</span>
                        </div>
                        <h2>{{ trending[0].PRO_name }}</h2>

                        <div class="stats-grid">
                            <div class="stat">
                                <span class="stat-icon">♥</span>
                                <span class="stat-num">{{ trending[0].PRO_total_reviews * 100 }}k</span>
                                <span class="stat-label">LIKES</span>
                            </div>
                            <div class="stat">
                                <span class="stat-icon">🔖</span>
                                <span class="stat-num">{{ (trending[0].PRO_total_reviews * 50).toFixed(1) }}k</span>
                                <span class="stat-label">SAVES</span>
                            </div>
                            <div class="stat">
                                <span class="stat-icon">👁</span>
                                <span class="stat-num">{{ (trending[0].PRO_trending_score * 10).toFixed(0) }}k</span>
                                <span class="stat-label">VIEWS</span>
                            </div>
                        </div>

                        <div class="score-section">
                            <div class="score-label">
                                <span>TRENDING SCORE</span>
                                <span>{{ trending[0].PRO_trending_score }}/100</span>
                            </div>
                            <div class="score-bar">
                                <div class="score-fill" :style="{ width: trending[0].PRO_trending_score + '%' }"></div>
                            </div>
                        </div>

                        <button class="btn-ver-trend" @click.stop="ir(trending[0].PRO_id)">
                            🛍 Ver producto en tendencia
                        </button>
                    </div>
                </div>
            </div>

            <!-- Cards #2 y #3 -->
            <div class="cards-medio">
                <div
                    v-for="(p, i) in trending.slice(1, 3)"
                    :key="p.PRO_id"
                    class="card-medio"
                    @click="ir(p.PRO_id)"
                >
                    <div class="card-medio-rank">{{ i + 2 }}</div>
                    <span class="badge-subiendo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                        Subiendo
                    </span>
                    <div class="card-medio-img">
                        <img :src="imagenes[p.PRO_id] || imgDefault" :alt="p.PRO_name" />
                    </div>
                    <div class="card-medio-info">
                        <h3>{{ p.PRO_name }}</h3>
                        <span class="price-medio">${{ p.PRO_price.toFixed(2) }}</span>
                        <div class="likes-row">
                            <span>♥ {{ (p.PRO_total_reviews * 80).toFixed(1) }}k</span>
                        </div>
                        <div class="score-bar">
                            <div class="score-fill" :style="{ width: p.PRO_trending_score + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lista #4 y #5 -->
            <div class="cards-lista">
                <div
                    v-for="(p, i) in trending.slice(3, 5)"
                    :key="p.PRO_id"
                    class="card-lista"
                    @click="ir(p.PRO_id)"
                >
                    <span class="lista-rank">{{ i + 4 }}</span>
                    <div class="lista-img">
                        <img :src="imagenes[p.PRO_id] || imgDefault" :alt="p.PRO_name" />
                    </div>
                    <div class="lista-info">
                        <h4>{{ p.PRO_name }}</h4>
                        <div class="lista-score">
                            <div class="score-bar">
                                <div class="score-fill" :style="{ width: p.PRO_trending_score + '%' }"></div>
                            </div>
                            <span>{{ p.PRO_trending_score }}%</span>
                        </div>
                    </div>
                    <span class="lista-price">${{ p.PRO_price.toFixed(2) }}</span>
                    <span class="lista-arrow">→</span>
                </div>
            </div>

            <!-- Ver todos -->
            <div class="ver-todos">
                <RouterLink to="/productos" class="btn-ver-todos">Ver todos los productos →</RouterLink>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'  // ← agregar watch
import { useRouter } from 'vue-router'
import { get } from '../../services/api'

const router       = useRouter()
const trending     = ref([])
const imagenes     = ref({})
const filtroActivo = ref('semana')
const loading      = ref(false)              // ← agregar loading
const imgDefault   = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'

const filtros = [
    { valor: 'hoy',    label: 'Hoy' },
    { valor: 'semana', label: 'Esta semana' },
    { valor: 'mes',    label: 'Este mes' }
]

const ir = (id) => router.push(`/productos/${id}`)

const cargarTrending = async (periodo) => {
    loading.value = true
    try {
        const prods = await get(`/products/trending/${periodo}`)
        trending.value = prods.slice(0, 5)

        await Promise.all(
            prods.slice(0, 5).map(async (p) => {
                try {
                    const imgs = await get(`/product-images/product/${p.PRO_id}`)
                    if (imgs && imgs.length > 0) {
                        imagenes.value = { ...imagenes.value, [p.PRO_id]: imgs[0].IMG_url }
                    }
                } catch (e) {}
            })
        )
    } finally {
        loading.value = false
    }
}

watch(filtroActivo, (nuevo) => {
    cargarTrending(nuevo)
})

onMounted(() => {
    cargarTrending(filtroActivo.value)
})

</script>

<style scoped>
.tendencias-page {
    min-height: 100vh;
    background: #FDF5F0;
    font-family: 'Poppins', sans-serif;
}

/* ── HEADER ── */
.tendencias-header {
    background: linear-gradient(135deg, #F4637A 0%, #F9A84D 100%);
    padding: 3.5rem 1.5rem 4rem;
    text-align: center;
    position: relative;
    overflow: hidden;
    border-radius: 0 0 3rem 3rem;
    margin: 0 1rem;
}

.tendencias-header h1 {
    font-size: 2.5rem;
    font-weight: 900;
    color: white;
    letter-spacing: 0.02em;
    margin-bottom: 0.5rem;
}

.tendencias-header p {
    color: rgba(255,255,255,0.85);
    font-size: 1rem;
    margin-bottom: 1.5rem;
}

.sparkle {
    position: absolute;
    color: rgba(255,255,255,0.5);
    font-size: 1.2rem;
}

.sp1 { top: 1.5rem; left: 8%; }
.sp2 { top: 1rem; right: 10%; font-size: 0.9rem; }
.sp3 { bottom: 2rem; right: 40%; }

.filtros {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
}

.filtro-btn {
    padding: 0.45rem 1.25rem;
    border-radius: 50px;
    border: 1.5px solid rgba(255,255,255,0.6);
    background: transparent;
    color: white;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Poppins', sans-serif;
}

.filtro-btn:hover { background: rgba(255,255,255,0.2); }
.filtro-btn.active { background: white; color: #F4637A; border-color: white; }

/* ── BODY ── */
.tendencias-body {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.5rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* ── CARD TOP #1 ── */
.card-top {
    background: white;
    border-radius: 24px;
    padding: 1.5rem;
    position: relative;
    box-shadow: 0 4px 20px rgba(244, 99, 122, 0.1);
    cursor: pointer;
    transition: transform 0.2s;
}

.card-top:hover { transform: translateY(-2px); }

.card-top-rank {
    position: absolute;
    top: -12px;
    left: 1.5rem;
    background: #F9A84D;
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1rem;
}

.badge-viral {
    position: absolute;
    top: 1rem;
    right: 1.25rem;
    background: #F4637A;
    color: white;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
}

.card-top-inner {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 2rem;
    align-items: center;
    margin-top: 0.5rem;
}

.card-top-img {
    position: relative;
    background: #FFF5F0;
    border-radius: 16px;
    overflow: hidden;
    height: 280px;
}

.card-top-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.sparkle-img {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: rgba(244, 99, 122, 0.4);
    font-size: 1rem;
}

.card-top-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.trend-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #F9A84D;
    letter-spacing: 0.1em;
}

.brand-price {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.brand-tag {
    background: #FDE8EC;
    color: #C2185B;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.2rem 0.75rem;
    border-radius: 50px;
}

.price-big {
    font-size: 2rem;
    font-weight: 800;
    color: #2D1B1B;
}

.card-top-info h2 {
    font-size: 1.8rem;
    font-weight: 800;
    color: #2D1B1B;
    line-height: 1.2;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    background: #FDF5F0;
    border-radius: 12px;
    padding: 0.75rem;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
}

.stat-icon { font-size: 1.1rem; color: #F4637A; }
.stat-num  { font-size: 1rem; font-weight: 700; color: #2D1B1B; }
.stat-label { font-size: 0.65rem; color: #8A6A6A; letter-spacing: 0.05em; }

.score-section { display: flex; flex-direction: column; gap: 0.4rem; }

.score-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    font-weight: 600;
    color: #8A6A6A;
}

.score-bar {
    height: 6px;
    background: #F0DDD8;
    border-radius: 3px;
    overflow: hidden;
}

.score-fill {
    height: 100%;
    background: linear-gradient(to right, #F4637A, #F9A84D);
    border-radius: 3px;
    transition: width 0.5s ease;
}

.btn-ver-trend {
    width: 100%;
    padding: 0.85rem;
    background: linear-gradient(135deg, #F4637A, #F9A84D);
    color: white;
    border: none;
    border-radius: 50px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-ver-trend:hover { opacity: 0.9; }

/* ── CARDS MEDIO #2 #3 ── */
.cards-medio {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
}

.card-medio {
    background: white;
    border-radius: 20px;
    padding: 1.25rem;
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    display: flex;
    gap: 1rem;
    align-items: center;
}

.card-medio:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(244,99,122,0.12); }

.card-medio-rank {
    position: absolute;
    top: -10px;
    left: 1rem;
    background: #8A6A6A;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.85rem;
}

.badge-subiendo {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: linear-gradient(135deg, #FFF3E0, #FFF8EC);
    color: #F9A84D;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.25rem 0.65rem;
    border-radius: 50px;
    border: 1px solid #F9A84D;
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.badge-subiendo svg {
    width: 12px;
    height: 12px;
    color: #F9A84D;
    stroke: #F9A84D;
}

.card-medio-img {
    width: 90px;
    height: 90px;
    border-radius: 12px;
    overflow: hidden;
    background: #FDF5F0;
    flex-shrink: 0;
}

.card-medio-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-medio-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-top: 0.5rem;
}

.card-medio-info h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #2D1B1B;
}

.price-medio {
    font-size: 1rem;
    font-weight: 700;
    color: #F4637A;
}

.likes-row {
    font-size: 0.8rem;
    color: #F4637A;
}

/* ── LISTA #4 #5 ── */
.cards-lista {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.card-lista {
    background: white;
    border-radius: 16px;
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.card-lista:hover { transform: translateX(4px); box-shadow: 0 4px 16px rgba(244,99,122,0.1); }

.lista-rank {
    width: 32px;
    height: 32px;
    background: #FDE8EC;
    color: #C2185B;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.88rem;
    flex-shrink: 0;
}

.lista-img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    overflow: hidden;
    background: #F5F5F5;
    flex-shrink: 0;
}

.lista-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.lista-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.lista-info h4 {
    font-size: 0.92rem;
    font-weight: 600;
    color: #2D1B1B;
}

.lista-score {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.lista-score .score-bar { flex: 1; }

.lista-score span {
    font-size: 0.75rem;
    color: #8A6A6A;
    white-space: nowrap;
}

.lista-price {
    font-size: 1rem;
    font-weight: 700;
    color: #2D1B1B;
    white-space: nowrap;
}

.lista-arrow {
    color: #F4637A;
    font-size: 1.1rem;
}

/* ── VER TODOS ── */
.ver-todos {
    text-align: center;
    padding: 1rem 0;
}

.btn-ver-todos {
    padding: 0.75rem 2rem;
    border: 2px solid #F4637A;
    border-radius: 50px;
    color: #F4637A;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    display: inline-block;
}

.btn-ver-todos:hover {
    background: #F4637A;
    color: white;
}
</style>