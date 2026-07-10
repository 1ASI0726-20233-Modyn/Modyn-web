<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <h1>Gestión de Productos</h1>
      <p class="subtitle">Administra el inventario, categorías y estado de la tienda.</p>

      <!-- Filtros -->
      <div class="filters">
        <select v-model="filtroCategoria" class="filter-select">
          <option value="">Todas las Categorías</option>
          <option v-for="cat in categorias" :key="cat.CAT_id" :value="cat.CAT_id">
            {{ cat.CAT_name }}
          </option>
        </select>
        <select v-model="filtroEstado" class="filter-select">
          <option value="">Todos los Estados</option>
          <option value="in_stock">En stock</option>
          <option value="low_stock">Poco stock</option>
          <option value="out_of_stock">Agotado</option>
        </select>
        <button @click="cargarProductos" class="btn btn-primary">Filtrar</button>
        <button @click="abrirModalCrear" class="btn btn-success">+ Crear Nuevo Producto</button>
      </div>

      <!-- Tabla -->
      <div class="table-container">
        <table class="admin-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="p in productosFiltrados" :key="p.PRO_id">
            <td>#{{ p.PRO_id }}</td>
            <td>
              <strong>{{ p.PRO_name }}</strong><br />
              <small class="sku">{{ p.PRO_brand || 'Sin marca' }}</small>
            </td>
            <td>{{ currency.formatear(p.PRO_price) }}</td>
            <td>{{ p.PRO_stock }}</td>
            <td>
                <span :class="estadoClase(p.PRO_stock)">
                  {{ estadoTexto(p.PRO_stock) }}
                </span>
            </td>
            <td>
              <button @click="abrirModalEditar(p)" class="action-btn edit">Editar</button>
              <button @click="eliminarProducto(p)" class="action-btn delete">Eliminar</button>
            </td>
          </tr>
          <tr v-if="productosFiltrados.length === 0">
            <td colspan="6" class="empty-state">No hay productos que coincidan con los filtros</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal de creación / edición -->
      <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content">
          <h2>{{ productoEditando ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
          <p v-if="productoEditando" class="modal-subtitle">
            Editando producto #{{ productoEditando.PRO_id }}
          </p>

          <form @submit.prevent="guardarProducto">
            <!-- Solo mostrar PRO_id en modo edición (solo lectura) -->
            <div v-if="productoEditando" class="form-group">
              <label>ID del Producto (solo lectura)</label>
              <input :value="productoEditando.PRO_id" disabled class="input" />
            </div>

            <div class="form-group">
              <label>Nombre *</label>
              <input v-model="formulario.PRO_name" required class="input" />
            </div>

            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="formulario.PRO_description" rows="3" class="input"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Precio * (en soles, S/)</label>
                <input v-model.number="formulario.PRO_price" type="number" step="0.01" required class="input" />
              </div>
              <div class="form-group">
                <label>Precio en descuento</label>
                <input v-model.number="formulario.PRO_discount_price" type="number" step="0.01" class="input" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Stock *</label>
                <input v-model.number="formulario.PRO_stock" type="number" required class="input" />
              </div>
              <div class="form-group">
                <label>Marca</label>
                <input v-model="formulario.PRO_brand" class="input" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Categoría *</label>
                <select v-model.number="formulario.CAT_id" required class="input">
                  <option value="">Selecciona...</option>
                  <option v-for="cat in categorias" :key="cat.CAT_id" :value="cat.CAT_id">
                    {{ cat.CAT_name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Proveedor</label>
                <select v-model.number="formulario.SUP_id" class="input">
                  <option value="">Selecciona...</option>
                  <option v-for="sup in proveedores" :key="sup.SUP_id" :value="sup.SUP_id">
                    {{ sup.SUP_name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Imágenes del producto</label>
              <div class="imagenes-grid">
                <div v-for="(img, idx) in imagenes" :key="img.IMG_id ?? `nueva-${idx}`" class="imagen-thumb">
                  <img :src="img.IMG_url" :alt="`Imagen ${idx + 1}`" />
                  <button
                    type="button"
                    class="imagen-thumb-remove"
                    title="Quitar imagen"
                    @click="quitarImagen(idx)"
                  >✕</button>
                </div>

                <label class="imagen-upload-btn" :class="{ disabled: subiendoImagen }">
                  <span v-if="subiendoImagen">Subiendo...</span>
                  <span v-else>+ Agregar</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    :disabled="subiendoImagen"
                    @change="onSeleccionArchivos"
                    hidden
                  />
                </label>
              </div>
              <p class="imagenes-hint">Puedes subir varias imágenes (JPG, PNG, WEBP — máx. 5MB c/u). La primera se usa como imagen principal.</p>
            </div>

            <div class="modal-actions">
              <button type="button" @click="cerrarModal" class="btn btn-outline">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="subiendoImagen">
                {{ productoEditando ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { get, post, put, del } from '../../services/api'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import { useCurrencyStore } from '../../stores/currencyStore'
import {
  listarImagenesProducto,
  subirImagenProducto,
  crearImagenProducto,
  eliminarImagenProducto
} from '../../services/productosService'

const currency = useCurrencyStore()

// --- Estado ---
const productos = ref([])
const categorias = ref([])
const proveedores = ref([])
const filtroCategoria = ref('')
const filtroEstado = ref('')

// Modal
const mostrarModal = ref(false)
const productoEditando = ref(null)
const formulario = ref({
  PRO_name: '',
  PRO_description: '',
  PRO_price: 0,
  PRO_discount_price: null,
  PRO_stock: 0,
  PRO_brand: '',
  CAT_id: null,
  SUP_id: null
})

// Imágenes del producto que se está creando/editando.
// { IMG_id: number|null, IMG_url, IMG_order } — IMG_id es null mientras no exista en la
// base de datos (caso: producto nuevo, todavía sin PRO_id al momento de subir la imagen)
const imagenes = ref([])
const subiendoImagen = ref(false)

// --- Computed ---
const productosFiltrados = computed(() => {
  return productos.value.filter((p) => {
    const matchCategoria = filtroCategoria.value
      ? p.CAT_id === parseInt(filtroCategoria.value)
      : true

    const matchEstado = (() => {
      if (!filtroEstado.value) return true
      if (filtroEstado.value === 'in_stock') return p.PRO_stock > 10
      if (filtroEstado.value === 'low_stock') return p.PRO_stock > 0 && p.PRO_stock <= 10
      if (filtroEstado.value === 'out_of_stock') return p.PRO_stock === 0
      return true
    })()

    return matchCategoria && matchEstado
  })
})

// --- Métodos de estado ---
const estadoClase = (stock) => {
  if (stock === 0) return 'badge-danger'
  if (stock <= 10) return 'badge-warning'
  return 'badge-success'
}

const estadoTexto = (stock) => {
  if (stock === 0) return 'Agotado'
  if (stock <= 10) return 'Poco stock'
  return 'En stock'
}

// --- Carga de datos ---
const cargarProductos = async () => {
  try {
    const data = await get('/products')
    productos.value = data
  } catch (error) {
    console.error('Error cargando productos:', error)
  }
}

const cargarCategorias = async () => {
  try {
    const data = await get('/categories')
    categorias.value = data
  } catch (error) {
    console.error('Error cargando categorías:', error)
  }
}

const cargarProveedores = async () => {
  try {
    const data = await get('/suppliers')
    proveedores.value = data
  } catch (error) {
    console.error('Error cargando proveedores:', error)
  }
}

// --- Modal ---
const abrirModalCrear = () => {
  productoEditando.value = null
  formulario.value = {
    PRO_name: '',
    PRO_description: '',
    PRO_price: 0,
    PRO_discount_price: null,
    PRO_stock: 0,
    PRO_brand: '',
    CAT_id: null,
    SUP_id: null
  }
  imagenes.value = []
  mostrarModal.value = true
}

const abrirModalEditar = async (producto) => {
  productoEditando.value = producto
  formulario.value = { ...producto }
  mostrarModal.value = true

  imagenes.value = []
  try {
    const existentes = await listarImagenesProducto(producto.PRO_id)
    imagenes.value = [...existentes].sort((a, b) => (a.IMG_order ?? 0) - (b.IMG_order ?? 0))
  } catch (error) {
    console.error('Error cargando imágenes del producto:', error)
  }
}

const cerrarModal = () => {
  mostrarModal.value = false
  productoEditando.value = null
  imagenes.value = []
}

// --- Imágenes ---
const onSeleccionArchivos = async (event) => {
  const archivos = Array.from(event.target.files || [])
  if (!archivos.length) return

  subiendoImagen.value = true
  try {
    for (const archivo of archivos) {
      const IMG_url = await subirImagenProducto(archivo)

      // Si el producto ya existe (edición), persistimos la imagen de inmediato.
      // Si es un producto nuevo (todavía sin PRO_id), la dejamos en memoria y se
      // crea en la base de datos recién cuando se guarde el producto (ver guardarProducto).
      if (productoEditando.value?.PRO_id) {
        const creada = await crearImagenProducto({
          PRO_id: productoEditando.value.PRO_id,
          IMG_url,
          IMG_order: imagenes.value.length
        })
        imagenes.value.push(creada)
      } else {
        imagenes.value.push({ IMG_id: null, IMG_url, IMG_order: imagenes.value.length })
      }
    }
  } catch (error) {
    console.error('Error subiendo imagen:', error)
    alert('No se pudo subir una de las imágenes. Revisa la consola.')
  } finally {
    subiendoImagen.value = false
    event.target.value = '' // permite volver a seleccionar el mismo archivo si hace falta
  }
}

const quitarImagen = async (idx) => {
  const img = imagenes.value[idx]
  if (img.IMG_id) {
    if (!confirm('¿Quitar esta imagen del producto?')) return
    try {
      await eliminarImagenProducto(img.IMG_id)
    } catch (error) {
      console.error('Error eliminando imagen:', error)
      alert('No se pudo eliminar la imagen.')
      return
    }
  }
  imagenes.value.splice(idx, 1)
}

// --- Guardar (crear / editar) ---
const guardarProducto = async () => {
  try {
    const payload = { ...formulario.value }

    if (productoEditando.value) {
      // Edición: enviar PUT con el PRO_id existente. Las imágenes ya se
      // persistieron de inmediato al subirlas (ver onSeleccionArchivos).
      await put(`/products/${payload.PRO_id}`, payload)
    } else {
      // Creación: NO enviar PRO_id, el backend lo genera automáticamente
      delete payload.PRO_id
      const nuevoProducto = await post('/products', payload)

      // Recién ahora existe un PRO_id: creamos los registros de las imágenes
      // que se subieron mientras el producto todavía no existía.
      for (const [index, img] of imagenes.value.entries()) {
        await crearImagenProducto({
          PRO_id: nuevoProducto.PRO_id,
          IMG_url: img.IMG_url,
          IMG_order: index
        })
      }
    }

    await cargarProductos()
    cerrarModal()
  } catch (error) {
    console.error('Error guardando producto:', error)
    alert('Error al guardar el producto. Revisa la consola.')
  }
}

// --- Eliminar ---
const eliminarProducto = async (producto) => {
  if (!confirm(`¿Eliminar "${producto.PRO_name}"?`)) return
  try {
    await del(`/products/${producto.PRO_id}`)
    await cargarProductos()
  } catch (error) {
    console.error('Error eliminando producto:', error)
    alert('Error al eliminar el producto.')
  }
}

// --- Lifecycle ---
onMounted(() => {
  cargarProductos()
  cargarCategorias()
  cargarProveedores()
})
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

/* Filtros */
.filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: white;
  font-family: var(--font-primary);
}

.btn-success {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
}

.btn-success:hover {
  background: #218838;
}

/* Tabla */
.table-container {
  background: white;
  border-radius: 12px;
  overflow: auto;
  box-shadow: var(--shadow-sm);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.admin-table th {
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-text);
}

.admin-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.sku {
  color: var(--color-text-light);
  font-size: 0.8rem;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.6rem;
  font-size: 0.9rem;
  transition: var(--transition);
}

.action-btn.edit {
  color: var(--color-primary);
}

.action-btn.edit:hover {
  text-decoration: underline;
}

.action-btn.delete {
  color: #dc3545;
}

.action-btn.delete:hover {
  text-decoration: underline;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-light);
}

/* Badges */
.badge-success {
  background: #d4edda;
  color: #155724;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.badge-warning {
  background: #fff3cd;
  color: #856404;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.badge-danger {
  background: #f8d7da;
  color: #721c24;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-subtitle {
  color: var(--color-text-light);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  font-family: var(--font-primary);
  font-size: 0.95rem;
  transition: var(--transition);
  background: white;
}

.input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(244, 99, 122, 0.15);
}

.input:disabled {
  background: #f0f0f0;
  color: #888;
  cursor: not-allowed;
}

textarea.input {
  resize: vertical;
  min-height: 80px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Imágenes */
.imagenes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.imagen-thumb {
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: 8px;
  overflow: hidden;
  border: 1.5px solid var(--color-border);
  flex-shrink: 0;
}

.imagen-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.imagen-thumb-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  font-size: 0.7rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.imagen-thumb-remove:hover {
  background: #dc3545;
}

.imagen-upload-btn {
  width: 84px;
  height: 84px;
  flex-shrink: 0;
  border: 1.5px dashed var(--color-border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-text-light);
  cursor: pointer;
  transition: var(--transition);
  padding: 0.25rem;
}

.imagen-upload-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.imagen-upload-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.imagenes-hint {
  font-size: 0.78rem;
  color: var(--color-text-light);
  margin-top: 0.4rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-primary);
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: #e0536a;
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background: transparent;
  border: 1.5px solid var(--color-border);
  color: var(--color-text);
}

.btn-outline:hover {
  background: #f5f5f5;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-direction: column;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .admin-layout {
    flex-direction: column;
  }

  .admin-content {
    padding: 1.25rem;
  }
}
</style>
