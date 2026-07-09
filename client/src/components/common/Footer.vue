<template>
    <footer class="footer">
        <div class="footer-inner">

            <!-- Brand -->
            <div class="footer-brand">
                <h2 class="footer-logo">Modyn</h2>
                <p>Tu destino para la moda más actual.<br>Descubre tu estilo único con nosotros.</p>
            </div>

            <!-- Enlaces -->
            <div class="footer-col">
                <h4>Enlaces</h4>
                <RouterLink to="/productos">Categorías</RouterLink>
                <RouterLink to="/tendencias">Tendencias</RouterLink>
            </div>

            <!-- Legal -->
            <div class="footer-col">
                <h4>Legal</h4>
                <a href="#">Privacidad</a>
                <a href="#">Términos</a>
            </div>

            <!-- Newsletter -->
            <div class="footer-col">
                <h4>Newsletter</h4>
                <p class="newsletter-text">Suscríbete para ofertas exclusivas.</p>
                <div class="newsletter-form">
                    <input
                        v-model="email"
                        type="email"
                        placeholder="Tu email"
                    />
                    <button @click="suscribirse">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </div>

        </div>

        <!-- Bottom -->
        <div class="footer-bottom">
            <p>© 2026 Modyn. Todos los derechos reservados.</p>
        </div>
    </footer>
</template>

<script setup>
import { ref } from 'vue'
import { post } from '../../services/api'

const email = ref('')

const suscribirse = async () => {
    if (!email.value) return
    await post('/newsletter', { NSB_email: email.value })
    email.value = ''
    alert('¡Suscrito exitosamente!')
}
</script>

<style scoped>
.footer {
    background: #1E0F0F;
    color: rgba(255,255,255,0.75);
    margin-top: auto;
    border-radius: 70px 70px 0 0;
}

.footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 1.5rem 2rem;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 3rem;
}

/* Brand */
.footer-logo {
    font-size: 1.8rem;
    font-weight: 800;
    font-style: italic;
    color: #F4637A;
    margin-bottom: 0.75rem;
    font-family: 'Poppins', sans-serif;
}

.footer-brand p {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255,255,255,0.55);
}

/* Columnas */
.footer-col {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.footer-col h4 {
    font-size: 0.95rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.4rem;
}

.footer-col a {
    text-decoration: none;
    color: rgba(255,255,255,0.6);
    font-size: 0.88rem;
    transition: color 0.2s;
}

.footer-col a:hover { color: #F4637A; }

/* Newsletter */
.newsletter-text {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.6);
}

.newsletter-form {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.08);
    border-radius: 50px;
    padding: 0.4rem 0.4rem 0.4rem 1rem;
    border: 1px solid rgba(255,255,255,0.1);
    margin-top: 0.25rem;
}

.newsletter-form input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-family: 'Poppins', sans-serif;
    font-size: 0.88rem;
}

.newsletter-form input::placeholder {
    color: rgba(255,255,255,0.35);
}

.newsletter-form button {
    background: #F4637A;
    border: none;
    border-radius: 50%;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
}

.newsletter-form button svg {
    width: 16px;
    height: 16px;
    color: white;
}

.newsletter-form button:hover {
    background: #e0536a;
}

/* Bottom */
.footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 1.25rem 1.5rem;
    text-align: center;
}

.footer-bottom p {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.4);
    font-weight: 500;
}
</style>