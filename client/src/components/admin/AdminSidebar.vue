<template>
  <div class="sidebar">
    <h2 class="sidebar-title">Modyn Admin</h2>
    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="sidebar-link"
        active-class="active-link"
      >
        {{ item.label }}
      </RouterLink>
      <button @click="auth.logout()" class="sidebar-logout">Cerrar sesión</button>
    </nav>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore'

const auth = useAuthStore()

const menuItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Productos', path: '/admin/productos' },
  { label: 'Pedidos',   path: '/admin/pedidos' },
  { label: 'Análisis',  path: '/admin/analisis' },
  { label: 'Ajustes',   path: '/admin/ajustes' }
]
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: var(--color-bg-dark);
  padding: 2rem 1.5rem;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.sidebar-title {
  color: var(--color-primary);
  margin-bottom: 2rem;
  font-weight: 600;
  font-size: 1.5rem;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.sidebar-link {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
}
.sidebar-link:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}
.active-link {
  background: rgba(255,255,255,0.15);
  color: white;
  font-weight: 500;
}
.sidebar-logout {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  text-align: left;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background 0.2s;
}
.sidebar-logout:hover {
  background: rgba(255,107,107,0.15);
}
</style>
