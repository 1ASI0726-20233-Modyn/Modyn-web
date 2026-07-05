<template>
    <nav class="navbar">
        <div class="navbar-inner">

            <!-- Logo -->
            <RouterLink to="/" class="navbar-logo">
                <img src="@/assets/logo.png" alt="Modyn" />
            </RouterLink>

            <!-- Links -->
            <ul class="navbar-links">
                <li><RouterLink to="/" class="nav-link">Inicio</RouterLink></li>
                <li><RouterLink to="/productos" class="nav-link">Productos</RouterLink></li>
                <li><RouterLink to="/tendencias" class="nav-link">Tendencia</RouterLink></li>
            </ul>

            <!-- Acciones -->
            <div class="navbar-actions">

                <!-- Buscar -->
                <button class="icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                </button>

                <!-- Carrito -->
                <RouterLink to="/carrito" class="icon-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
                    </svg>
                    <span v-if="carrito.cantidadItems > 0" class="badge">{{ carrito.cantidadItems }}</span>
                </RouterLink>

                <!-- Auth -->
                <template v-if="!auth.isLoggedIn()">
                    <RouterLink to="/login" class="btn-entrar">Entrar</RouterLink>
                    <RouterLink to="/register" class="btn-registrarse">Registrarse</RouterLink>
                </template>
                <template v-else>
                    <RouterLink to="/perfil" class="btn-entrar">{{ auth.usuario?.USU_name }}</RouterLink>
                    <button @click="auth.logout()" class="btn-registrarse">Salir</button>
                </template>

            </div>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore }    from '../../stores/authStore'
import { useCarritoStore } from '../../stores/carritoStore'

const auth    = useAuthStore()
const carrito = useCarritoStore()
</script>

<style scoped>
.navbar {
    background: white;
    border-bottom: 1px solid #F0DDD8;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 8px rgba(244, 99, 122, 0.08);
}

.navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
}

.navbar-logo img {
    height: 36px;
    object-fit: contain;
}

.navbar-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    text-decoration: none;
    color: #3D2B2B;
    font-size: 0.95rem;
    font-weight: 500;
    transition: color 0.2s;
    padding-bottom: 2px;
}

.nav-link:hover,
.nav-link.router-link-active {
    color: #F4637A;
    border-bottom: 2px solid #F4637A;
}

.navbar-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.icon-btn {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    color: #3D2B2B;
    padding: 0.4rem;
    border-radius: 50%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    text-decoration: none;
}

.icon-btn svg {
    width: 22px;
    height: 22px;
}

.icon-btn:hover { color: #F4637A; }

.badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #F4637A;
    color: white;
    border-radius: 50%;
    font-size: 10px;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
}

.btn-entrar {
    padding: 0.4rem 1.1rem;
    border: 1.5px solid #F4637A;
    border-radius: 50px;
    color: #F4637A;
    font-size: 0.88rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
    background: transparent;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
}

.btn-entrar:hover {
    background: #F4637A;
    color: white;
}

.btn-registrarse {
    padding: 0.4rem 1.1rem;
    background: #2D1B1B;
    border: none;
    border-radius: 50px;
    color: white;
    font-size: 0.88rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
}

.btn-registrarse:hover {
    background: #F4637A;
}
</style>