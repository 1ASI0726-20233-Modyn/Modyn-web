import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
    // Publicas
    { path: '/',              component: () => import('../views/catalogo/HomeView.vue') },
    { path: '/login',         component: () => import('../views/auth/LoginView.vue') },
    { path: '/register',      component: () => import('../views/auth/RegisterView.vue') },
    { path: '/productos',     component: () => import('../views/catalogo/ProductosView.vue') },
    { path: '/productos/:id', component: () => import('../views/catalogo/ProductoDetalleView.vue') },
    { path: '/tendencias',    component: () => import('../views/catalogo/TendenciasView.vue') },

    // Solo logueados
    { path: '/carrito',       component: () => import('../views/carrito/CarritoView.vue'),     meta: { requiresAuth: true } },
    { path: '/checkout',      component: () => import('../views/carrito/CheckoutView.vue'),    meta: { requiresAuth: true } },
    { path: '/perfil',        component: () => import('../views/usuario/PerfilView.vue'),      meta: { requiresAuth: true } },
    { path: '/wishlist',      component: () => import('../views/usuario/WishlistView.vue'),    meta: { requiresAuth: true } },

    // Solo admin
    { path: '/admin',                  component: () => import('../views/admin/AdminDashboardView.vue'),  meta: { requiresAdmin: true } },
    { path: '/admin/productos',        component: () => import('../views/admin/AdminProductosView.vue'),  meta: { requiresAdmin: true } },
    { path: '/admin/pedidos',          component: () => import('../views/admin/AdminPedidosView.vue'),    meta: { requiresAdmin: true } },
    { path: '/admin/analisis',         component: () => import('../views/admin/AdminAnalisisView.vue'),   meta: { requiresAdmin: true } },
    { path: '/admin/ajustes',          component: () => import('../views/admin/AdminAjustesView.vue'),    meta: { requiresAdmin: true } },

    // 404
    { path: '/:pathMatch(.*)*', component: () => import('../views/NotFoundView.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    if (to.meta.requiresAdmin) {
        auth.isAdmin() ? next() : next('/')
    } else if (to.meta.requiresAuth) {
        auth.isLoggedIn() ? next() : next('/login')
    } else {
        next()
    }
})

export default router