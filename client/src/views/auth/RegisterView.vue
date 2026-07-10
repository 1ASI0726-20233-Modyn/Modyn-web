<template>
    <div class="register-page">

        <!-- Lado izquierdo - imagen -->
        <div class="register-left">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKGBTMzrsLWBJ6c8cw_8XeQE5OJ1lt71KRmsqyQXLXOj2WdL09hy8NmiLxj04nZa_h31o6Nztdo7Q5PEprYBQZWL8q-NoI-L5c0PjMPp05-maQWcObOaWptQpx-yhmz4I-gswj5z7t55l9A8rmFG6Bgk1rZyeh3HdQ5Mkkv-mTVkZDhTSC8OggSIG985VPlk-JTrNloqRyaqZ9Tgzog1VUDgk4wzWnxTxTMnfTUkxsSNBqjZoX9A5CJtlKmipGKxD9BqfsKuX0jruR" alt="Modyn Fashion" />
            <div class="register-left-overlay">
                <h2>Sé parte del<br>mundo<br>Modyn</h2>
                <p>Descubre las últimas tendencias, recibe ofertas exclusivas y únete a nuestra comunidad de amantes de la moda.</p>
            </div>
            <span class="sparkle sp1">✦</span>
            <span class="sparkle sp2">✦</span>
        </div>

        <!-- Lado derecho -->
        <div class="register-right">
            <div class="register-card">

                <!-- Flecha atrás -->
                <RouterLink to="/" class="register-back">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </RouterLink>

                <!-- Logo -->
                <div class="register-logo">
                    <img src="@/assets/logo.png" alt="Modyn" />
                </div>

                <h2 class="register-title">Únete a Modyn</h2>
                <p class="register-subtitle">Crea tu cuenta gratis y accede a beneficios exclusivos.</p>

                <!-- Error -->
                <div v-if="error" class="register-error">{{ error }}</div>
                <div v-if="exito" class="register-exito">¡Cuenta creada! Redirigiendo...</div>

                <!-- Form -->
                <form @submit.prevent="handleRegister">

                    <label>Nombre completo</label>
                    <div class="input-group">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                        </svg>
                        <input v-model="nombre" type="text" placeholder="Tu nombre completo" required />
                    </div>

                    <label>Email</label>
                    <div class="input-group">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <input v-model="email" type="email" placeholder="Tu email" required />
                    </div>

                    <label>Teléfono</label>
                    <div class="input-group">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        <input v-model="telefono" type="tel" placeholder="Tu teléfono" required />
                    </div>

                    <label>Contraseña</label>
                    <div class="input-group">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        <input
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="••••••••"
                            required
                        />
                        <svg @click="showPassword = !showPassword" class="input-toggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path v-if="showPassword" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                            <path v-else d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                    </div>

                    <label>Confirmar contraseña</label>
                    <div class="input-group">
                        <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                        <input
                            v-model="confirmPassword"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" class="btn-register" :disabled="loading">
                        {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
                    </button>

                </form>

                <p class="register-login">
                    ¿Ya tienes cuenta?
                    <RouterLink to="/login">Inicia sesión</RouterLink>
                </p>

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const auth            = useAuthStore()
const router          = useRouter()
const nombre          = ref('')
const email           = ref('')
const telefono        = ref('')
const password        = ref('')
const confirmPassword = ref('')
const showPassword    = ref(false)
const error           = ref('')
const exito           = ref(false)
const loading         = ref(false)

const handleRegister = async () => {
    error.value = ''

    if (password.value !== confirmPassword.value) {
        error.value = 'Las contraseñas no coinciden'
        return
    }

    if (password.value.length < 6) {
        error.value = 'La contraseña debe tener al menos 6 caracteres'
        return
    }

    loading.value = true
    try {
        const res = await auth.register({
            USU_name:     nombre.value,
            USU_email:    email.value,
            USU_phone:    telefono.value,
            USU_password: password.value
        })

        if (res.error) {
            error.value = res.error
        } else {
            exito.value = true
            setTimeout(() => router.push('/login'), 1500)
        }
    } catch (err) {
        error.value = 'Error al crear la cuenta'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
* { box-sizing: border-box; }

.register-page {
    display: flex;
    min-height: 100vh;
    font-family: 'Poppins', sans-serif;
}

/* ── Izquierda ── */
.register-left {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: none;
    max-height: 100vh;
}

@media (min-width: 768px) {
    .register-left { display: block; }
}

.register-left img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
}

.register-left::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to top right,
        rgba(244, 99, 122, 0.65) 0%,
        rgba(249, 168, 77, 0.35) 50%,
        rgba(244, 99, 122, 0.50) 100%
    );
    mix-blend-mode: multiply;
}

