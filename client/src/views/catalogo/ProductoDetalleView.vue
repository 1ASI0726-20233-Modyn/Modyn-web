<template>
    <div class="container detalle-page" v-if="cargando">
        <p class="detalle-loading">Cargando producto...</p>
    </div>

    <div class="container detalle-page" v-else-if="!producto">
        <p class="detalle-loading">No se encontró el producto.</p>
    </div>

    <div class="container detalle-page" v-else>

        <div class="detalle-top">
            <!-- Galeria -->
            <div class="detalle-gallery">
                <div class="detalle-gallery-main">
                    <img v-if="imagenActiva" :src="imagenActiva" :alt="producto.PRO_name" />
                    <span v-else class="detalle-gallery-fallback">👗</span>
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
                <p class="detalle-brand" v-if="producto.PRO_brand">{{ producto.PRO_brand }}</p>
                <h1 class="detalle-name">{{ producto.PRO_name }}</h1>

                <div class="detalle-rating" v-if="producto.PRO_total_reviews > 0">
                    <span class="detalle-stars">{{ estrellas(producto.PRO_rating_avg) }}</span>
                    <span class="detalle-rating-text">{{ producto.PRO_rating_avg.toFixed(1) }} ({{ producto.PRO_total_reviews }} reseñas)</span>
                </div>

                <div class="detalle-price">
                    <span class="detalle-price-current">S/ {{ precioActual.toFixed(2) }}</span>
                    <span v-if="producto.PRO_discount_price" class="detalle-price-old">S/ {{ producto.PRO_price.toFixed(2) }}</span>
                </div>

                <p class="detalle-description">{{ producto.PRO_description }}</p>

                <!-- Variantes -->
                <div v-if="tallas.length" class="detalle-variant-group">
                    <p class="detalle-variant-label">Talla</p>
                    <div class="detalle-variant-options">
                        <button
                            v-for="talla in tallas"
                            :key="talla"
                            class="variant-chip"
                            :class="{ selected: tallaSeleccionada === talla }"
                            @click="tallaSeleccionada = talla"
                        >{{ talla }}</button>
                    </div>
                </div>

                <div v-if="colores.length" class="detalle-variant-group">
                    <p class="detalle-variant-label">Color</p>
                    <div class="detalle-variant-options">
                        <button
                            v-for="color in colores"
                            :key="color"
                            class="variant-chip"
                            :class="{ selected: colorSeleccionado === color }"
                            @click="colorSeleccionado = color"
                        >{{ color }}</button>
                    </div>
                </div>

                <p v-if="varianteSeleccionada && varianteSeleccionada.VAR_stock <= 0" class="detalle-stock-warning">
                    Sin stock para esta combinación
                </p>

                <div class="detalle-cantidad">
                    <p class="detalle-variant-label">Cantidad</p>
                    <div class="qty-selector">
                        <button @click="cantidad > 1 && cantidad--">−</button>
                        <span>{{ cantidad }}</span>
                        <button @click="cantidad++">+</button>
                    </div>
                </div>

                <button
                    class="btn btn-primary detalle-add-btn"
                    :disabled="agregando || producto.PRO_stock <= 0"
                    @click="agregarAlCarrito"
                >
                    {{ agregando ? 'Agregando...' : (producto.PRO_stock <= 0 ? 'Sin stock' : '🛍️ Agregar al carrito') }}
                </button>
                <p v-if="mensajeAgregado" class="detalle-added-msg">{{ mensajeAgregado }}</p>
            </div>
        </div>

        <!-- Preguntas y respuestas -->
        <section class="detalle-section">
            <h2>Preguntas y respuestas</h2>

            <form v-if="auth.isLoggedIn()" class="qa-form" @submit.prevent="enviarPregunta">
                <input v-model="nuevaPregunta" class="input" placeholder="Escribe tu pregunta sobre el producto" required />
                <button class="btn btn-outline" type="submit" :disabled="enviandoPregunta">Preguntar</button>
            </form>

            <div v-if="preguntas.length" class="qa-list">
                <div v-for="qa in preguntas" :key="qa.QA_id" class="qa-item">
                    <p class="qa-question">❓ {{ qa.QA_question }}</p>
                    <p v-if="qa.QA_answer" class="qa-answer">💬 {{ qa.QA_answer }}</p>
                    <p v-else class="qa-pending">Aún sin respuesta</p>
                </div>
            </div>
            <p v-else class="detalle-empty-text">Todavía no hay preguntas para este producto.</p>
        </section>

        <!-- Reseñas -->
        <section class="detalle-section">
            <h2>Reseñas de clientes</h2>

            <form v-if="auth.isLoggedIn()" class="review-form" @submit.prevent="enviarResena">
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
                        <span class="review-stars">{{ estrellas(rev.REV_rating) }}</span>
                        <strong>{{ rev.REV_title }}</strong>
                    </div>
                    <p class="review-comment">{{ rev.REV_comment }}</p>
                    <div class="review-images" v-if="imagenesResenas[rev.REV_id]?.length">
                        <img v-for="img in imagenesResenas[rev.REV_id]" :key="img.REVIMG_id" :src="img.REVIMG_url" alt="" />
                    </div>
                </div>
            </div>
            <p v-else class="detalle-empty-text">Sé el primero en dejar una reseña.</p>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useCarritoStore } from '../../stores/carritoStore'
