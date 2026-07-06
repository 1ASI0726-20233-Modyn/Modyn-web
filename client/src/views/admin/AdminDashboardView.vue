<template>
  <div class="admin-layout">
    <AdminSidebar />

    <div class="admin-content">
      <h1>Panel de Administración</h1>
      <p class="welcome">Bienvenido, {{ auth.usuario?.USU_name }}</p>

      <!-- Tarjetas de métricas principales -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>${{ metrics.totalSales.toLocaleString() }}</h3>
          <p>Ventas totales</p>
        </div>
        <div class="stat-card">
          <h3>{{ metrics.activeOrders }}</h3>
          <p>Pedidos activos</p>
        </div>
        <div class="stat-card">
          <h3>{{ metrics.totalCustomers }}</h3>
          <p>Clientes registrados</p>
        </div>
        <div class="stat-card">
          <h3>${{ metrics.monthlyRevenue.toLocaleString() }}</h3>
          <p>Ingresos del mes</p>
        </div>
      </div>

      <!-- Gráfico de ingresos mensuales (barras con CSS) -->
      <div class="chart-section">
        <h3>Ingresos mensuales</h3>
        <div v-if="monthlyRevenue.length" class="bar-chart">
          <div
            v-for="item in monthlyRevenue"
            :key="item._id.month"
            class="bar-item"
          >
            <div
              class="bar"
              :style="{
                height: (item.total / maxMonthly) * 100 + '%'
              }"
            ></div>
            <span>{{ item._id.month }}/{{ item._id.year }}</span>
          </div>
        </div>
        <p v-else class="empty-message">Aún no hay datos de ingresos mensuales.</p>
      </div>

      <!-- Ventas por categoría (opcional, pero lo añado para dar más profundidad) -->
      <div v-if="salesByCategory.length" class="category-section">
        <h3>Ventas por categoría</h3>
        <div class="category-list">
          <div
            v-for="cat in salesByCategory"
            :key="cat._id"
            class="category-item"
          >
            <span>{{ cat.categoryName || 'Sin categoría' }}</span>
            <span>${{ cat.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Tabla de pedidos recientes -->
      <div class="table-container">
        <h3>Pedidos recientes</h3>
        <table class="admin-table">
          <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Método pago</th>
            <th>Estado</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="recentOrders.length === 0">
            <td colspan="6" class="empty-state">No hay pedidos recientes</td>
          </tr>
          <tr v-for="order in recentOrders" :key="order.ORD_id">
            <td>#ORD-{{ order.ORD_id }}</td>
            <td>{{ formatearFecha(order.ORD_created_at) }}</td>
            <td>{{ order.user?.USU_name || '—' }}</td>
            <td>${{ order.ORD_total }}</td>
            <td>{{ order.payment?.PAY_method || '—' }}</td>
            <td>
                <span :class="estadoClase(order.ORD_status)">
                  {{ traducirEstado(order.ORD_status) }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'

const auth = useAuthStore()

// Estado principal
const metrics = ref({
  totalSales: 0,
  activeOrders: 0,
  totalCustomers: 0,
  monthlyRevenue: 0
})
const monthlyRevenue = ref([])
const salesByCategory = ref([])
const recentOrders = ref([])
const maxMonthly = ref(1)
const loading = ref(true)

// Funciones auxiliares
const formatearFecha = (fecha) => {
  if (!fecha) return '—'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const traducirEstado = (estado) => {
  const mapa = {
    pending: 'Pendiente',
    shipped: 'Enviado',
    completed: 'Completado',
    cancelled: 'Cancelado',
    in_transit: 'En tránsito'
  }
  return mapa[estado] || estado
}

const estadoClase = (estado) => {
  const clases = {
    pending: 'badge-pendiente',
    shipped: 'badge-enviado',
    completed: 'badge-completado',
    cancelled: 'badge-cancelado',
    in_transit: 'badge-transito'
  }
  return clases[estado] || 'badge-default'
}

// Carga de datos
const cargarDashboard = async () => {
  loading.value = true
  try {
    const [sum, monthly, categories, orders] = await Promise.all([
      get('/analytics/summary'),
      get('/analytics/monthly-revenue'),
      get('/analytics/sales-by-category'),
      get('/analytics/recent-orders')
    ])

    metrics.value = sum
    monthlyRevenue.value = monthly.slice(-6) // últimos 6 meses
    if (monthly.length) {
      const ultimos = monthly.slice(-6)
      maxMonthly.value = Math.max(...ultimos.map(m => m.total), 1)
    }
    salesByCategory.value = categories
    recentOrders.value = orders
  } catch (error) {
    console.error('Error cargando el dashboard:', error)
  } finally {
    loading.value = false
  }
}

onMounted(cargarDashboard)
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
.welcome {
  color: var(--color-text-light);
  margin-bottom: 2rem;
}

/* Tarjetas de métricas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  text-align: center;
}
.stat-card h3 {
  font-size: 2rem;
  color: var(--color-primary);
  margin: 0;
}
.stat-card p {
  margin: 0.5rem 0 0;
  color: var(--color-text-light);
}

/* Gráfico de barras */
.chart-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}
.chart-section h3 {
  margin-top: 0;
}
.bar-chart {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  height: 150px;
  margin-top: 1rem;
}
.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.bar {
  width: 100%;
  background: var(--color-primary);
  border-radius: 4px 4px 0 0;
  min-height: 5px;
  transition: height 0.4s ease;
}
.bar-item span {
  font-size: 0.7rem;
  margin-top: 0.5rem;
  color: var(--color-text-light);
}
.empty-message {
  color: var(--color-text-light);
  margin: 1rem 0;
}

/* Ventas por categoría */
.category-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}
.category-section h3 {
  margin-top: 0;
}
.category-list {
  margin-top: 0.5rem;
}
.category-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}
.category-item:last-child {
  border-bottom: none;
}

/* Tabla de pedidos recientes */
.table-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}
.table-container h3 {
  margin-top: 0;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
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
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}

/* Badges de estado */
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
.badge-transito {
  background: #cce5ff;
  color: #004085;
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

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .bar-chart {
    height: 100px;
  }
}
</style>
