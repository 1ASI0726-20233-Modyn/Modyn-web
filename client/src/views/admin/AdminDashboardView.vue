<template>
    <div style="display: flex; min-height: 100vh">

        <!-- Sidebar -->
        <div style="width: 250px; background: var(--color-bg-dark); padding: 2rem; color: white">
            <h2 style="color: var(--color-primary); margin-bottom: 2rem">Modyn Admin</h2>
            <nav style="display: flex; flex-direction: column; gap: 1rem">
                <RouterLink to="/admin" style="color: white; text-decoration: none">Dashboard</RouterLink>
                <RouterLink to="/admin/productos" style="color: white; text-decoration: none">Productos</RouterLink>
                <RouterLink to="/admin/pedidos" style="color: white; text-decoration: none">Pedidos</RouterLink>
                <RouterLink to="/admin/analisis" style="color: white; text-decoration: none">Análisis</RouterLink>
                <RouterLink to="/admin/ajustes" style="color: white; text-decoration: none">Ajustes</RouterLink>
                <button @click="auth.logout()" style="color: red; background: none; border: none; cursor: pointer; text-align: left; margin-top: 2rem">Cerrar sesión</button>
            </nav>
        </div>

        <!-- Contenido -->
        <div style="flex: 1; padding: 2rem; background: #f5f5f5">
            <h1>Panel de Administración</h1>
            <p style="color: gray">Bienvenido, {{ auth.usuario?.USU_name }}</p>

            <!-- Stats -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 2rem">
                <div class="card">
                    <h3 style="color: var(--color-primary)">{{ stats.productos }}</h3>
                    <p>Productos</p>
                </div>
                <div class="card">
                    <h3 style="color: var(--color-primary)">{{ stats.usuarios }}</h3>
                    <p>Usuarios</p>
                </div>
                <div class="card">
                    <h3 style="color: var(--color-primary)">{{ stats.pedidos }}</h3>
                    <p>Pedidos</p>
                </div>
                <div class="card">
                    <h3 style="color: var(--color-primary)">{{ stats.categorias }}</h3>
                    <p>Categorías</p>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'

const auth  = useAuthStore()
const stats = ref({ productos: 0, usuarios: 0, pedidos: 0, categorias: 0 })

onMounted(async () => {
    const [productos, usuarios, pedidos, categorias] = await Promise.all([
        get('/products'),
        get('/users'),
        get('/orders'),
        get('/categories')
    ])
    stats.value = {
        productos:  productos.length,
        usuarios:   usuarios.length,
        pedidos:    pedidos.length,
        categorias: categorias.length
    }
})
</script>