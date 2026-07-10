<template>
    <div class="container detalle-page" v-if="cargando">
        <p class="detalle-loading">Cargando producto...</p>
    </div>

    <div class="container detalle-page" v-else-if="!producto">
        <p class="detalle-loading">No se encontró el producto.</p>
    </div>

    <div class="container detalle-page" v-else>

        <!-- Breadcrumb -->
        <nav class="breadcrumb">
            <RouterLink to="/">Inicio</RouterLink>
            <span>›</span>
            <RouterLink to="/productos">Productos</RouterLink>
            <span>›</span>
            <span class="breadcrumb-current">{{ producto.PRO_name }}</span>
        </nav>

        <div class="detalle-card">
            <div class="detalle-top">
                <!-- Galeria -->
                <div class="detalle-gallery">
                    <div class="detalle-gallery-main">
                        <img v-if="imagenActiva" :src="imagenActiva" :alt="producto.PRO_name" />
                        <span v-else class="detalle-gallery-fallback"><i class="pi pi-image"></i></span>
                    </div>
                    <div class="detalle-gallery-thumbs" v-if="imagenes.length > 1">
                        <button
                            v-for="img in imagenes"
                            :key="img.IMG_id"
                            class="detalle-thumb"
                            :class="{ active: img.IMG_url === imagenActiva }"
                            @click="imagenActiva = img.IMG_url"
                        >
                            <img :src="img.IMG_url" alt="" />
                        </button>
                    </div>
                </div>

                <!-- Info -->
                <div class="detalle-info">
                    <span class="detalle-badge" v-if="producto.PRO_brand">{{ producto.PRO_brand }}</span>
                    <h1 class="detalle-name">{{ producto.PRO_name }}</h1>

                    <div class="detalle-rating" v-if="producto.PRO_total_reviews > 0">
                        <span class="detalle-stars">{{ estrellas(producto.PRO_rating_avg) }}</span>
                        <span class="detalle-rating-text">{{ producto.PRO_rating_avg.toFixed(1) }} ({{ producto.PRO_total_reviews }} reseñas)</span>
                    </div>

                    <div class="detalle-price">
                        <span class="detalle-price-current">S/ {{ precioActual.toFixed(2) }}</span>
                        <span v-if="producto.PRO_discount_price" class="detalle-price-old">S/ {{ producto.PRO_price.toFixed(2) }}</span>
                        <span v-if="descuentoPorcentaje" class="detalle-price-badge">-{{ descuentoPorcentaje }}% OFF</span>
                    </div>

                    <!-- Color -->
                    <div v-if="colores.length" class="detalle-variant-group">
                        <p class="detalle-variant-label">Color: <strong>{{ colorSeleccionado || '—' }}</strong></p>
                        <div class="detalle-color-options">
                            <button
                                v-for="color in colores"
                                :key="color"
                                class="color-swatch"
                                :class="{ selected: colorSeleccionado === color }"
                                :style="{ background: colorHex(color) }"
                                :title="color"
                                @click="colorSeleccionado = color"
                            ></button>
                        </div>
                    </div>

                    <!-- Talla -->
                    <div v-if="tallas.length" class="detalle-variant-group">
                        <div class="detalle-variant-label-row">
                            <p class="detalle-variant-label">Talla: <strong>{{ tallaSeleccionada || '—' }}</strong></p>
                            <button type="button" class="detalle-size-guide-link" @click="mostrarGuiaTallas = !mostrarGuiaTallas">
                                Guía de tallas
                            </button>
                        </div>
                        <div class="detalle-variant-options">
                            <button
                                v-for="talla in tallas"
                                :key="talla"
                                class="variant-chip"
                                :class="{ selected: tallaSeleccionada === talla, disabled: !tallaDisponible(talla) }"
                                @click="tallaSeleccionada = talla"
                            >{{ talla }}</button>
                        </div>

                        <div v-if="mostrarGuiaTallas" class="size-guide">
                            <table>
                                <thead>
                                    <tr><th>Talla</th><th>Busto</th><th>Cintura</th><th>Cadera</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>S</td><td>82-86 cm</td><td>62-66 cm</td><td>90-94 cm</td></tr>
                                    <tr><td>M</td><td>87-91 cm</td><td>67-71 cm</td><td>95-99 cm</td></tr>
                                    <tr><td>L</td><td>92-97 cm</td><td>72-77 cm</td><td>100-105 cm</td></tr>
                                    <tr><td>XL</td><td>98-104 cm</td><td>78-84 cm</td><td>106-112 cm</td></tr>
                                </tbody>
                            </table>
                            <p class="size-guide-note">Medidas referenciales. Pueden variar según el modelo.</p>
                        </div>
                    </div>

                    <p v-if="varianteSeleccionada && varianteSeleccionada.VAR_stock <= 0" class="detalle-stock-warning">
                        Sin stock para esta combinación
                    </p>

                    <div class="detalle-actions">
                        <div class="qty-selector">
                            <button @click="cantidad > 1 && cantidad--">−</button>
                            <span>{{ cantidad }}</span>
                            <button @click="cantidad++">+</button>
                        </div>

                        <button
                            class="btn btn-primary detalle-add-btn"
                            :disabled="agregando || producto.PRO_stock <= 0"
                            @click="agregarAlCarrito"
                        >
                            <template v-if="agregando">Agregando...</template>
                            <template v-else-if="producto.PRO_stock <= 0">Sin stock</template>
                            <template v-else><i class="pi pi-shopping-bag"></i> Agregar al carrito</template>
                        </button>
                    </div>

                    <button class="btn btn-outline detalle-wishlist-btn" type="button" @click="enWishlist = !enWishlist">
                        <i :class="enWishlist ? 'pi pi-heart-fill' : 'pi pi-heart'"></i> {{ enWishlist ? 'En tu wishlist' : 'Agregar a wishlist' }}
                    </button>

                    <p v-if="mensajeAgregado" class="detalle-added-msg">{{ mensajeAgregado }}</p>

                    <div class="detalle-shipping-banner">
                        <i class="pi pi-truck"></i> Envío gratis en pedidos +S/ 100
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="detalle-tabs">
                <button
                    v-for="tab in tabsDisponibles"
                    :key="tab.id"
                    class="detalle-tab"
                    :class="{ active: tabActiva === tab.id }"
                    @click="tabActiva = tab.id"
                >{{ tab.label }}</button>
            </div>

            <!-- Descripción -->
            <section v-if="tabActiva === 'descripcion'" class="detalle-tab-content">
                <p class="detalle-description">{{ producto.PRO_description || 'Sin descripción disponible.' }}</p>
            </section>

            <!-- Información + Preguntas -->
            <section v-if="tabActiva === 'informacion'" class="detalle-tab-content">
                <ul class="info-list">
                    <li><strong>Marca:</strong> {{ producto.PRO_brand || '—' }}</li>
                    <li><strong>Stock disponible:</strong> {{ producto.PRO_stock }} unidades</li>
                    <li><strong>SKU:</strong> PRO-{{ producto.PRO_id }}</li>
                </ul>

                <h3 class="detalle-subtitle">Preguntas y respuestas</h3>

                <form v-if="auth.isLoggedIn()" class="qa-form" @submit.prevent="enviarPregunta">
                    <input v-model="nuevaPregunta" class="input" placeholder="Escribe tu pregunta sobre el producto" required />
                    <button class="btn btn-outline" type="submit" :disabled="enviandoPregunta">Preguntar</button>
                </form>

                <div v-if="preguntas.length" class="qa-list">
                    <div v-for="qa in preguntas" :key="qa.QA_id" class="qa-item">
                        <p class="qa-question"><i class="pi pi-question-circle"></i> {{ qa.QA_question }}</p>
                        <p v-if="qa.QA_answer" class="qa-answer"><i class="pi pi-comment"></i> {{ qa.QA_answer }}</p>
                        <p v-else class="qa-pending">Aún sin respuesta</p>
                    </div>
                </div>
                <p v-else class="detalle-empty-text">Todavía no hay preguntas para este producto.</p>
            </section>

            <!-- Reseñas -->
            <section v-if="tabActiva === 'resenas'" class="detalle-tab-content">
                <div class="reviews-layout">
                    <div class="reviews-summary-card">
                        <p class="reviews-summary-score">{{ producto.PRO_rating_avg.toFixed(1) }}</p>
                        <p class="reviews-summary-stars">{{ estrellas(producto.PRO_rating_avg) }}</p>
                        <p class="reviews-summary-total">{{ producto.PRO_total_reviews }} reseñas</p>

                        <div class="reviews-bars">
                            <div v-for="n in [5,4,3,2,1]" :key="n" class="reviews-bar-row">
                                <span>{{ n }}</span>
                                <div class="reviews-bar-track">
                                    <div class="reviews-bar-fill" :style="{ width: porcentajeEstrella(n) + '%' }"></div>
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-primary reviews-write-btn" type="button" @click="mostrarFormResena = !mostrarFormResena" v-if="auth.isLoggedIn()">
                            Escribir reseña
                        </button>
                    </div>

                    <div class="reviews-list-col">
                        <form v-if="mostrarFormResena" class="review-form" @submit.prevent="enviarResena">
                            <div class="review-form-rating">
                                <span
                                    v-for="n in 5"
                                    :key="n"
                                    class="review-star"
                                    :class="{ active: n <= nuevaResena.REV_rating }"
                                    @click="nuevaResena.REV_rating = n"
                                >★</span>
                            </div>
                            <input v-model="nuevaResena.REV_title" class="input" placeholder="Título de tu reseña" required />
                            <textarea v-model="nuevaResena.REV_comment" class="input" rows="3" placeholder="Cuéntanos qué te pareció el producto" required></textarea>
                            <button class="btn btn-primary" type="submit" :disabled="enviandoResena">
                                {{ enviandoResena ? 'Enviando...' : 'Publicar reseña' }}
                            </button>
                        </form>

                        <div v-if="resenas.length" class="review-list">
                            <div v-for="rev in resenas" :key="rev.REV_id" class="review-item">
                                <div class="review-item-header">
                                    <span class="review-avatar">{{ (rev._nombreUsuario || 'U')[0] }}</span>
                                    <div>
                                        <strong>{{ rev._nombreUsuario || 'Usuario' }}</strong>
                                        <div class="review-stars">{{ estrellas(rev.REV_rating) }}</div>
                                    </div>
                                </div>
                                <p class="review-title">{{ rev.REV_title }}</p>
                                <p class="review-comment">{{ rev.REV_comment }}</p>
                                <div class="review-images" v-if="imagenesResenas[rev.REV_id]?.length">
                                    <img v-for="img in imagenesResenas[rev.REV_id]" :key="img.REVIMG_id" :src="img.REVIMG_url" alt="" />
                                </div>
                            </div>
                        </div>
                        <p v-else class="detalle-empty-text">Sé el primero en dejar una reseña.</p>
                    </div>
                </div>
            </section>
        </div>

        <!-- Relacionados -->
        <section v-if="relacionados.length" class="relacionados-section">
            <h2>También te puede gustar <i class="pi pi-sparkles"></i></h2>
            <div class="relacionados-grid">
                <RouterLink
                    v-for="rel in relacionados"
                    :key="rel.PRO_id"
                    :to="`/productos/${rel.PRO_id}`"
                    class="relacionado-card"
                >
                    <div class="relacionado-img">
                        <img v-if="imagenesRelacionados[rel.PRO_id]" :src="imagenesRelacionados[rel.PRO_id]" :alt="rel.PRO_name" />
                        <span v-else class="relacionado-fallback"><i class="pi pi-image"></i></span>
                    </div>
                    <p class="relacionado-name">{{ rel.PRO_name }}</p>
                    <p class="relacionado-price">S/ {{ (rel.PRO_discount_price || rel.PRO_price).toFixed(2) }}</p>
                </RouterLink>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useCarritoStore } from '../../stores/carritoStore'
