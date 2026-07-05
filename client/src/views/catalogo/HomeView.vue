<template>
    <div class="container" style="padding: 2rem">
        <h1 style="color: var(--color-primary)">🛍️ Bienvenida a Modyn</h1>
        <p>Descubre las últimas tendencias de moda</p>
        <p>Productos disponibles: {{ productos.length }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '../../services/api'

const productos = ref([])
onMounted(async () => {
    productos.value = await get('/products')
})
</script>