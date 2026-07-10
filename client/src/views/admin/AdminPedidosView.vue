<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <div class="header-bar">
        <div>
          <h1>Gestión de Pedidos</h1>
          <p class="subtitle">Administra y haz seguimiento de las órdenes de compra.</p>
        </div>
        <button @click="abrirModalCrear" class="btn btn-success">+ Crear Pedido</button>
      </div>

      <!-- Filtros de estado -->
      <div class="status-filters">
        <button
          v-for="estado in estados"
          :key="estado"
          @click="filtroEstado = estado"
          :class="['status-btn', { active: filtroEstado === estado }]"
        >
          {{ traducirEstado(estado) }}
        </button>
      </div>

      <!-- Tabla con paginación -->
      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Orden ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Método Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="orden in pedidos" :key="orden.ORD_id">
              <td>#ORD-{{ orden.ORD_id }}</td>
              <td>{{ formatearFecha(orden.ORD_created_at) }}</td>
              <td>{{ orden.user?.USU_name || '—' }}</td>
              <td>{{ currency.formatear(orden.ORD_total) }}</td>
              <td>{{ orden.payment?.PAY_method || '—' }}</td>
              <td>
                <span :class="estadoClase(orden.ORD_status)">
                  {{ traducirEstado(orden.ORD_status) }}
                </span>
              </td>
              <td>
                <button @click="abrirModalActualizar(orden)" class="action-btn edit">
                  Actualizar
                </button>
                <button @click="eliminarPedido(orden)" class="action-btn delete">Eliminar</button>
              </td>
            </tr>
            <tr v-if="pedidos.length === 0">
              <td colspan="7" class="empty-state">No hay pedidos que coincidan con los filtros</td>
            </tr>
          </tbody>
        </table>

        <!-- Paginación mejorada -->
        <div class="pagination">
          <span class="info">
            Mostrando {{ (page - 1) * limit + 1 }} - {{ Math.min(page * limit, total) }} de
            {{ total }} pedidos
          </span>
          <div class="controls">
            <button @click="paginaAnterior" :disabled="page === 1" class="page-btn">
              ◀ Anterior
            </button>
            <span class="page-info">Página {{ page }} de {{ totalPages }}</span>
            <button @click="paginaSiguiente" :disabled="page === totalPages" class="page-btn">
              Siguiente ▶
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== MODAL ACTUALIZAR ESTADO ====== -->
    <div v-if="ordenSeleccionada" class="modal-overlay" @click.self="cerrarModalActualizar">
      <div class="modal-content small">
        <h3>Actualizar Pedido</h3>
        <p>
          Selecciona el nuevo estado para el pedido
          <strong>#ORD-{{ ordenSeleccionada.ORD_id }}</strong>
        </p>
        <select v-model="nuevoEstado" class="input" style="width: 100%; margin: 1rem 0">
          <option value="pending">Pendiente</option>
          <option value="shipped">Enviado</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <div class="modal-actions">
          <button @click="cerrarModalActualizar" class="btn btn-outline">Cancelar</button>
          <button @click="guardarEstado" class="btn btn-primary">Guardar</button>
        </div>
      </div>
    </div>

    <!-- ====== MODAL CREAR PEDIDO ====== -->
    <div v-if="mostrarModalCrear" class="modal-overlay" @click.self="mostrarModalCrear = false">
      <div class="modal-content">
        <h3>Crear Nuevo Pedido</h3>
        <form @submit.prevent="crearPedido">
          <div class="form-group">
            <label>ID del usuario (USU_id)</label>
            <input v-model.number="nuevoPedido.USU_id" type="number" class="input" required />
          </div>
          <div class="form-group">
            <label>Total</label>
            <input
              v-model.number="nuevoPedido.ORD_total"
              type="number"
              step="0.01"
              class="input"
              required
            />
          </div>
          <div class="form-group">
            <label>Estado</label>
            <select v-model="nuevoPedido.ORD_status" class="input" required>
              <option value="pending">Pendiente</option>
              <option value="shipped">Enviado</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div class="form-group">
            <label>Método de pago (opcional)</label>
            <select v-model="nuevoPedido.PAY_method" class="input">
              <option value="">— Sin pago —</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Yape">Yape</option>
              <option value="Plin">Plin</option>
              <option value="Paypal">Paypal</option>
            </select>
          </div>
          <div class="form-group">
            <label>Monto del pago (si se registra)</label>
            <input
              v-model.number="nuevoPedido.PAY_amount"
              type="number"
              step="0.01"
              class="input"
            />
          </div>
          <div class="modal-actions">
            <button type="button" @click="mostrarModalCrear = false" class="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">Crear Pedido</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { get, post, put, del } from '../../services/api'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import { useCurrencyStore } from '../../stores/currencyStore'

const currency = useCurrencyStore()

// =============================================
// Estado
// =============================================
const pedidos = ref([])
const page = ref(1)
const total = ref(0)
const totalPages = ref(1)
const limit = 10
const filtroEstado = ref('Todos')

const estados = ['Todos', 'pending', 'shipped', 'completed', 'cancelled']

// Modal actualizar
const ordenSeleccionada = ref(null)
const nuevoEstado = ref('')

// Modal crear
const mostrarModalCrear = ref(false)
const nuevoPedido = ref({
  USU_id: null,
  ORD_total: 0,
  ORD_status: 'pending',
  PAY_method: '',
  PAY_amount: 0,
})

// =============================================
// Funciones auxiliares
// =============================================
const traducirEstado = (estado) => {
  const mapa = {
    Todos: 'Todos',
    pending: 'Pendiente',
    shipped: 'Enviado',
    completed: 'Completado',
    cancelled: 'Cancelado',
  }
  return mapa[estado] || estado
}