import {
    obtenerProducto,
    obtenerVariantesProducto,
    listarImagenesProducto,
    obtenerImagenPrincipal,
    listarResenasProducto,
    listarImagenesResena,
    crearResena,
    listarPreguntasProducto,
    crearPregunta,
    listarProductosRelacionados
} from '../../services/productosService'
import { obtenerUsuario } from '../../services/usuarioService'

const route   = useRoute()
const auth    = useAuthStore()
const carrito = useCarritoStore()

const cargando   = ref(true)
const producto   = ref(null)
const variantes  = ref([])
const imagenes   = ref([])
const imagenActiva = ref(null)
const resenas    = ref([])
const imagenesResenas = ref({})
const preguntas  = ref([])
const relacionados = ref([])
const imagenesRelacionados = ref({})

const tallaSeleccionada = ref(null)
const colorSeleccionado = ref(null)
const cantidad   = ref(1)
const agregando  = ref(false)
const mensajeAgregado = ref('')
const enWishlist = ref(false)
const mostrarGuiaTallas = ref(false)

const tabsDisponibles = [
    { id: 'descripcion', label: 'Descripción' },
    { id: 'informacion', label: 'Información' },
    { id: 'resenas', label: 'Reseñas' }
]
const tabActiva = ref('descripcion')

