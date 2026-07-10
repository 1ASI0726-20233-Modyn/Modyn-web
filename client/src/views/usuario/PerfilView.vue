<template>
    <div class="container perfil-page">
        <h1 class="page-title">Mi cuenta</h1>

        <div class="perfil-tabs">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                class="perfil-tab"
                :class="{ active: tabActiva === tab.id }"
                @click="tabActiva = tab.id"
            >
                {{ tab.label }}
            </button>
        </div>

        <!-- Mis datos -->
        <section v-if="tabActiva === 'datos'" class="perfil-card">
            <form class="perfil-form" @submit.prevent="guardarDatos">
                <div class="form-group">
                    <label>Nombre</label>
                    <input v-model="formDatos.USU_name" class="input" required />
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input :value="auth.usuario.USU_email" class="input" disabled />
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input v-model="formDatos.USU_phone" class="input" />
                </div>
                <button class="btn btn-primary" type="submit" :disabled="guardandoDatos">
                    {{ guardandoDatos ? 'Guardando...' : 'Guardar cambios' }}
                </button>
                <p v-if="mensajeDatos" class="perfil-success">{{ mensajeDatos }}</p>
            </form>
        </section>

        <!-- Direcciones -->
        <section v-if="tabActiva === 'direcciones'" class="perfil-card">
            <div v-if="direcciones.length" class="perfil-address-list">
                <div v-for="dir in direcciones" :key="dir.ADD_id" class="perfil-address-item">
                    <div>
                        <strong>{{ dir.ADD_address }}</strong>
                        <p>{{ dir.ADD_city }}, {{ dir.ADD_country }} — {{ dir.ADD_zipcode }}</p>
                    </div>
                    <button class="perfil-address-delete" @click="eliminar(dir.ADD_id)"><i class="pi pi-trash"></i></button>
                </div>
            </div>
            <p v-else class="perfil-empty">Aún no tienes direcciones guardadas.</p>

            <form class="perfil-form new-address-form" @submit.prevent="agregarDireccion">
                <div class="form-group">
                    <label>Dirección</label>
                    <input v-model="nuevaDireccion.ADD_address" class="input" required />
                </div>
                <div class="new-address-row">
                    <div class="form-group">
                        <label>Ciudad</label>
                        <input v-model="nuevaDireccion.ADD_city" class="input" required />
                    </div>
                    <div class="form-group">
                        <label>País</label>
                        <input v-model="nuevaDireccion.ADD_country" class="input" required />
                    </div>
                </div>
                <div class="form-group">
                    <label>Código postal</label>
                    <input v-model="nuevaDireccion.ADD_zipcode" class="input" required />
                </div>
                <button class="btn btn-outline" type="submit" :disabled="guardandoDireccion">
                    {{ guardandoDireccion ? 'Guardando...' : '+ Agregar dirección' }}
                </button>
            </form>
        </section>

        <!-- Pedidos -->
        <section v-if="tabActiva === 'pedidos'" class="perfil-card">
            <p v-if="cargandoPedidos" class="perfil-empty">Cargando pedidos...</p>
            <p v-else-if="!pedidos.length" class="perfil-empty">Todavía no has realizado pedidos.</p>

            <div v-else class="pedidos-list">
                <div v-for="pedido in pedidos" :key="pedido.ORD_id" class="pedido-item">
                    <button class="pedido-header" @click="pedido._abierto = !pedido._abierto">
                        <div>
                            <strong>Pedido #{{ pedido.ORD_id }}</strong>
                            <span class="pedido-date">{{ formatearFecha(pedido.ORD_created_at) }}</span>
                        </div>
                        <span class="pedido-status" :class="`status-${pedido.ORD_status}`">{{ estadoLabel(pedido.ORD_status) }}</span>
                        <span class="pedido-total">S/ {{ pedido.ORD_total.toFixed(2) }}</span>
                    </button>

                    <div v-if="pedido._abierto" class="pedido-detail">
                        <div v-for="det in pedido._detalle" :key="det.DET_id" class="pedido-detail-item">
                            <span>{{ det._nombreProducto }} × {{ det.DET_quantity }}</span>
                            <span>S/ {{ (det.DET_unit_price * det.DET_quantity).toFixed(2) }}</span>
                        </div>
                        <p v-if="pedido._pago" class="pedido-meta">Pago: {{ pedido._pago.PAY_method }} — {{ pedido._pago.PAY_status }}</p>
                        <p v-if="pedido._envio" class="pedido-meta">Envío: {{ pedido._envio.SHI_carrier }} — {{ pedido._envio.SHI_status }}</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import {
    listarDireccionesUsuario,
    crearDireccion,
    eliminarDireccion,
    actualizarUsuario
} from '../../services/usuarioService'
import {
    listarPedidosUsuario,
    listarDetallePedido,
    listarPagosPedido,
    listarEnviosPedido
} from '../../services/pedidosService'
import { obtenerProducto } from '../../services/productosService'

const auth = useAuthStore()

const tabs = [
    { id: 'datos', label: 'Mis datos' },
    { id: 'direcciones', label: 'Mis direcciones' },
    { id: 'pedidos', label: 'Mis pedidos' }
]
const tabActiva = ref('datos')

// --- Datos personales ---
const formDatos = reactive({
    USU_name: auth.usuario?.USU_name || '',
    USU_phone: auth.usuario?.USU_phone || ''
})
const guardandoDatos = ref(false)
const mensajeDatos = ref('')

