<template>
    <div id="app">
        <Navbar v-if="!isAdminRoute" />
        <main>
            <RouterView />
        </main>
        <Footer v-if="!isAdminRoute" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/common/Navbar.vue'
import Footer from './components/common/Footer.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<style>
#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
main { flex: 1; }
</style>