const nuevaPregunta = ref('')
const enviandoPregunta = ref(false)

const mostrarFormResena = ref(false)
const nuevaResena = ref({ REV_rating: 5, REV_title: '', REV_comment: '' })
const enviandoResena = ref(false)

const precioActual = computed(() => producto.value.PRO_discount_price || producto.value.PRO_price)

const descuentoPorcentaje = computed(() => {
    if (!producto.value.PRO_discount_price) return 0
    return Math.round((1 - producto.value.PRO_discount_price / producto.value.PRO_price) * 100)
})

const tallas = computed(() => [...new Set(variantes.value.map((v) => v.VAR_size).filter(Boolean))])
const colores = computed(() => [...new Set(variantes.value.map((v) => v.VAR_color).filter(Boolean))])

const varianteSeleccionada = computed(() =>
    variantes.value.find((v) =>
        (!tallaSeleccionada.value || v.VAR_size === tallaSeleccionada.value) &&
        (!colorSeleccionado.value || v.VAR_color === colorSeleccionado.value)
    ) || null
)

const tallaDisponible = (talla) => {
    const variante = variantes.value.find((v) =>
        v.VAR_size === talla && (!colorSeleccionado.value || v.VAR_color === colorSeleccionado.value)
    )
    return !variante || variante.VAR_stock > 0
}

