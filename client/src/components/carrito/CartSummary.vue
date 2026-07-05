<template>
    <aside class="cart-summary">
        <h2 class="cart-summary-title">Resumen del pedido</h2>

        <div v-if="mostrarCupon" class="cart-summary-coupon">
            <input
                v-model="codigoCupon"
                type="text"
                class="input"
                placeholder="Código de cupón"
                :disabled="cuponAplicado"
                @keyup.enter="aplicar"
            />
            <button
                class="btn btn-outline"
                type="button"
                :disabled="!codigoCupon || cargandoCupon || cuponAplicado"
                @click="aplicar"
            >
                {{ cuponAplicado ? 'Aplicado ✓' : (cargandoCupon ? '...' : 'Aplicar') }}
            </button>
        </div>
        <p v-if="errorCupon" class="cart-summary-coupon-error">{{ errorCupon }}</p>

        <div class="cart-summary-rows">
            <div class="cart-summary-row">
                <span>Subtotal</span>
                <span>S/ {{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="cart-summary-row" v-if="descuento > 0">
                <span>Descuento</span>
                <span class="cart-summary-discount">− S/ {{ descuento.toFixed(2) }}</span>
            </div>
            <div class="cart-summary-row">
                <span>Envío</span>
                <span>{{ envio > 0 ? `S/ ${envio.toFixed(2)}` : 'Gratis' }}</span>
            </div>
        </div>

        <div class="cart-summary-total">
            <span>Total</span>
            <span>S/ {{ total.toFixed(2) }}</span>
        </div>

        <button
            class="btn btn-primary cart-summary-action"
            type="button"
            :disabled="disabled"
            @click="$emit('action')"
        >
            {{ actionLabel }}
        </button>

        <slot />
    </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    subtotal:      { type: Number, default: 0 },
    descuento:     { type: Number, default: 0 },
    envio:         { type: Number, default: 0 },
    mostrarCupon:  { type: Boolean, default: false },
    cuponAplicado: { type: Boolean, default: false },
    cargandoCupon: { type: Boolean, default: false },
    errorCupon:    { type: String, default: '' },
    actionLabel:   { type: String, default: 'Proceder al pago' },
    disabled:      { type: Boolean, default: false }
})

const emit = defineEmits(['action', 'apply-coupon'])

const codigoCupon = ref('')

const total = computed(() => Math.max(props.subtotal - props.descuento + props.envio, 0))

const aplicar = () => {
    if (!codigoCupon.value) return
    emit('apply-coupon', codigoCupon.value.trim().toUpperCase())
}
</script>

<style scoped>
.cart-summary {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    height: fit-content;
    position: sticky;
    top: var(--space-lg);
}

.cart-summary-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-text);
}

.cart-summary-coupon {
    display: flex;
    gap: var(--space-sm);
}

.cart-summary-coupon .input {
    flex: 1;
}

.cart-summary-coupon-error {
    color: var(--color-error);
    font-size: 0.8rem;
    margin-top: -0.5rem;
}

.cart-summary-rows {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--color-border);
}

.cart-summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: var(--color-text-light);
}

.cart-summary-discount {
    color: var(--color-success);
    font-weight: 600;
}

.cart-summary-total {
    display: flex;
    justify-content: space-between;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-text);
}

.cart-summary-total span:last-child {
    color: var(--color-primary);
}

.cart-summary-action {
    width: 100%;
    padding: 0.85rem;
    font-size: 1rem;
}

.cart-summary-action:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