const guardarDatos = async () => {
    guardandoDatos.value = true
    mensajeDatos.value = ''
    try {
        const actualizado = await actualizarUsuario(auth.usuario.USU_id, formDatos)
        auth.usuario.USU_name = actualizado.USU_name
        auth.usuario.USU_phone = actualizado.USU_phone
        localStorage.setItem('usuario', JSON.stringify(auth.usuario))
        mensajeDatos.value = 'Datos actualizados correctamente'
    } finally {
        guardandoDatos.value = false
    }
}

// --- Direcciones ---
const direcciones = ref([])
const nuevaDireccion = reactive({ ADD_address: '', ADD_city: '', ADD_country: '', ADD_zipcode: '' })
const guardandoDireccion = ref(false)

const cargarDirecciones = async () => {
    direcciones.value = await listarDireccionesUsuario(auth.usuario.USU_id)
}

const agregarDireccion = async () => {
    guardandoDireccion.value = true
    try {
        const creada = await crearDireccion({ ...nuevaDireccion, USU_id: auth.usuario.USU_id })
        direcciones.value.push(creada)
        Object.assign(nuevaDireccion, { ADD_address: '', ADD_city: '', ADD_country: '', ADD_zipcode: '' })
    } finally {
        guardandoDireccion.value = false
    }
}

const eliminar = async (ADD_id) => {
    await eliminarDireccion(ADD_id)
    direcciones.value = direcciones.value.filter((d) => d.ADD_id !== ADD_id)
}

// --- Pedidos ---
const pedidos = ref([])
const cargandoPedidos = ref(false)

const estadoLabel = (estado) => ({
    pending: 'Pendiente',
    shipped: 'Enviado',
    completed: 'Completado',
    cancelled: 'Cancelado'
}[estado] || estado)

const formatearFecha = (fecha) => fecha ? new Date(fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : ''

const cargarPedidos = async () => {
    cargandoPedidos.value = true
    try {
        const data = await listarPedidosUsuario(auth.usuario.USU_id)
        pedidos.value = await Promise.all(data.map(async (pedido) => {
            const [detalle, pagos, envios] = await Promise.all([
                listarDetallePedido(pedido.ORD_id),
                listarPagosPedido(pedido.ORD_id),
                listarEnviosPedido(pedido.ORD_id)
            ])
            const detalleConNombre = await Promise.all(detalle.map(async (d) => {
                const producto = await obtenerProducto(d.PRO_id).catch(() => null)
                return { ...d, _nombreProducto: producto?.PRO_name || `Producto #${d.PRO_id}` }
            }))
            return {
                ...pedido,
                _abierto: false,
                _detalle: detalleConNombre,
                _pago: pagos[0] || null,
                _envio: envios[0] || null
            }
        }))
    } finally {
        cargandoPedidos.value = false
    }
}

onMounted(() => {
    cargarDirecciones()
})

watch(tabActiva, (tab) => {
    if (tab === 'pedidos' && pedidos.value.length === 0) cargarPedidos()
}, { immediate: true })
</script>

<style scoped>
.perfil-page {
    padding: var(--space-2xl) var(--space-lg);
    max-width: 800px;
}

.page-title {
    font-size: 2rem;
    color: var(--color-text);
    margin-bottom: var(--space-lg);
}

.perfil-tabs {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
    border-bottom: 1px solid var(--color-border);
}

.perfil-tab {
    background: none;
    border: none;
    padding: var(--space-sm) var(--space-md);
    cursor: pointer;
    font-weight: 500;
    color: var(--color-text-light);
    border-bottom: 2px solid transparent;
    transition: var(--transition);
}

.perfil-tab.active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
}

.perfil-card {
    background: var(--color-bg-card);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
}

.perfil-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
}

.form-group label {
    font-weight: 500;
    font-size: 0.9rem;
}

.perfil-success {
    color: var(--color-success);
    font-size: 0.9rem;
}

.perfil-empty {
    color: var(--color-text-light);
}

.perfil-address-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

.perfil-address-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
}

.perfil-address-item p {
    color: var(--color-text-light);
    font-size: 0.85rem;
}

.perfil-address-delete {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
}

.new-address-form {
    padding-top: var(--space-md);
    border-top: 1px dashed var(--color-border);
}

.new-address-row {
    display: flex;
    gap: var(--space-md);
}

.new-address-row > * {
    flex: 1;
}

.pedidos-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

.pedido-item {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
}

.pedido-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md);
    background: var(--color-white);
    border: none;
    cursor: pointer;
    gap: var(--space-md);
    text-align: left;
}

.pedido-date {
    display: block;
    font-size: 0.8rem;
    color: var(--color-text-light);
}

.pedido-status {
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
}

.status-pending { background: #FFF3E0; color: var(--color-secondary); }
.status-shipped { background: #E3F2FD; color: #1976D2; }
.status-completed { background: #E8F5E9; color: var(--color-success); }
.status-cancelled { background: #FFEBEE; color: var(--color-error); }

.pedido-total {
    font-weight: 700;
    color: var(--color-primary);
}

.pedido-detail {
    padding: var(--space-md);
    background: var(--color-bg);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
}

.pedido-detail-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
}

.pedido-meta {
    font-size: 0.8rem;
    color: var(--color-text-light);
    margin-top: var(--space-xs);
}
</style>