const formatearFecha = (fecha) => {
  if (!fecha) return '—'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const estadoClase = (estado) => {
  const clases = {
    pending: 'badge-pendiente',
    shipped: 'badge-enviado',
    completed: 'badge-completado',
    cancelled: 'badge-cancelado',
  }
  return clases[estado] || 'badge-default'
}

// =============================================
// Carga de pedidos
// =============================================
const cargarPedidos = async () => {
  try {
    const params = new URLSearchParams({
      page: page.value,
      limit,
      ...(filtroEstado.value !== 'Todos' && { status: filtroEstado.value }),
    })
    const res = await get(`/orders?${params}`)
    pedidos.value = res.data || []
    total.value = res.total || 0
    totalPages.value = res.totalPages || 1
  } catch (error) {
    console.error('Error cargando pedidos:', error)
  }
}

const paginaAnterior = () => {
  if (page.value > 1) {
    page.value--
    cargarPedidos()
  }
}
const paginaSiguiente = () => {
  if (page.value < totalPages.value) {
    page.value++
    cargarPedidos()
  }
}

// =============================================
// Actualizar estado
// =============================================
const abrirModalActualizar = (orden) => {
  ordenSeleccionada.value = orden
  nuevoEstado.value = orden.ORD_status
}
const cerrarModalActualizar = () => {
  ordenSeleccionada.value = null
}

const guardarEstado = async () => {
  try {
    await put(`/orders/${ordenSeleccionada.value.ORD_id}`, { ORD_status: nuevoEstado.value })
    await cargarPedidos()
    cerrarModalActualizar()
  } catch (error) {
    console.error('Error actualizando estado:', error)
    alert('Error al actualizar el estado del pedido.')
  }
}

// =============================================
// Crear pedido
// =============================================
const abrirModalCrear = () => {
  nuevoPedido.value = {
    USU_id: null,
    ORD_total: 0,
    ORD_status: 'pending',
    PAY_method: '',
    PAY_amount: 0,
  }
  mostrarModalCrear.value = true
}

const crearPedido = async () => {
  try {
    // 1. Crear la orden
    const orderPayload = {
      USU_id: nuevoPedido.value.USU_id,
      ORD_total: nuevoPedido.value.ORD_total,
      ORD_status: nuevoPedido.value.ORD_status,
    }
    const orderRes = await post('/orders', orderPayload)
    const ordId = orderRes.ORD_id

    // 2. Si se especificó método de pago, crear pago
    if (nuevoPedido.value.PAY_method) {
      await post('/payments', {
        ORD_id: ordId,
        PAY_method: nuevoPedido.value.PAY_method,
        PAY_amount: nuevoPedido.value.ORD_total,
        PAY_status: nuevoPedido.value.ORD_status === 'completed' ? 'completed' : 'pending',
      })
    }

    await cargarPedidos()
    mostrarModalCrear.value = false
    alert('Pedido creado exitosamente')
  } catch (error) {
    console.error('Error creando pedido:', error)
    alert('Error al crear el pedido: ' + (error.response?.data?.error || error.message))
  }
}

// =============================================
// Eliminar pedido
// =============================================
const eliminarPedido = async (orden) => {
  if (!confirm(`¿Eliminar el pedido #ORD-${orden.ORD_id}?`)) return
  try {
    await del(`/orders/${orden.ORD_id}`)
    await cargarPedidos()
  } catch (error) {
    console.error('Error eliminando pedido:', error)
    alert('Error al eliminar el pedido.')
  }
}

// =============================================
// Watchers y lifecycle
// =============================================
watch(filtroEstado, () => {
  page.value = 1
  cargarPedidos()
})

onMounted(cargarPedidos)
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.admin-content {
  flex: 1;
  padding: 2rem;
  background: #f5f5f5;
}
.subtitle {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}
.header-bar h1 {
  margin: 0;
}

.btn-success {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
}
.btn-success:hover {
  background: #218838;
}

.status-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.status-btn {
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}
.status-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: auto;
  box-shadow: var(--shadow-sm);
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}
.admin-table th {
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
}
.admin-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
}
.action-btn.edit {
  color: var(--color-primary);
}
.action-btn.delete {
  color: #dc3545;
}
.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-light);
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}
.pagination .info {
  color: var(--color-text-light);
  font-size: 0.9rem;
}
.pagination .controls {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.page-btn {
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: white;
  cursor: pointer;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-info {
  font-size: 0.9rem;
  color: var(--color-text);
}

.badge-pendiente {
  background: #fff3cd;
  color: #856404;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}
.badge-enviado {
  background: #d4edda;
  color: #155724;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}
.badge-completado {
  background: #d1ecf1;
  color: #0c5460;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}
.badge-cancelado {
  background: #f8d7da;
  color: #721c24;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}
.badge-default {
  background: #e2e3e5;
  color: #383d41;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-content.small {
  max-width: 420px;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}
.input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  font-family: var(--font-primary);
  font-size: 0.95rem;
  transition: var(--transition);
  background: white;
}
.input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(244, 99, 122, 0.15);
}
.btn {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-primary);
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
}
.btn-primary {
  background: var(--color-primary);
  color: white;
}
.btn-primary:hover {
  background: #e0536a;
  box-shadow: var(--shadow-md);
}
.btn-outline {
  background: transparent;
  border: 1.5px solid var(--color-border);
  color: var(--color-text);
}
.btn-outline:hover {
  background: #f5f5f5;
}
</style>