import {
    obtenerProducto,
    obtenerVariantesProducto,
    listarImagenesProducto,
    listarResenasProducto,
    listarImagenesResena,
    crearResena,
    listarPreguntasProducto,
    crearPregunta
} from '../../services/productosService'

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

const tallaSeleccionada = ref(null)
const colorSeleccionado = ref(null)
const cantidad   = ref(1)
const agregando  = ref(false)
const mensajeAgregado = ref('')

const nuevaPregunta = ref('')
const enviandoPregunta = ref(false)

const nuevaResena = ref({ REV_rating: 5, REV_title: '', REV_comment: '' })
const enviandoResena = ref(false)

const precioActual = computed(() => producto.value.PRO_discount_price || producto.value.PRO_price)

const tallas = computed(() => [...new Set(variantes.value.map((v) => v.VAR_size).filter(Boolean))])
const colores = computed(() => [...new Set(variantes.value.map((v) => v.VAR_color).filter(Boolean))])

const varianteSeleccionada = computed(() =>
    variantes.value.find((v) =>
        (!tallaSeleccionada.value || v.VAR_size === tallaSeleccionada.value) &&
        (!colorSeleccionado.value || v.VAR_color === colorSeleccionado.value)
    ) || null
)

const estrellas = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))

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
        imagenes.value  = imgs
        imagenActiva.value = imgs[0]?.IMG_url || null
        resenas.value   = revs
        preguntas.value = qas

        const entradas = await Promise.all(
            revs.map(async (r) => [r.REV_id, await listarImagenesResena(r.REV_id)])
        )
        imagenesResenas.value = Object.fromEntries(entradas)
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
        await carrito.agregar(producto.value, cantidad.value)
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
        resenas.value.unshift(creada)
        imagenesResenas.value[creada.REV_id] = []
        nuevaResena.value = { REV_rating: 5, REV_title: '', REV_comment: '' }
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

.detalle-top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
    margin-bottom: var(--space-2xl);
}

.detalle-gallery-main {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
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

.detalle-brand {
    color: var(--color-text-light);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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

.detalle-stars, .review-stars {
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

.detalle-description {
    color: var(--color-text-light);
    line-height: 1.7;
}

.detalle-variant-group {
    margin-top: var(--space-sm);
}

.detalle-variant-label {
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: var(--space-xs);
}

.detalle-variant-options {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
}

.variant-chip {
    padding: 0.4rem 1rem;
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

.detalle-stock-warning {
    color: var(--color-error);
    font-size: 0.85rem;
}

.qty-selector {
    display: inline-flex;
    align-items: center;
    gap: var(--space-md);
    background: var(--color-bg);
    border-radius: var(--radius-full);
    padding: 0.4rem 1rem;
    width: fit-content;
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
    margin-top: var(--space-md);
    padding: 0.9rem;
    font-size: 1rem;
}

.detalle-added-msg {
    color: var(--color-success);
    font-size: 0.9rem;
}

.detalle-section {
    padding-top: var(--space-2xl);
    border-top: 1px solid var(--color-border);
    margin-top: var(--space-xl);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.detalle-section h2 {
    font-size: 1.3rem;
    color: var(--color-text);
}

.detalle-empty-text {
    color: var(--color-text-light);
    font-size: 0.9rem;
}

.qa-form, .review-form {
    display: flex;
    gap: var(--space-sm);
    background: var(--color-bg-card);
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
    background: var(--color-bg-card);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    box-shadow: var(--shadow-sm);
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

.review-item-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-xs);
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

@media (max-width: 800px) {
    .detalle-top {
        grid-template-columns: 1fr;
    }
}
</style>
