<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="navbar-logo">
        <img src="@/assets/logo.png" alt="Modyn" />
      </RouterLink>

      <ul class="navbar-links">
        <li><RouterLink to="/" class="nav-link">Inicio</RouterLink></li>
        <li><RouterLink to="/productos" class="nav-link">Productos</RouterLink></li>
        <li><RouterLink to="/tendencias" class="nav-link">Tendencia</RouterLink></li>
      </ul>

      <div class="navbar-actions">
        <div class="navbar-currency">
          <select
            class="currency-select"
            :value="currency.codigo"
            @change="currency.cambiar($event.target.value)"
            title="Moneda de visualización"
          >
            <option value="USD">USD ($) — Dólar estadounidense</option>
            <option value="PEN">PEN (S/) — Sol peruano</option>
            <option value="EUR">EUR (€) — Euro</option>
            <optgroup label="Latinoamérica">
              <option value="MXN">MXN (MX$) — Peso mexicano</option>
              <option value="COP">COP (COP$) — Peso colombiano</option>
              <option value="CLP">CLP (CLP$) — Peso chileno</option>
              <option value="ARS">ARS (AR$) — Peso argentino</option>
              <option value="BRL">BRL (R$) — Real brasileño</option>
              <option value="UYU">UYU (UY$) — Peso uruguayo</option>
              <option value="BOB">BOB (Bs) — Boliviano</option>
              <option value="PYG">PYG (₲) — Guaraní paraguayo</option>
              <option value="GTQ">GTQ (Q) — Quetzal guatemalteco</option>
              <option value="VES">VES (Bs.S) — Bolívar venezolano</option>
            </optgroup>
            <optgroup label="Asia">
              <option value="CNY">CNY (CN¥) — Yuan chino</option>
              <option value="JPY">JPY (JP¥) — Yen japonés</option>
              <option value="KRW">KRW (₩) — Won surcoreano</option>
            </optgroup>
          </select>
        </div>

        <div class="navbar-notif">
          <button class="icon-btn" @click="toggleNotif">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span v-if="notifCount > 0" class="badge">{{ notifCount }}</span>
          </button>

          <div class="notif-dropdown" v-if="notifOpen">
            <div class="notif-header">
              <h4>Notificaciones</h4>
              <button @click="marcarTodas" class="notif-clear">Marcar todas</button>
            </div>
            <div class="notif-list">
              <div v-if="notificaciones.length === 0" class="notif-empty">
                No tienes notificaciones
              </div>
              <div
                v-for="n in notificaciones"
                :key="n.NOT_id"
                :class="['notif-item', { unread: !n.NOT_read_at }]"
              >
                <span class="notif-icon">
                  {{
                    n.NOT_type === 'order'
                      ? '📦'
                      : n.NOT_type === 'promo'
                        ? '🎁'
                        : n.NOT_type === 'shipment'
                          ? '🚚'
                          : '🔔'
                  }}
                </span>
                <div class="notif-content">
                  <p>{{ n.NOT_message }}</p>
                  <span class="notif-time">{{ formatTime(n.NOT_created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RouterLink to="/wishlist" class="icon-btn" title="Mis Favoritos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span v-if="wishlist?.items?.length > 0" class="badge">{{ wishlist.items.length }}</span>
        </RouterLink>

        <RouterLink to="/carrito" class="icon-btn" title="Mi Carrito">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
          <span v-if="carrito.cantidadItems > 0" class="badge">{{ carrito.cantidadItems }}</span>
        </RouterLink>

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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useCarritoStore } from '../../stores/carritoStore'
// 1. Importamos tu store de favoritos (wishlist)
import { useWishlistStore } from '../../stores/wishlistStore'
import { useCurrencyStore } from '../../stores/currencyStore'
import { get, put } from '../../services/api'

const auth = useAuthStore()
const carrito = useCarritoStore()
// 2. Inicializamos la variable para usarla en el HTML
const wishlist = useWishlistStore()
const currency = useCurrencyStore()

const notifOpen = ref(false)
const notificaciones = ref([])
const notifCount = ref(0)

const toggleNotif = () => {
  notifOpen.value = !notifOpen.value
}

const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'hace un momento'
  if (hours < 24) return `hace ${hours}h`
  return `hace ${Math.floor(hours / 24)}d`
}

const marcarTodas = async () => {
  for (const n of notificaciones.value) {
    if (!n.NOT_read_at) {
      await put(`/notifications/${n.NOT_id}`, { NOT_read_at: new Date() })
    }
  }
  notificaciones.value = notificaciones.value.map((n) => ({ ...n, NOT_read_at: new Date() }))
  notifCount.value = 0
}

onMounted(async () => {
  if (auth.isLoggedIn() && auth.usuario?.USU_id) {
    const notifs = await get(`/notifications/user/${auth.usuario.USU_id}`)
    notificaciones.value = notifs
    notifCount.value = notifs.filter((n) => !n.NOT_read_at).length
  }
})
</script>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid #f0ddd8;
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
  color: #3d2b2b;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
  padding-bottom: 2px;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #f4637a;
  border-bottom: 2px solid #f4637a;
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
  color: #3d2b2b;
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

.icon-btn:hover {
  color: #f4637a;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #f4637a;
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

/* ── Selector de moneda ── */
.navbar-currency {
  display: flex;
  align-items: center;
}

.currency-select {
  max-width: 110px;
  border: 1.5px solid #f0ddd8;
  border-radius: 50px;
  padding: 0.35rem 0.7rem;
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: #3d2b2b;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.currency-select:hover,
.currency-select:focus {
  border-color: #f4637a;
  outline: none;
}

/* ── Notificaciones ── */
.navbar-notif {
  position: relative;
}

.notif-dropdown {
  position: absolute;
  top: 3rem;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  width: 340px;
  z-index: 200;
  overflow: hidden;
  border: 1px solid #f0ddd8;
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0ddd8;
}

.notif-header h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2d1b1b;
}

.notif-clear {
  background: none;
  border: none;
  color: #f4637a;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
}

.notif-list {
  max-height: 320px;
  overflow-y: auto;
}

.notif-empty {
  padding: 2rem;
  text-align: center;
  color: #8a6a6a;
  font-size: 0.88rem;
}

.notif-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #f9f0f0;
  transition: background 0.2s;
}

.notif-item:hover {
  background: #fff5f7;
}

.notif-item.unread {
  background: #fff0f3;
  border-left: 3px solid #f4637a;
}

.notif-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notif-content p {
  font-size: 0.85rem;
  color: #2d1b1b;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.notif-time {
  font-size: 0.75rem;
  color: #8a6a6a;
}

.btn-entrar {
  padding: 0.4rem 1.1rem;
  border: 1.5px solid #f4637a;
  border-radius: 50px;
  color: #f4637a;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  background: transparent;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
}

.btn-entrar:hover {
  background: #f4637a;
  color: white;
}

.btn-registrarse {
  padding: 0.4rem 1.1rem;
  background: #2d1b1b;
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
  background: #f4637a;
}
</style>
