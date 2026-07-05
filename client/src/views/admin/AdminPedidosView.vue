<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <h1>Gestión de Pedidos</h1>
      <p class="subtitle">Administra y haz seguimiento de las órdenes de compra.</p>

      <!-- Filtros de estado -->
      <div class="status-filters">
        <button
          v-for="estado in estados"
          :key="estado"
          @click="filtroEstado = estado"
          :class="['status-btn', { active: filtroEstado === estado }]"
        >
          {{ estado || 'Todos' }}
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
            <td>{{ orden.cliente || 'Desconocido' }}</td>
            <td>${{ orden.ORD_total }}</td>
            <td>{{ orden.metodoPago || 'N/A' }}</td>
            <td>
                <span :class="estadoClase(orden.ORD_status)">
                  {{ orden.ORD_status }}
                </span>
            </td>
            <td>
              <button @click="abrirModal(orden)" class="action-btn edit">Actualizar</button>
            </td>
          </tr>
          <tr v-if="pedidos.length === 0">
            <td colspan="7" class="empty-state">No hay pedidos</td>
          </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button @click="paginaAnterior" :disabled="page === 1">Anterior</button>
          <span>Página {{ page }} de {{ totalPages }}</span>
          <button @click="paginaSiguiente" :disabled="page === totalPages">Siguiente</button>
        </div>
      </div>
    </div>

    <!-- Modal para actualizar estado -->
    <div v-if="ordenSeleccionada" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content small">
        <h3>Actualizar Pedido</h3>
        <p>Selecciona el nuevo estado para el pedido #ORD-{{ ordenSeleccionada.ORD_id }}</p>
        <select v-model="nuevoEstado" class="filter-select" style="width:100%; margin:1rem 0;">
          <option value="pending">Pendiente</option>
          <option value="shipped">Enviado</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <div class="modal-actions">
          <button @click="cerrarModal" class="btn btn-outline">Cancelar</button>
          <button @click="guardarEstado" class="btn btn-primary">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get, put } from '../../services/api'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'

const pedidos = ref([])
const page = ref(1)
const totalPages = ref(1)
const limit = 10
const filtroEstado = ref('Todos')
const estados = ['Todos', 'pending', 'shipped', 'completed', 'cancelled']

// Modal
const ordenSeleccionada = ref(null)
const nuevoEstado = ref('')

const formatearFecha = (fecha) => {
  if (!fecha) return '—'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

const estadoClase = (estado) => {
  const clases = {
    pending: 'badge-pendiente',
    shipped: 'badge-enviado',
    completed: 'badge-entregado',
    cancelled: 'badge-cancelado'
  }
  return clases[estado] || 'badge-default'
}

const cargarPedidos = async () => {
  try {
    const params = new URLSearchParams({
      page: page.value,
      limit,
      ...(filtroEstado.value !== 'Todos' && { status: filtroEstado.value })
    })
    const res = await get(`/orders?${params}`)
    pedidos.value = res.data || []
    totalPages.value = res.totalPages || 1
  } catch (error) {
    console.error('Error cargando pedidos:', error)
  }
}

const paginaAnterior = () => {
  if (page.value > 1) { page.value--; cargarPedidos() }
}
const paginaSiguiente = () => {
  if (page.value < totalPages.value) { page.value++; cargarPedidos() }
}

const abrirModal = (orden) => {
  ordenSeleccionada.value = orden
  nuevoEstado.value = orden.ORD_status
}
const cerrarModal = () => {
  ordenSeleccionada.value = null
}

const guardarEstado = async () => {
  try {
    await put(`/orders/${ordenSeleccionada.value.ORD_id}`, { ORD_status: nuevoEstado.value })
    await cargarPedidos()
    cerrarModal()
  } catch (error) {
    console.error('Error actualizando estado:', error)
    alert('Error al actualizar el estado del pedido.')
  }
}

// Cuando cambia el filtro, recargar
import { watch } from 'vue'
watch(filtroEstado, () => {
  page.value = 1
  cargarPedidos()
})

onMounted(cargarPedidos)
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.admin-content { flex: 1; padding: 2rem; background: #f5f5f5; }
.subtitle { color: var(--color-text-light); margin-bottom: 1.5rem; }

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
.action-btn.edit { color: var(--color-primary); }
.empty-state { padding: 2rem; text-align: center; color: var(--color-text-light); }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}
.pagination button {
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: white;
  cursor: pointer;
}
.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.badge-pendiente { background: #fff3cd; color: #856404; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; }
.badge-enviado   { background: #d4edda; color: #155724; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; }
.badge-entregado { background: #d1ecf1; color: #0c5460; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; }
.badge-cancelado { background: #f8d7da; color: #721c24; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; }
.badge-default   { background: #e2e3e5; color: #383d41; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 450px;
  width: 90%;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
.btn-outline {
  background: transparent;
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
</style>