const MAPA_COLORES = {
    coral: '#F4637A', rosa: '#F7B7C4', rojo: '#E53935', verde: '#8DBE94',
    azul: '#5B8FD6', negro: '#2D1B1B', blanco: '#FFFFFF', beige: '#E8D9C5',
    crema: '#F5E9DD', gris: '#A9A9A9', marron: '#8B5E3C', café: '#8B5E3C',
    amarillo: '#F7C948', naranja: '#F9A84D', morado: '#9C7BC9', celeste: '#A8D8E8'
}
const colorHex = (nombre) => MAPA_COLORES[nombre?.toLowerCase()?.trim()] || '#CCCCCC'

const estrellas = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))

const porcentajeEstrella = (n) => {
    if (!resenas.value.length) return 0
    const cantidadConEsaEstrella = resenas.value.filter((r) => Math.round(r.REV_rating) === n).length
    return Math.round((cantidadConEsaEstrella / resenas.value.length) * 100)
}

const cargarDatos = async () => {
    cargando.value = true
    const PRO_id = route.params.id
    try {
        producto.value = await obtenerProducto(PRO_id)
        const [vars, imgs, revs, qas] = await Promise.all([
            obtenerVariantesProducto(PRO_id),
            listarImagenesProducto(PRO_id),
            listarResenasProducto(PRO_id),
            listarPreguntasProducto(PRO_id)
        ])
        variantes.value = vars
        imagenes.value  = [...imgs].sort((a, b) => (a.IMG_order ?? 0) - (b.IMG_order ?? 0))
        imagenActiva.value = imagenes.value[0]?.IMG_url || null
        preguntas.value = qas

        if (tallas.value.length) tallaSeleccionada.value = tallas.value[0]
        if (colores.value.length) colorSeleccionado.value = colores.value[0]

        resenas.value = await Promise.all(
            revs.map(async (r) => {
                const usuario = await obtenerUsuario(r.USU_id).catch(() => null)
                return { ...r, _nombreUsuario: usuario?.USU_name || 'Usuario' }
            })
        )

        const entradas = await Promise.all(
            revs.map(async (r) => [r.REV_id, await listarImagenesResena(r.REV_id)])
        )
        imagenesResenas.value = Object.fromEntries(entradas)

        if (producto.value.CAT_id) {
            relacionados.value = await listarProductosRelacionados(producto.value.CAT_id, PRO_id, 4)
            const imgEntradas = await Promise.all(
                relacionados.value.map(async (p) => [p.PRO_id, await obtenerImagenPrincipal(p.PRO_id).catch(() => null)])
            )
            imagenesRelacionados.value = Object.fromEntries(imgEntradas)
        }
    } finally {
        cargando.value = false
    }
}

