<template>
    <div class="container" style="padding: 2rem">
        <h1>Bienvenidos a Modyn</h1>
        <p>Productos cargados: {{ productos.length }}</p>
        <div v-for="p in productos" :key="p.PRO_id">
            <p>{{ p.PRO_name }} - ${{ p.PRO_price }}</p>
        </div>
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