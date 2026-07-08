<template>
    <div class="container checkout-page">
        <h1 class="page-title">Finalizar compra</h1>

        <div v-if="carrito.cargando" class="checkout-loading">Cargando...</div>

        <div v-else-if="pedidoConfirmado" class="checkout-success">
            <span class="checkout-success-icon">🎉</span>
            <h2>¡Tu pedido ha sido confirmado!</h2>
            <p>Número de pedido: <strong>#{{ pedidoConfirmado.ORD_id }}</strong></p>
            <p>Te avisaremos cuando esté en camino.</p>
            <RouterLink to="/perfil" class="btn btn-primary">Ver mis pedidos</RouterLink>
        </div>

        <div v-else-if="carrito.items.length === 0" class="checkout-empty">
            <p>No tienes productos en tu carrito.</p>
            <RouterLink to="/productos" class="btn btn-primary">Ir a productos</RouterLink>
        </div>

        <div v-else class="checkout-layout">
            <div class="checkout-form">

                <!-- Direcciones -->
                <section class="checkout-section">
                    <h2>1. Dirección de envío</h2>

                    <div v-if="direcciones.length" class="address-list">
                        <label
                            v-for="dir in direcciones"
                            :key="dir.ADD_id"
                            class="address-option"
                            :class="{ selected: ADD_id === dir.ADD_id }"
                        >
                            <input type="radio" :value="dir.ADD_id" v-model="ADD_id" />
                            <div>
                                <strong>{{ dir.ADD_address }}</strong>
                                <p>{{ dir.ADD_city }}, {{ dir.ADD_country }} — {{ dir.ADD_zipcode }}</p>
                            </div>
                        </label>
                    </div>
                    <p v-else class="checkout-hint">Aún no tienes direcciones guardadas.</p>

                    <button
                        v-if="!mostrarFormDireccion"
                        type="button"
                        class="btn btn-outline"
                        @click="mostrarFormDireccion = true"
                    >
                        + Agregar nueva dirección
                    </button>

                    <form v-else class="new-address-form" @submit.prevent="guardarDireccion">
                        <input v-model="nuevaDireccion.ADD_address" class="input" placeholder="Dirección" required />
                        <div class="new-address-row">
                            <input v-model="nuevaDireccion.ADD_city" class="input" placeholder="Ciudad" required />
                            <input v-model="nuevaDireccion.ADD_country" class="input" placeholder="País" required />
                        </div>
                        <input v-model="nuevaDireccion.ADD_zipcode" class="input" placeholder="Código postal" required />
                        <div class="new-address-row">
                            <button type="submit" class="btn btn-primary" :disabled="guardandoDireccion">
                                {{ guardandoDireccion ? 'Guardando...' : 'Guardar dirección' }}
                            </button>
                            <button type="button" class="btn btn-outline" @click="mostrarFormDireccion = false">Cancelar</button>
                        </div>
                    </form>
                </section>

                <!-- Metodo de pago -->
                <section class="checkout-section">
                    <h2>2. Método de pago</h2>
                    <div class="payment-options">
                        <label
                            v-for="metodo in metodosPago"
                            :key="metodo"
                            class="payment-option"
                            :class="{ selected: PAY_method === metodo }"
                        >
                            <input type="radio" :value="metodo" v-model="PAY_method" />
                            {{ metodo }}
                        </label>
                    </div>
                </section>

                <p v-if="errorGeneral" class="checkout-error">{{ errorGeneral }}</p>
            </div>

            <CartSummary
                :subtotal="carrito.total"
                :descuento="descuento"
                mostrar-cupon
                :cupon-aplicado="!!cuponInfo"
                :cargando-cupon="cargandoCupon"
                :error-cupon="errorCupon"
                action-label="Confirmar pedido"
                :disabled="procesando || !ADD_id || !PAY_method"
                @apply-coupon="aplicarCupon"
                @action="confirmarPedido"
            >
                <p class="checkout-processing" v-if="procesando">Procesando tu pedido...</p>
            </CartSummary>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useCarritoStore } from '../../stores/carritoStore'
import CartSummary from '../../components/carrito/CartSummary.vue'
import {
    listarDireccionesUsuario,
    crearDireccion
} from '../../services/usuarioService'
import { buscarCupon, crearPedido, crearDetallePedido, crearPago, crearEnvio, registrarUsoCupon } from '../../services/pedidosService'

const auth    = useAuthStore()
const carrito = useCarritoStore()

const direcciones          = ref([])
const ADD_id                = ref(null)
const mostrarFormDireccion  = ref(false)
const guardandoDireccion    = ref(false)
const nuevaDireccion        = ref({ ADD_address: '', ADD_city: '', ADD_country: '', ADD_zipcode: '' })

const metodosPago = ['Tarjeta', 'Yape', 'Plin', 'Paypal']
const PAY_method  = ref('')

const cuponInfo    = ref(null)
const descuento    = ref(0)
const cargandoCupon = ref(false)
const errorCupon   = ref('')

const procesando     = ref(false)
const errorGeneral   = ref('')
const pedidoConfirmado = ref(null)

