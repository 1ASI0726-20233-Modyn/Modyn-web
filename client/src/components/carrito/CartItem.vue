<template>
    <div class="cart-item">
        <div class="cart-item-img">
            <span class="cart-item-img-fallback">👗</span>
        </div>

        <div class="cart-item-info">
            <h3 class="cart-item-name">{{ nombreProducto }}</h3>
            <p class="cart-item-brand" v-if="item.producto?.PRO_brand">{{ item.producto.PRO_brand }}</p>
            <p class="cart-item-price">S/ {{ Number(item.CARTI_price).toFixed(2) }} c/u</p>
        </div>

        <div class="cart-item-qty">
            <button
                class="qty-btn"
                :disabled="item.CARTI_quantity <= 1"
                @click="$emit('update-quantity', item.CARTI_id, item.CARTI_quantity - 1)"
            >−</button>
            <span class="qty-value">{{ item.CARTI_quantity }}</span>
            <button
                class="qty-btn"
                @click="$emit('update-quantity', item.CARTI_id, item.CARTI_quantity + 1)"
            >+</button>
        </div>

        <div class="cart-item-subtotal">
            S/ {{ (item.CARTI_price * item.CARTI_quantity).toFixed(2) }}
        </div>

        <button class="cart-item-remove" title="Quitar del carrito" @click="$emit('remove', item.CARTI_id)">
            🗑️
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    item: { type: Object, required: true }
})

defineEmits(['update-quantity', 'remove'])

const nombreProducto = computed(() => props.item.producto?.PRO_name || `Producto #${props.item.PRO_id}`)
</script>

<style scoped>
.cart-item {
    display: grid;
    grid-template-columns: 72px 1fr auto auto auto;
    align-items: center;
    gap: var(--space-md);
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    box-shadow: var(--shadow-sm);
}

.cart-item-img {
    width: 72px;
    height: 72px;
    border-radius: var(--radius-md);
    background: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
}

.cart-item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cart-item-img-fallback {
    font-size: 1.75rem;
}

.cart-item-info {
    min-width: 0;
}

.cart-item-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.cart-item-brand {
    font-size: 0.8rem;
    color: var(--color-text-light);
    margin-top: 2px;
}

.cart-item-price {
    font-size: 0.85rem;
    color: var(--color-text-light);
    margin-top: 4px;
}

.cart-item-qty {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background: var(--color-bg);
    border-radius: var(--radius-full);
    padding: 0.25rem 0.5rem;
}

.qty-btn {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: none;
    background: var(--color-white);
    color: var(--color-primary);
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.qty-btn:hover:not(:disabled) {
    background: var(--color-primary);
    color: var(--color-white);
}

.qty-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.qty-value {
    min-width: 1.25rem;
    text-align: center;
    font-weight: 600;
}

.cart-item-subtotal {
    font-weight: 700;
    color: var(--color-primary);
    white-space: nowrap;
}

.cart-item-remove {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    opacity: 0.6;
    transition: var(--transition);
}

.cart-item-remove:hover {
    opacity: 1;
    transform: scale(1.1);
}

@media (max-width: 640px) {
    .cart-item {
        grid-template-columns: 56px 1fr;
        grid-template-areas:
            "img info"
            "qty subtotal"
            "qty remove";
        row-gap: var(--space-sm);
    }
    .cart-item-img { grid-area: img; width: 56px; height: 56px; }
    .cart-item-info { grid-area: info; }
    .cart-item-qty { grid-area: qty; justify-self: start; }
    .cart-item-subtotal { grid-area: subtotal; justify-self: end; }
    .cart-item-remove { grid-area: remove; justify-self: end; }
}
</style>