onMounted(cargarDatos)
watch(() => route.params.id, cargarDatos)

const agregarAlCarrito = async () => {
    if (!auth.isLoggedIn()) {
        mensajeAgregado.value = 'Inicia sesión para agregar productos al carrito'
        return
    }
    agregando.value = true
    mensajeAgregado.value = ''
    try {
        await carrito.agregar(producto.value, cantidad.value, imagenActiva.value)
        mensajeAgregado.value = '¡Producto agregado al carrito!'
    } finally {
        agregando.value = false
    }
}

const enviarPregunta = async () => {
    enviandoPregunta.value = true
    try {
        const creada = await crearPregunta({
            PRO_id: producto.value.PRO_id,
            USU_id: auth.usuario.USU_id,
            QA_question: nuevaPregunta.value
        })
        preguntas.value.push(creada)
        nuevaPregunta.value = ''
    } finally {
        enviandoPregunta.value = false
    }
}

const enviarResena = async () => {
    enviandoResena.value = true
    try {
        const creada = await crearResena({
            PRO_id: producto.value.PRO_id,
            USU_id: auth.usuario.USU_id,
            REV_rating: nuevaResena.value.REV_rating,
            REV_title: nuevaResena.value.REV_title,
            REV_comment: nuevaResena.value.REV_comment
        })
        resenas.value.unshift({ ...creada, _nombreUsuario: auth.usuario.USU_name })
        imagenesResenas.value[creada.REV_id] = []
        nuevaResena.value = { REV_rating: 5, REV_title: '', REV_comment: '' }
        mostrarFormResena.value = false
    } finally {
        enviandoResena.value = false
    }
}
</script>

<style scoped>
.detalle-page {
    padding: var(--space-2xl) var(--space-lg);
}

.detalle-loading {
    text-align: center;
    color: var(--color-text-light);
    padding: var(--space-2xl) 0;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: 0.85rem;
    color: var(--color-text-light);
    margin-bottom: var(--space-lg);
}

.breadcrumb a {
    color: var(--color-text-light);
    text-decoration: none;
}

