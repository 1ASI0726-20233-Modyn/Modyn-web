<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <h1>Panel de Administración</h1>
      <p class="welcome">Bienvenido, {{ auth.usuario?.USU_name }}</p>

      <!-- Tarjetas de métricas principales -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>{{ currency.formatear(metrics.totalSales) }}</h3>
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
          <h3>{{ currency.formatear(metrics.monthlyRevenue) }}</h3>
          <p>Ingresos del mes</p>
        </div>
      </div>

      <!-- Categoría más popular -->
      <div class="category-card">
        <h3>Categoría con más productos</h3>
        <p v-if="popularCategory">
          <strong>{{ popularCategory.categoryName }}</strong>
          ({{ popularCategory.productCount }} productos)
        </p>
        <p v-else class="empty-message">No hay categorías</p>
      </div>

      <!-- Productos más vendidos -->
      <div class="top-products-section">
        <h3>Productos más vendidos</h3>
        <div v-if="topProducts.length" class="product-list">
          <div v-for="(p, idx) in topProducts" :key="p.PRO_id" class="product-item">
            <span class="rank">#{{ idx + 1 }}</span>
            <span class="name">{{ p.PRO_name }}</span>
            <span class="units">{{ p.totalUnits }} unidades</span>
            <span class="revenue">{{ currency.formatear(p.totalRevenue) }}</span>
          </div>
        </div>
        <p v-else class="empty-message">Aún no hay ventas</p>
      </div>

      <!-- Pedidos recientes -->
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
              <td>{{ currency.formatear(order.ORD_total) }}</td>
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
import { useCurrencyStore } from '../../stores/currencyStore'

const auth = useAuthStore()
const currency = useCurrencyStore()

// Estado
const metrics = ref({
  totalSales: 0,
  activeOrders: 0,
  totalCustomers: 0,
  monthlyRevenue: 0,
})
const popularCategory = ref(null)
const topProducts = ref([])
const recentOrders = ref([])

// Funciones auxiliares
const formatearFecha = (fecha) => {
  if (!fecha) return '—'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const traducirEstado = (estado) => {
  const mapa = {
    pending: 'Pendiente',
    shipped: 'Enviado',
    completed: 'Completado',
    cancelled: 'Cancelado',
    in_transit: 'En tránsito',
  }
  return mapa[estado] || estado
}

const estadoClase = (estado) => {
  const clases = {
    pending: 'badge-pendiente',
    shipped: 'badge-enviado',
    completed: 'badge-completado',
    cancelled: 'badge-cancelado',
    in_transit: 'badge-transito',
  }
  return clases[estado] || 'badge-default'
}

// Carga de datos
const cargarDashboard = async () => {
  try {
    const [sum, category, products, orders] = await Promise.all([
      get('/analytics/summary'),
      get('/analytics/most-popular-category'),
      get('/analytics/top-products'),
      get('/analytics/recent-orders'),
    ])

    metrics.value = sum
    popularCategory.value = category
    topProducts.value = products
    recentOrders.value = orders
  } catch (error) {
    console.error('Error cargando el dashboard:', error)
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

/* Tarjetas */
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

/* Categoría popular */
.category-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}
.category-card h3 {
  margin-top: 0;
}

/* Productos más vendidos */
.top-products-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}
.top-products-section h3 {
  margin-top: 0;
}
.product-list {
  margin-top: 0.5rem;
}
.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}
.product-item:last-child {
  border-bottom: none;
}
.rank {
  font-weight: 600;
  color: var(--color-primary);
  width: 2.5rem;
}
.name {
  flex: 1;
}
.units {
  color: var(--color-text-light);
  font-size: 0.9rem;
}
.revenue {
  font-weight: 500;
  min-width: 80px;
  text-align: right;
}

/* Tabla pedidos recientes */
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
.empty-message {
  color: var(--color-text-light);
  margin: 0.5rem 0;
}

/* Badges */
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
}
</style>
