<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <h1>Panel de Administración</h1>
      <p class="welcome">Bienvenido, {{ auth.usuario?.USU_name }}</p>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>{{ stats.productos }}</h3>
          <p>Productos</p>
        </div>
        <div class="stat-card">
          <h3>{{ stats.usuarios }}</h3>
          <p>Usuarios</p>
        </div>
        <div class="stat-card">
          <h3>{{ stats.pedidos }}</h3>
          <p>Pedidos</p>
        </div>
        <div class="stat-card">
          <h3>{{ stats.categorias }}</h3>
          <p>Categorías</p>
        </div>
      </div>

      <div style="margin-top: 2rem; background: white; padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow-sm);">
        <h3>Resumen rápido</h3>
        <p>Aquí puedes agregar gráficos o más métricas provenientes de <code>/analytics/sales</code>.</p>
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
const stats = ref({ productos: 0, usuarios: 0, pedidos: 0, categorias: 0 })

const cargarEstadisticas = async () => {
  try {
    const [productos, usuarios, pedidos, categorias] = await Promise.all([
      get('/products'),
      get('/users'),
      get('/orders'),
      get('/categories')
    ])
    stats.value = {
      productos: productos.length || 0,
      usuarios:  usuarios.length || 0,
      pedidos:   pedidos.length || 0,
      categorias: categorias.length || 0
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

onMounted(cargarEstadisticas)
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
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
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
</style>
