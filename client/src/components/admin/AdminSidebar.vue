<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Modyn Admin</h2>
      <button
        class="sidebar-burger"
        :class="{ active: menuAbierto }"
        @click="menuAbierto = !menuAbierto"
        aria-label="Abrir menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    <nav class="sidebar-nav" :class="{ open: menuAbierto }">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="sidebar-link"
        active-class="active-link"
        @click="menuAbierto = false"
      >
        {{ item.label }}
      </RouterLink>
      <button @click="auth.logout()" class="sidebar-logout">Cerrar sesión</button>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'

const auth = useAuthStore()
const menuAbierto = ref(false)

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
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.sidebar-title {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0;
}
.sidebar-burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 34px;
  height: 34px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}
.sidebar-burger span {
  display: block;
  width: 100%;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.25s;
}
.sidebar-burger.active span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.sidebar-burger.active span:nth-child(2) {
  opacity: 0;
}
.sidebar-burger.active span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
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
  font-family: var(--font-primary);
  font-size: 1rem;
  margin-top: 1rem;
  transition: background 0.2s;
}
.sidebar-logout:hover {
  background: rgba(255,107,107,0.15);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    min-height: auto;
    padding: 1rem 1.25rem;
  }

  .sidebar-header {
    margin-bottom: 0;
  }

  .sidebar-title {
    font-size: 1.2rem;
  }

  .sidebar-burger {
    display: flex;
  }

  .sidebar-nav {
    display: none;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 1rem;
  }

  .sidebar-nav.open {
    display: flex;
  }

  .sidebar-link,
  .sidebar-logout {
    padding: 0.65rem 0.85rem;
    font-size: 0.95rem;
    margin-top: 0;
  }
}
</style>