onMounted(async () => {
    if (!carrito.iniciado) await carrito.inicializar()
    if (auth.usuario) {
        direcciones.value = await listarDireccionesUsuario(auth.usuario.USU_id)
        if (direcciones.value.length) ADD_id.value = direcciones.value[0].ADD_id
    }
})

const guardarDireccion = async () => {
    guardandoDireccion.value = true
    try {
        const creada = await crearDireccion({ ...nuevaDireccion.value, USU_id: auth.usuario.USU_id })
        direcciones.value.push(creada)
        ADD_id.value = creada.ADD_id
        mostrarFormDireccion.value = false
        nuevaDireccion.value = { ADD_address: '', ADD_city: '', ADD_country: '', ADD_zipcode: '' }
    } finally {
        guardandoDireccion.value = false
    }
}

const aplicarCupon = async (codigo) => {
    errorCupon.value = ''
    cargandoCupon.value = true
    try {
        const cupon = await buscarCupon(codigo)
        if (!cupon || !cupon.COU_id) {
            errorCupon.value = 'Cupón no válido'
            return
        }
        if (cupon.COU_expires_at && new Date(cupon.COU_expires_at) < new Date()) {
            errorCupon.value = 'Este cupón ha expirado'
            return
        }
        if (cupon.COU_min_purchase && carrito.total < cupon.COU_min_purchase) {
            errorCupon.value = `Compra mínima de S/ ${cupon.COU_min_purchase.toFixed(2)} para usar este cupón`
            return
        }
        descuento.value = cupon.COU_discount_type === 'percentage'
            ? carrito.total * (cupon.COU_discount_value / 100)
            : Math.min(cupon.COU_discount_value, carrito.total)
        cuponInfo.value = cupon
    } catch {
        errorCupon.value = 'No se pudo validar el cupón'
    } finally {
        cargandoCupon.value = false
    }
}

const confirmarPedido = async () => {
    if (!ADD_id.value || !PAY_method.value) {
        errorGeneral.value = 'Selecciona dirección y método de pago'
        return
    }
    errorGeneral.value = ''
    procesando.value = true
    try {
        const total = Math.max(carrito.total - descuento.value, 0)

        const pedido = await crearPedido({
            USU_id: auth.usuario.USU_id,
            COU_id: cuponInfo.value?.COU_id || null,
            ORD_total: total,
            ORD_status: 'pending'
        })

        await Promise.all(carrito.items.map((item) => crearDetallePedido({
            ORD_id: pedido.ORD_id,
            PRO_id: item.PRO_id,
            DET_quantity: item.CARTI_quantity,
            DET_unit_price: item.CARTI_price
        })))

        await crearPago({
            ORD_id: pedido.ORD_id,
            PAY_method: PAY_method.value,
            PAY_amount: total,
            PAY_status: 'completed',
            PAY_paid_at: new Date()
        })

        await crearEnvio({
            ORD_id: pedido.ORD_id,
            ADD_id: ADD_id.value,
            SHI_carrier: 'Olva Courier',
            SHI_status: 'shipped'
        })

        if (cuponInfo.value) {
            await registrarUsoCupon({
                COU_id: cuponInfo.value.COU_id,
                USU_id: auth.usuario.USU_id,
                ORD_id: pedido.ORD_id
            })
        }

        await carrito.vaciar()
        pedidoConfirmado.value = pedido
    } catch (err) {
        errorGeneral.value = 'Ocurrió un error al procesar tu pedido. Inténtalo de nuevo.'
    } finally {
        procesando.value = false
    }
}
</script>

<style scoped>
.checkout-page {
    padding: var(--space-2xl) var(--space-lg);
}

.page-title {
    font-size: 2rem;
    color: var(--color-text);
    margin-bottom: var(--space-xl);
}

.checkout-loading,
.checkout-empty {
    text-align: center;
    color: var(--color-text-light);
    padding: var(--space-2xl) 0;
}

.checkout-success {
    text-align: center;
    padding: var(--space-2xl) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
}

.checkout-success-icon {
    font-size: 3rem;
}

.checkout-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: var(--space-xl);
    align-items: start;
}

.checkout-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
}

.checkout-section {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.checkout-section h2 {
    font-size: 1.1rem;
    color: var(--color-text);
}

.checkout-hint {
    color: var(--color-text-light);
    font-size: 0.9rem;
}

.address-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

.address-option {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
    padding: var(--space-md);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
}

.address-option.selected {
    border-color: var(--color-primary);
    background: rgba(244, 99, 122, 0.05);
}

.address-option p {
    color: var(--color-text-light);
    font-size: 0.85rem;
}

.new-address-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

.new-address-row {
    display: flex;
    gap: var(--space-sm);
}

.new-address-row > * {
    flex: 1;
}

.payment-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
}

.payment-option {
    padding: var(--space-sm) var(--space-lg);
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.9rem;
}

.payment-option.selected {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: var(--color-white);
}

.payment-option input {
    display: none;
}

.checkout-error {
    background: #FFEBEE;
    color: var(--color-error);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
}

.checkout-processing {
    text-align: center;
    font-size: 0.85rem;
    color: var(--color-text-light);
}

@media (max-width: 900px) {
    .checkout-layout {
        grid-template-columns: 1fr;
    }
}
</style>
