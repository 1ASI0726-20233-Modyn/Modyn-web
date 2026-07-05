<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <h1>Análisis de Ventas</h1>
      <p class="subtitle">Resumen del rendimiento de tu tienda.</p>

      <!-- Métricas -->
      <div class="metrics-grid">
        <div class="metric-card">
          <h2>${{ metricas.ingresosTotales.toLocaleString() }}</h2>
          <p>Ingresos Totales</p>
        </div>
        <div class="metric-card">
          <h2>${{ metricas.pedidoPromedio.toFixed(2) }}</h2>
          <p>Pedido Promedio</p>
        </div>
        <div class="metric-card">
          <h2>{{ metricas.tasaConversion.toFixed(1) }}%</h2>
          <p>Tasa de Conversión</p>
        </div>
        <div class="metric-card">
          <h2>{{ metricas.devoluciones.toFixed(1) }}%</h2>
          <p>Devoluciones</p>
        </div>
      </div>

      <!-- Productos Destacados -->
      <h3 style="margin-top: 2rem;">Productos Destacados</h3>
      <div class="table-container">
        <table class="admin-table">
          <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Unidades</th>
            <th>Ingresos</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="p in topProducts" :key="p.PRO_id">
            <td>{{ p.PRO_name }}</td>
            <td>{{ obtenerCategoria(p.CAT_id) }}</td>
            <td>{{ p.unidades }}</td>
            <td>${{ p.ingresos.toLocaleString() }}</td>
          </tr>
          <tr v-if="topProducts.length === 0">
            <td colspan="4" class="empty-state">Cargando datos...</td>
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
import AdminSidebar from '../../components/admin/AdminSidebar.vue'

const metricas = ref({
  ingresosTotales: 0,
  pedidoPromedio: 0,
  tasaConversion: 0,
  devoluciones: 0
})
const topProducts = ref([])
const categorias = ref([])

const obtenerCategoria = (id) => {
  const cat = categorias.value.find(c => c.CAT_id === id)
  return cat ? cat.CAT_name : '—'
}

const cargarAnalytics = async () => {
  try {
    const [sales, products, cats] = await Promise.all([
      get('/analytics/sales'),
      get('/analytics/top-products'),
      get('/categories')
    ])
    metricas.value = sales
    topProducts.value = products
    categorias.value = cats
  } catch (error) {
    console.error('Error cargando analytics:', error)
  }
}

onMounted(cargarAnalytics)
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.admin-content { flex: 1; padding: 2rem; background: #f5f5f5; }
.subtitle { color: var(--color-text-light); margin-bottom: 1.5rem; }

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}
.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: var(--shadow-sm);
}
.metric-card h2 {
  color: var(--color-primary);
  margin: 0;
}
.metric-card p {
  margin: 0.5rem 0 0;
  color: var(--color-text-light);
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
.empty-state { padding: 2rem; text-align: center; color: var(--color-text-light); }
</style>