.breadcrumb a:hover {
    color: var(--color-primary);
}

.breadcrumb-current {
    color: var(--color-text);
    font-weight: 500;
}

.detalle-card {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    box-shadow: var(--shadow-sm);
}

.detalle-top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
    margin-bottom: var(--space-xl);
}

.detalle-gallery-main {
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.detalle-gallery-main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.detalle-gallery-fallback {
    font-size: 4rem;
}

.detalle-gallery-thumbs {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-sm);
}

.detalle-thumb {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 0;
}

.detalle-thumb.active {
    border-color: var(--color-primary);
}

.detalle-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.detalle-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

.detalle-badge {
    display: inline-block;
    width: fit-content;
    background: rgba(244, 99, 122, 0.1);
    color: var(--color-primary);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.3rem 0.9rem;
    border-radius: var(--radius-full);
}

.detalle-name {
    font-size: 1.75rem;
    color: var(--color-text);
}

.detalle-rating {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
}

.detalle-stars, .review-stars, .reviews-summary-stars {
    color: var(--color-accent);
}

.detalle-rating-text {
    font-size: 0.85rem;
    color: var(--color-text-light);
}

.detalle-price {
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
    margin: var(--space-sm) 0;
    flex-wrap: wrap;
}

.detalle-price-current {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-primary);
}

.detalle-price-old {
    text-decoration: line-through;
    color: var(--color-text-light);
}

.detalle-price-badge {
    background: rgba(76, 175, 80, 0.15);
    color: var(--color-success);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: var(--radius-full);
}

.detalle-variant-group {
    margin-top: var(--space-sm);
}

.detalle-variant-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.detalle-variant-label {
    font-size: 0.85rem;
    color: var(--color-text-light);
    margin-bottom: var(--space-xs);
}

.detalle-size-guide-link {
    background: none;
    border: none;
    color: var(--color-primary);
    font-size: 0.8rem;
    text-decoration: underline;
    cursor: pointer;
}

.detalle-color-options {
    display: flex;
    gap: var(--space-sm);
}

.color-swatch {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--color-border);
    cursor: pointer;
    transition: var(--transition);
    padding: 0;
}

.color-swatch.selected {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-white), 0 0 0 4px var(--color-primary);
}

.detalle-variant-options {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
}

.variant-chip {
    padding: 0.5rem 1.1rem;
    border-radius: var(--radius-full);
    border: 1.5px solid var(--color-border);
    background: var(--color-white);
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.85rem;
}

.variant-chip.selected {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: var(--color-white);
}

.variant-chip.disabled {
    opacity: 0.4;
    text-decoration: line-through;
}

.size-guide {
    margin-top: var(--space-sm);
    background: var(--color-bg);
    border-radius: var(--radius-md);
    padding: var(--space-md);
}

.size-guide table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
}

.size-guide th, .size-guide td {
    text-align: left;
    padding: 0.3rem 0.5rem;
}

.size-guide th {
    color: var(--color-text-light);
    font-weight: 600;
}

.size-guide-note {
    font-size: 0.75rem;
    color: var(--color-text-light);
    margin-top: var(--space-xs);
}

.detalle-stock-warning {
    color: var(--color-error);
    font-size: 0.85rem;
}

.detalle-actions {
    display: flex;
    gap: var(--space-md);
    margin-top: var(--space-md);
}

.qty-selector {
    display: inline-flex;
    align-items: center;
    gap: var(--space-md);
    background: var(--color-bg);
    border-radius: var(--radius-full);
    padding: 0.4rem 1rem;
    width: fit-content;
    flex-shrink: 0;
}

.qty-selector button {
    border: none;
    background: none;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-primary);
    cursor: pointer;
}

.detalle-add-btn {
    flex: 1;
    padding: 0.9rem;
    font-size: 1rem;
}

.detalle-wishlist-btn {
    width: 100%;
    padding: 0.75rem;
}

