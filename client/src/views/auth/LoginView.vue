<template>
    <div class="login-page">
        <div class="login-card">
            
            <!-- Logo -->
            <div class="login-logo">
                <h1>Modyn</h1>
                <p>Inicia sesión para continuar</p>
            </div>

            <!-- Error -->
            <div v-if="error" class="login-error">
                {{ error }}
            </div>

            <!-- Form -->
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label>Email</label>
                    <input
                        v-model="email"
                        type="email"
                        class="input"
                        placeholder="tu@email.com"
                        required
                    />
                </div>

                <div class="form-group">
                    <label>Contraseña</label>
                    <input
                        v-model="password"
                        type="password"
                        class="input"
                        placeholder="Tu contraseña"
                        required
                    />
                </div>

                <button type="submit" class="btn btn-primary" :disabled="loading">
                    {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
                </button>
            </form>

            <p class="login-register">
                ¿No tienes cuenta? 
                <RouterLink to="/register">Regístrate</RouterLink>
            </p>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'

const auth     = useAuthStore()
const email    = ref('')
const password = ref('')
const error    = ref('')
const loading  = ref(false)

const handleLogin = async () => {
    loading.value = true
    error.value   = ''
    try {
        const res = await auth.login(email.value, password.value)
        if (res.error) {
            error.value = res.error
        }
    } catch (err) {
        error.value = 'Error al iniciar sesión'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
}

.login-card {
    background: var(--color-white);
    padding: 2.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.login-logo h1 {
    font-size: 2.5rem;
    color: var(--color-primary);
    text-align: center;
    font-weight: 700;
}

.login-logo p {
    text-align: center;
    color: var(--color-text-light);
    font-size: 0.9rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 500;
    font-size: 0.9rem;
    color: var(--color-text);
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.btn-primary {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    margin-top: 0.5rem;
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.login-error {
    background: #FFEBEE;
    color: var(--color-error);
    padding: 0.75rem;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    text-align: center;
}

.login-register {
    text-align: center;
    font-size: 0.9rem;
    color: var(--color-text-light);
}

.login-register a {
    color: var(--color-primary);
    font-weight: 500;
    text-decoration: none;
}
</style>