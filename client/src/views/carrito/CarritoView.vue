<template>
    <div class="container carrito-page">
        <h1 class="page-title">Mi carrito</h1>

        <div v-if="carrito.cargando" class="carrito-loading">Cargando tu carrito...</div>

        <div v-else-if="carrito.items.length === 0" class="carrito-empty">
            <span class="carrito-empty-icon"><i class="pi pi-shopping-cart"></i></span>
            <h2>Tu carrito está vacío</h2>
            <p>Explora nuestro catálogo y encuentra tu próximo look favorito.</p>
            <RouterLink to="/productos" class="btn btn-primary">Ir a productos</RouterLink>
        </div>

        <div v-else class="carrito-layout">
            <div class="carrito-items">
                <CartItem
                    v-for="item in carrito.items"
                    :key="item.CARTI_id"
                    :item="item"
                    @update-quantity="onActualizarCantidad"
                    @remove="onQuitar"
                />
            </div>

            <CartSummary
                :subtotal="carrito.total"
                action-label="Ir a pagar"
                @action="irACheckout"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useCarritoStore } from '../../stores/carritoStore'
import CartItem from '../../components/carrito/CartItem.vue'
import CartSummary from '../../components/carrito/CartSummary.vue'

const carrito = useCarritoStore()
const router  = useRouter()

onMounted(() => {
    if (!carrito.iniciado) carrito.inicializar()
})

const onActualizarCantidad = (CARTI_id, cantidad) => {
    carrito.actualizarCantidad(CARTI_id, cantidad)
}

const onQuitar = (CARTI_id) => {
    carrito.quitar(CARTI_id)
}

const irACheckout = () => {
    router.push('/checkout')
}
</script>

<style scoped>
.carrito-page {
    padding: var(--space-2xl) var(--space-lg);
}

.page-title {
    font-size: 2rem;
    color: var(--color-text);
    margin-bottom: var(--space-xl);
}

.carrito-loading {
    text-align: center;
    color: var(--color-text-light);
    padding: var(--space-2xl) 0;
}

.carrito-empty {
    text-align: center;
    padding: var(--space-2xl) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
}

.carrito-empty-icon {
    font-size: 3rem;
    color: var(--color-border);
}

.carrito-empty h2 {
    color: var(--color-text);
}

.carrito-empty p {
    color: var(--color-text-light);
    margin-bottom: var(--space-md);
}

.carrito-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: var(--space-xl);
    align-items: start;
}

.carrito-items {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

@media (max-width: 900px) {
    .carrito-layout {
        grid-template-columns: 1fr;
    }
}
</style>
