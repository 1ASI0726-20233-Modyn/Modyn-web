<template>
    <div class="login-page">

        <!-- Lado izquierdo - imagen -->
        <div class="login-left">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80" alt="Modyn Fashion" />
            <div class="login-left-overlay">
                <h2>Estilo que inspira.</h2>
                <p>Descubre las últimas tendencias con Modyn.</p>
            </div>
        </div>

        <!-- Lado derecho -->
        <div class="login-right">
            <div class="login-card">

                <!-- Flecha atrás -->
                <RouterLink to="/" class="login-back">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </RouterLink>

                <!-- Logo -->
                <div class="login-logo">
                    <img src="@/assets/logo.png" alt="Modyn" />
                </div>

                <h2 class="login-title">Bienvenida de vuelta ✨</h2>
                <p class="login-subtitle">Inicia sesión para continuar</p>

                <!-- Error -->
                <div v-if="error" class="login-error">{{ error }}</div>

                <!-- Form -->
                <form @submit.prevent="handleLogin">

                    <div class="input-group">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <input
                            v-model="email"
                            type="email"
                            placeholder="Tu email"
                            required
                        />
                    </div>

                    <div class="input-group">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        <input
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="Contraseña"
                            required
                        />
                        <svg @click="showPassword = !showPassword" class="input-toggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path v-if="showPassword" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                            <path v-else d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                    </div>

                    <div class="login-forgot">
                        <a href="#">¿Olvidaste tu contraseña?</a>
                    </div>

                    <button type="submit" class="btn-login" :disabled="loading">
                        {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
                    </button>

                </form>

                <div class="login-divider">
                    <span>○</span>
                </div>

                <p class="login-register">
                    ¿No tienes cuenta?
                    <RouterLink to="/register">Regístrate</RouterLink>
                </p>

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'

const auth         = useAuthStore()
const email        = ref('')
const password     = ref('')
const error        = ref('')
const loading      = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
    loading.value = true
    error.value   = ''
    try {
        const res = await auth.login(email.value, password.value)
        if (res.error) error.value = res.error
    } catch (err) {
        error.value = 'Error al iniciar sesión'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
* { box-sizing: border-box; }

.login-page {
    display: flex;
    min-height: 100vh;
    font-family: 'Poppins', sans-serif;
}

/* ── Izquierda ── */
.login-left {
    flex: 1.5;
    position: relative;
    overflow: hidden;
    display: none;
}

@media (min-width: 768px) {
    .login-left { display: flex; }
}

.login-left img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

/* Gradiente rosa encima como en el mockup */
.login-left::after {
    content: '';
    position: absolute;
    inset: 0;
    background: 
        linear-gradient(
            to top right,
            rgba(244, 99, 122, 0.70) 0%,
            rgba(249, 168, 77, 0.40) 50%,
            rgba(244, 99, 122, 0.60) 100%
        );
    mix-blend-mode: multiply;
}

.login-left-overlay {
    position: absolute;
    bottom: 3rem;
    left: 3rem;
    color: white;
    z-index: 1;
}

.login-left-overlay h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.login-left-overlay p {
    font-size: 1rem;
    opacity: 0.9;
}

/* ── Derecha ── */
.login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg,
        #FDF5F0 0%,
        #FAE8E4 25%,
        #F9E0D8 50%,
        #FAE8E0 75%,
        #FDF5F0 100%
    );
    padding: 2rem;
}

/* ── Card ── */
.login-card {
    background: white;
    padding: 2.5rem 2.5rem;
    border-radius: 28px;
    box-shadow: 0 8px 40px rgba(244, 99, 122, 0.08);
    width: 100%;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Flecha */
.login-back {
    display: flex;
    align-items: center;
    color: #aaa;
    text-decoration: none;
    width: fit-content;
}

.login-back svg {
    width: 20px;
    height: 20px;
}

.login-back:hover { color: #F4637A; }

/* Logo */
.login-logo {
    display: flex;
    justify-content: center;
}

.login-logo img {
    width: 140px;
    object-fit: contain;
    background: transparent;
    padding: 0;
}

/* Títulos */
.login-title {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 700;
    color: #2D1B1B;
    margin: 0;
}

.login-subtitle {
    text-align: center;
    color: #aaa;
    font-size: 0.88rem;
    margin: -0.5rem 0 0;
}

/* Error */
.login-error {
    background: #FFEBEE;
    color: #E53935;
    padding: 0.75rem;
    border-radius: 10px;
    font-size: 0.88rem;
    text-align: center;
}

/* Inputs */
form {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.input-group {
    display: flex;
    align-items: center;
    background: #fafafa;
    border-radius: 12px;
    padding: 0.8rem 1rem;
    gap: 0.75rem;
    border: 1.5px solid #f0e0e4;
    transition: border-color 0.2s;
}

.input-group:focus-within {
    border-color: #F4637A;
    background: white;
}

.input-icon {
    width: 18px;
    height: 18px;
    color: #ccc;
    flex-shrink: 0;
}

.input-group input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;
    color: #3D2B2B;
}

.input-group input::placeholder { color: #ccc; }

.input-toggle {
    width: 18px;
    height: 18px;
    color: #ccc;
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.2s;
}

.input-toggle:hover { color: #F4637A; }

/* Olvidaste contraseña */
.login-forgot {
    text-align: right;
    margin-top: -0.25rem;
}

.login-forgot a {
    color: #F4637A;
    font-size: 0.82rem;
    text-decoration: none;
    font-weight: 500;
}

/* Botón */
.btn-login {
    width: 100%;
    padding: 0.9rem;
    background: linear-gradient(135deg, #C2185B, #F4637A);
    color: white;
    border: none;
    border-radius: 50px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.25rem;
}

.btn-login:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(244, 99, 122, 0.35);
}

.btn-login:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

/* Divider */
.login-divider {
    text-align: center;
    color: #ddd;
    font-size: 0.8rem;
}

/* Registro */
.login-register {
    text-align: center;
    font-size: 0.88rem;
    color: #aaa;
    margin: 0;
}

.login-register a {
    color: #F4637A;
    font-weight: 600;
    text-decoration: none;
}

.login-register a:hover { text-decoration: underline; }
</style>