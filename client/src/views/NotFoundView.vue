<template>
    <div class="notfound-page">
        <h1 class="notfound-code">404</h1>
        <h2 class="notfound-title">¡Ups! Parece que este estilo se nos ha escapado.</h2>
        <p class="notfound-text">La página que buscas no está en tendencia actualmente o ha cambiado de colección.</p>
        <RouterLink to="/" class="btn-home">Ir al Inicio</RouterLink>
    </div>
</template>

<script setup>
</script>

<style scoped>
.notfound-page {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    background: #FDF5F0;
    font-family: 'Poppins', sans-serif;
}

.notfound-code {
    font-size: 8rem;
    font-weight: 700;
    color: #F4637A;
    line-height: 1;
    margin-bottom: 1rem;
}

.notfound-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2D1B1B;
    max-width: 460px;
    margin-bottom: 1rem;
    line-height: 1.4;
}

.notfound-text {
    font-size: 0.95rem;
    color: #8A6A6A;
    max-width: 380px;
    line-height: 1.6;
    margin-bottom: 2rem;
}

.btn-home {
    padding: 0.85rem 2.5rem;
    background: #F4637A;
    color: white;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s;
    box-shadow: 0 4px 15px rgba(244, 99, 122, 0.3);
}

.btn-home:hover {
    background: #C2185B;
    transform: translateY(-1px);
}
</style>