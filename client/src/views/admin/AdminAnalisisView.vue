<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <h1>Análisis de Datos</h1>
      <p class="subtitle">Administra y visualiza pagos, devoluciones y usuarios.</p>

      <!-- ====== PRODUCTOS DESTACADOS ====== -->
      <section class="section-card">
        <h3>🏆 Productos más vendidos</h3>
        <div v-if="topProducts.length" class="product-list">
          <div v-for="(p, idx) in topProducts" :key="p.PRO_id" class="product-item">
            <span class="rank">#{{ idx + 1 }}</span>
            <span class="name">{{ p.PRO_name }}</span>
            <span class="units">{{ p.totalUnits }} unidades</span>
            <span class="revenue">{{ currency.formatear(p.totalRevenue) }}</span>
          </div>
        </div>
        <p v-else class="empty-message">Aún no hay ventas para mostrar.</p>
      </section>

      <!-- ====== CATEGORÍA MÁS POPULAR ====== -->
      <section class="section-card">
        <h3>📂 Categoría con más productos</h3>
        <p v-if="popularCategory">
          <strong>{{ popularCategory.categoryName }}</strong>
          ({{ popularCategory.productCount }} productos)
        </p>
        <p v-else class="empty-message">No hay categorías registradas.</p>
      </section>

      <!-- ====== TABLA DE PAGOS ====== -->
      <section class="section-card">
        <div class="section-header">
          <h3>💳 Pagos registrados</h3>
          <button @click="abrirModalPago" class="btn btn-success">+ Agregar pago</button>
        </div>
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID Pago</th>
                <th>Pedido</th>
                <th>Método</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="payments.length === 0">
                <td colspan="6" class="empty-state">No hay pagos registrados</td>
              </tr>
              <tr v-for="p in payments" :key="p.PAY_id">
                <td>#{{ p.PAY_id }}</td>
                <td>#ORD-{{ p.ORD_id }}</td>
                <td>{{ p.PAY_method }}</td>
                <td>{{ currency.formatear(p.PAY_amount) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="p.PAY_status === 'completed' ? 'badge-completado' : 'badge-pendiente'"
                    >{{ p.PAY_status }}</span
                  >
                </td>
                <td>
                  <button @click="eliminarPago(p.PAY_id)" class="action-btn delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ====== TABLA DE DEVOLUCIONES ====== -->
      <section class="section-card">
        <div class="section-header">
          <h3>🔄 Devoluciones</h3>
          <button @click="abrirModalDevolucion" class="btn btn-success">
            + Agregar devolución
          </button>
        </div>
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID Devolución</th>
                <th>Pedido</th>
                <th>Motivo</th>
                <th>Reembolso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="returns.length === 0">
                <td colspan="6" class="empty-state">No hay devoluciones registradas</td>
              </tr>
              <tr v-for="r in returns" :key="r.RET_id">
                <td>#{{ r.RET_id }}</td>
                <td>#ORD-{{ r.ORD_id }}</td>
                <td>
                  {{ r.RET_reason?.substring(0, 30) }}{{ r.RET_reason?.length > 30 ? '…' : '' }}
                </td>
                <td>{{ currency.formatear(r.RET_refund_amount) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="
                      r.RET_status === 'approved'
                        ? 'badge-completado'
                        : r.RET_status === 'rejected'
                          ? 'badge-cancelado'
                          : 'badge-pendiente'
                    "
                    >{{ r.RET_status }}</span
                  >
                </td>
                <td>
                  <button @click="eliminarDevolucion(r.RET_id)" class="action-btn delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ====== TABLA DE USUARIOS ====== -->
      <section class="section-card">
        <div class="section-header">
          <h3>👤 Usuarios registrados</h3>
          <button @click="abrirModalUsuario" class="btn btn-success">+ Agregar usuario</button>
        </div>
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="users.length === 0">
                <td colspan="6" class="empty-state">No hay usuarios registrados</td>
              </tr>
              <tr v-for="u in users" :key="u.USU_id">
                <td>#{{ u.USU_id }}</td>
                <td>{{ u.USU_name }}</td>
                <td>{{ u.USU_email }}</td>
                <td>{{ u.USU_role }}</td>
                <td>
                  <span
                    class="badge"
                    :class="u.USU_status === 'activo' ? 'badge-completado' : 'badge-cancelado'"
                    >{{ u.USU_status }}</span
                  >
                </td>
                <td>
                  <button @click="eliminarUsuario(u.USU_id)" class="action-btn delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- ====== MODALES PARA CREAR ====== -->
    <!-- Modal Pago -->
    <div v-if="modalPago" class="modal-overlay" @click.self="modalPago = false">
      <div class="modal-content">
        <h3>Registrar nuevo pago</h3>
        <form @submit.prevent="crearPago">
          <div class="form-group">
            <label>ID del pedido (ORD_id)</label>
            <input v-model.number="nuevoPago.ORD_id" type="number" class="input" required />
          </div>
          <div class="form-group">
            <label>Método</label>
            <select v-model="nuevoPago.PAY_method" class="input" required>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Yape">Yape</option>
              <option value="Plin">Plin</option>
              <option value="Paypal">Paypal</option>
            </select>
          </div>
          <div class="form-group">
            <label>Monto</label>
            <input
              v-model.number="nuevoPago.PAY_amount"
              type="number"
              step="0.01"
              class="input"
              required
            />
          </div>
          <div class="form-group">
            <label>Estado</label>
            <select v-model="nuevoPago.PAY_status" class="input" required>
              <option value="pending">Pendiente</option>
              <option value="completed">Completado</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="modalPago = false" class="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Devolución -->
    <div v-if="modalDevolucion" class="modal-overlay" @click.self="modalDevolucion = false">
      <div class="modal-content">
        <h3>Registrar nueva devolución</h3>
        <form @submit.prevent="crearDevolucion">
          <div class="form-group">
            <label>ID del pedido (ORD_id)</label>
            <input v-model.number="nuevaDevolucion.ORD_id" type="number" class="input" required />
          </div>
          <div class="form-group">
            <label>Motivo</label>
            <textarea v-model="nuevaDevolucion.RET_reason" class="input" required></textarea>
          </div>
          <div class="form-group">
            <label>Monto a reembolsar</label>
            <input
              v-model.number="nuevaDevolucion.RET_refund_amount"
              type="number"
              step="0.01"
              class="input"
              required
            />
          </div>
          <div class="form-group">
            <label>Estado</label>
            <select v-model="nuevaDevolucion.RET_status" class="input" required>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="modalDevolucion = false" class="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Usuario -->
    <div v-if="modalUsuario" class="modal-overlay" @click.self="modalUsuario = false">
      <div class="modal-content">
        <h3>Registrar nuevo usuario</h3>
        <form @submit.prevent="crearUsuario">
          <div class="form-group">
            <label>USU_id (numérico)</label>
            <input v-model.number="nuevoUsuario.USU_id" type="number" class="input" required />
          </div>
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="nuevoUsuario.USU_name" class="input" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="nuevoUsuario.USU_email" type="email" class="input" required />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input v-model="nuevoUsuario.USU_password" type="text" class="input" required />
          </div>
          <div class="form-group">
            <label>Rol</label>
            <select v-model="nuevoUsuario.USU_role" class="input" required>
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="nuevoUsuario.USU_phone" class="input" />
          </div>
          <div class="form-group">
            <label>Estado</label>
            <select v-model="nuevoUsuario.USU_status" class="input" required>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="modalUsuario = false" class="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get, post, del } from '../../services/api'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import { useCurrencyStore } from '../../stores/currencyStore'

const currency = useCurrencyStore()

// =============================================
// Estado
// =============================================
const topProducts = ref([])
const popularCategory = ref(null)
const payments = ref([])
const returns = ref([])
const users = ref([])

// Modales
const modalPago = ref(false)
const modalDevolucion = ref(false)
const modalUsuario = ref(false)

// Formularios
const nuevoPago = ref({ ORD_id: null, PAY_method: 'Tarjeta', PAY_amount: 0, PAY_status: 'pending' })
const nuevaDevolucion = ref({
  ORD_id: null,
  RET_reason: '',
  RET_refund_amount: 0,
  RET_status: 'pending',
})
const nuevoUsuario = ref({
  USU_id: null,
  USU_name: '',
  USU_email: '',
  USU_password: '',
  USU_role: 'cliente',
  USU_phone: '',
  USU_status: 'activo',
})

// =============================================
// Carga de datos
// =============================================
const cargarDatos = async () => {
  try {
    const [top, cat, pays, rets, usrs] = await Promise.all([
      get('/analytics/top-products'),
      get('/analytics/most-popular-category'),
      get('/payments'),
      get('/returns'),
      get('/users'),
    ])
    topProducts.value = top
    popularCategory.value = cat
    payments.value = pays
    returns.value = rets
    users.value = usrs
  } catch (error) {
    console.error('Error cargando datos de análisis:', error)
  }
}

// =============================================
// CRUD Pagos
// =============================================
const crearPago = async () => {
  try {
    await post('/payments', nuevoPago.value)
    await cargarDatos()
    modalPago.value = false
    nuevoPago.value = { ORD_id: null, PAY_method: 'Tarjeta', PAY_amount: 0, PAY_status: 'pending' }
  } catch (error) {
    console.error('Error creando pago:', error)
    alert('Error al crear el pago')
  }
}

const eliminarPago = async (id) => {
  if (!confirm('¿Eliminar este pago?')) return
  try {
    await del(`/payments/${id}`)
    await cargarDatos()
  } catch (error) {
    console.error('Error eliminando pago:', error)
    alert('Error al eliminar el pago')
  }
}

// =============================================
// CRUD Devoluciones
// =============================================
const crearDevolucion = async () => {
  try {
    await post('/returns', nuevaDevolucion.value)
    await cargarDatos()
    modalDevolucion.value = false
    nuevaDevolucion.value = {
      ORD_id: null,
      RET_reason: '',
      RET_refund_amount: 0,
      RET_status: 'pending',
    }
  } catch (error) {
    console.error('Error creando devolución:', error)
    alert('Error al crear la devolución')
  }
}

const eliminarDevolucion = async (id) => {
  if (!confirm('¿Eliminar esta devolución?')) return
  try {
    await del(`/returns/${id}`)
    await cargarDatos()
  } catch (error) {
    console.error('Error eliminando devolución:', error)
    alert('Error al eliminar la devolución')
  }
}

// =============================================
// CRUD Usuarios
// =============================================
const crearUsuario = async () => {
  try {
    await post('/users', nuevoUsuario.value)
    await cargarDatos()
    modalUsuario.value = false
    nuevoUsuario.value = {
      USU_id: null,
      USU_name: '',
      USU_email: '',
      USU_password: '',
      USU_role: 'cliente',
      USU_phone: '',
      USU_status: 'activo',
    }
  } catch (error) {
    console.error('Error creando usuario:', error)
    alert('Error al crear el usuario')
  }
}

const eliminarUsuario = async (id) => {
  if (!confirm('¿Eliminar este usuario?')) return
  try {
    await del(`/users/${id}`)
    await cargarDatos()
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    alert('Error al eliminar el usuario')
  }
}

// =============================================
// Lifecycle
// =============================================
onMounted(cargarDatos)
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.admin-content {
  flex: 1;
  padding: 2rem;
  background: #f5f5f5;
}
.subtitle {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
}

.section-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.section-header h3 {
  margin: 0;
}

/* Productos destacados */
.product-list {
  margin-top: 0.5rem;
}
.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}
.product-item:last-child {
  border-bottom: none;
}
.rank {
  font-weight: 600;
  color: var(--color-primary);
  width: 2.5rem;
}
.name {
  flex: 1;
}
.units {
  color: var(--color-text-light);
  font-size: 0.9rem;
}
.revenue {
  font-weight: 500;
  min-width: 80px;
  text-align: right;
}

/* Tablas */
.table-container {
  overflow: auto;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
}
.admin-table th {
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
}
.admin-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}
.empty-message {
  color: var(--color-text-light);
  margin: 0.5rem 0;
}

/* Badges */
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}
.badge-pendiente {
  background: #fff3cd;
  color: #856404;
}
.badge-completado {
  background: #d4edda;
  color: #155724;
}
.badge-cancelado {
  background: #f8d7da;
  color: #721c24;
}
.badge-enviado {
  background: #d1ecf1;
  color: #0c5460;
}

/* Botones */
.btn-success {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.btn-success:hover {
  background: #218838;
}
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
}
.action-btn.delete {
  color: #dc3545;
}
.action-btn.delete:hover {
  text-decoration: underline;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
}
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
.btn {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}
.btn-primary {
  background: var(--color-primary);
  color: white;
}
.btn-primary:hover {
  background: #e0536a;
}
.btn-outline {
  background: transparent;
  border: 1px solid var(--color-border);
}
.btn-outline:hover {
  background: #f5f5f5;
}
</style>