.detalle-added-msg {
    color: var(--color-success);
    font-size: 0.9rem;
}

.detalle-shipping-banner {
    background: rgba(244, 99, 122, 0.08);
    color: var(--color-primary);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    font-size: 0.85rem;
    margin-top: var(--space-sm);
}

.detalle-tabs {
    display: flex;
    gap: var(--space-md);
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--space-lg);
}

.detalle-tab {
    background: none;
    border: none;
    padding: var(--space-sm) var(--space-xs);
    cursor: pointer;
    font-weight: 500;
    color: var(--color-text-light);
    border-bottom: 2px solid transparent;
    transition: var(--transition);
}

.detalle-tab.active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
}

.detalle-tab-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.detalle-description {
    color: var(--color-text-light);
    line-height: 1.7;
}

.detalle-subtitle {
    font-size: 1.1rem;
    color: var(--color-text);
    margin-top: var(--space-md);
}

.info-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    color: var(--color-text-light);
}

.detalle-empty-text {
    color: var(--color-text-light);
    font-size: 0.9rem;
}

.qa-form, .review-form {
    display: flex;
    gap: var(--space-sm);
    background: var(--color-bg);
    padding: var(--space-md);
    border-radius: var(--radius-lg);
}

.review-form {
    flex-direction: column;
    align-items: flex-start;
}

.review-form-rating {
    font-size: 1.5rem;
    color: var(--color-border);
    cursor: pointer;
}

.review-star.active {
    color: var(--color-accent);
}

.qa-list, .review-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.qa-item, .review-item {
    background: var(--color-bg);
    border-radius: var(--radius-md);
    padding: var(--space-md);
}

.qa-question {
    font-weight: 600;
}

.qa-answer {
    color: var(--color-text-light);
    margin-top: var(--space-xs);
}

.qa-pending {
    color: var(--color-text-light);
    font-style: italic;
    font-size: 0.85rem;
    margin-top: var(--space-xs);
}

/* Reseñas */
.reviews-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: var(--space-xl);
    align-items: start;
}

.reviews-summary-card {
    background: var(--color-bg);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

.reviews-summary-score {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-primary);
}

.reviews-summary-total {
    font-size: 0.85rem;
    color: var(--color-text-light);
}

.reviews-bars {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-top: var(--space-sm);
}

.reviews-bar-row {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: 0.75rem;
    color: var(--color-text-light);
}

.reviews-bar-track {
    flex: 1;
    height: 6px;
    background: var(--color-border);
    border-radius: var(--radius-full);
    overflow: hidden;
}

.reviews-bar-fill {
    height: 100%;
    background: var(--color-primary);
}

.reviews-write-btn {
    margin-top: var(--space-sm);
}

.reviews-list-col {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.review-item-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-xs);
}

.review-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--color-primary);
    color: var(--color-white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
}

.review-title {
    font-weight: 600;
    margin-top: var(--space-xs);
}

.review-comment {
    color: var(--color-text-light);
}

.review-images {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-sm);
}

.review-images img {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-md);
    object-fit: cover;
}

/* Relacionados */
.relacionados-section {
    margin-top: var(--space-2xl);
}

.relacionados-section h2 {
    font-size: 1.3rem;
    color: var(--color-text);
    margin-bottom: var(--space-lg);
}

.relacionados-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--space-lg);
}

.relacionado-card {
    text-decoration: none;
    color: inherit;
    display: block;
}

.relacionado-img {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    margin-bottom: var(--space-sm);
    transition: var(--transition);
}

.relacionado-card:hover .relacionado-img {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}

.relacionado-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.relacionado-fallback {
    font-size: 2rem;
}

.relacionado-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-text);
}

.relacionado-price {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--color-primary);
}

@media (max-width: 800px) {
    .detalle-top {
        grid-template-columns: 1fr;
    }
    .reviews-layout {
        grid-template-columns: 1fr;
    }
}
</style>