.register-left-overlay {
    position: absolute;
    bottom: 3rem;
    left: 3rem;
    color: white;
    z-index: 1;
}

.register-left-overlay h2 {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.register-left-overlay p {
    font-size: 0.95rem;
    opacity: 0.9;
    max-width: 320px;
    line-height: 1.6;
}

.sparkle {
    position: absolute;
    color: rgba(255,255,255,0.6);
    font-size: 1.2rem;
    z-index: 1;
}

.sp1 { top: 2rem; left: 2rem; }
.sp2 { bottom: 5rem; right: 2rem; color: #F9A84D; }

/* ── Derecha ── */
.register-right {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
        radial-gradient(circle at 12% 15%, rgba(244, 99, 122, 0.28) 0%, transparent 45%),
        radial-gradient(circle at 88% 85%, rgba(249, 168, 77, 0.28) 0%, transparent 50%),
        radial-gradient(circle at 90% 12%, rgba(194, 24, 91, 0.18) 0%, transparent 40%),
        linear-gradient(135deg, #FDF5F0 0%, #FDE8EC 45%, #FDF0E4 100%);
    padding: 2rem;
    overflow-y: auto;
}

/* ── Card ── */
.register-card {
    background: white;
    padding: 2rem 2rem;
    border-radius: 28px;
    box-shadow: 0 8px 40px rgba(244, 99, 122, 0.1);
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.register-back {
    display: flex;
    align-items: center;
    color: #aaa;
    text-decoration: none;
    width: fit-content;
}

.register-back svg { width: 20px; height: 20px; }
.register-back:hover { color: #F4637A; }

.register-logo {
    display: flex;
    justify-content: center;
}

.register-logo img {
    width: 120px;
    object-fit: contain;
}

.register-title {
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
    color: #2D1B1B;
    margin: 0;
}

.register-subtitle {
    text-align: center;
    color: #aaa;
    font-size: 0.85rem;
    margin: -0.25rem 0 0.25rem;
    line-height: 1.5;
}

/* Error / Exito */
.register-error {
    background: #FFEBEE;
    color: #E53935;
    padding: 0.6rem;
    border-radius: 10px;
    font-size: 0.85rem;
    text-align: center;
}

.register-exito {
    background: #E8F5E9;
    color: #2E7D32;
    padding: 0.6rem;
    border-radius: 10px;
    font-size: 0.85rem;
    text-align: center;
}

/* Form */
form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #2D1B1B;
    margin-bottom: -0.25rem;
}

.input-group {
    display: flex;
    align-items: center;
    background: #fafafa;
    border-radius: 12px;
    padding: 0.7rem 1rem;
    gap: 0.75rem;
    border: 1.5px solid #f0e0e4;
    transition: border-color 0.2s;
}

.input-group:focus-within {
    border-color: #F4637A;
    background: white;
}

.input-icon {
    width: 17px;
    height: 17px;
    color: #ccc;
    flex-shrink: 0;
}

.input-group input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: 'Poppins', sans-serif;
    font-size: 0.88rem;
    color: #3D2B2B;
}

.input-group input::placeholder { color: #ccc; }

.input-toggle {
    width: 17px;
    height: 17px;
    color: #ccc;
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.2s;
}

.input-toggle:hover { color: #F4637A; }

/* Botón */
.btn-register {
    width: 100%;
    padding: 0.85rem;
    background: linear-gradient(135deg, #C2185B, #F4637A);
    color: white;
    border: none;
    border-radius: 50px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.5rem;
}

.btn-register:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(244, 99, 122, 0.35);
}

.btn-register:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

/* Login link */
.register-login {
    text-align: center;
    font-size: 0.85rem;
    color: #aaa;
    margin: 0;
}

.register-login a {
    color: #F4637A;
    font-weight: 600;
    text-decoration: none;
}

.register-login a:hover { text-decoration: underline; }

</style>