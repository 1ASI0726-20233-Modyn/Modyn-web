<template>
  <div class="admin-layout">
    <AdminSidebar />
    <div class="admin-content">
      <h1>Ajustes del Panel</h1>
      <p class="subtitle">Administra la configuración de tu tienda y cuenta personal.</p>

      <div class="settings-grid">
        <!-- Perfil -->
        <div class="settings-card">
          <h3>Perfil del Administrador</h3>
          <div class="form-group">
            <label>Cambiar Foto</label>
            <input type="file" accept="image/*" @change="onFileChange" />
            <small>JPG o PNG. Máx 2MB.</small>
          </div>
          <div class="form-group">
            <label>Nombre Completo</label>
            <input v-model="perfil.USU_name" class="input" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="perfil.USU_email" type="email" class="input" />
          </div>
          <div class="form-group">
            <label>Rol</label>
            <input :value="perfil.USU_role" disabled class="input" />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="perfil.USU_phone" class="input" />
          </div>
          <button @click="guardarPerfil" class="btn btn-primary">Guardar Perfil</button>
        </div>

        <!-- Configuración Tienda -->
        <div class="settings-card">
          <h3>Configuración de la Tienda</h3>
          <div class="form-group" v-for="(value, key) in tienda" :key="key">
            <label>{{ key.replace(/_/g, ' ') }}</label>
            <input v-model="tienda[key]" class="input" />
          </div>
          <button @click="guardarTienda" class="btn btn-primary">Guardar Configuración</button>
        </div>
      </div>

      <!-- Preferencias de Notificaciones -->
      <div class="settings-card" style="margin-top: 2rem;">
        <h3>Preferencias de Notificaciones</h3>
        <div v-for="pref in notificaciones" :key="pref.NPR_type" class="checkbox-group">
          <label>
            <input type="checkbox" v-model="pref.NPR_enabled" />
            {{ pref.NPR_type }}
          </label>
        </div>
        <button @click="guardarNotificaciones" class="btn btn-primary">Guardar Preferencias</button>
      </div>

      <!-- Seguridad -->
      <div class="settings-card" style="margin-top: 2rem;">
        <h3>Seguridad</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Contraseña Actual</label>
            <input v-model="password.actual" type="password" class="input" />
          </div>
          <div class="form-group">
            <label>Nueva Contraseña</label>
            <input v-model="password.nueva" type="password" class="input" />
          </div>
        </div>
        <div class="form-group">
          <label>Confirmar Nueva</label>
          <input v-model="password.confirmar" type="password" class="input" />
        </div>
        <button @click="cambiarPassword" class="btn btn-danger">Cambiar Contraseña</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get, put } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'

const auth = useAuthStore()

// Perfil (se carga desde el store)
const perfil = ref({
  USU_id: null,
  USU_name: '',
  USU_email: '',
  USU_role: '',
  USU_phone: '',
  USU_profile_image: null
})

// Configuración de tienda
const tienda = ref({
  store_name: '',
  currency: '',
  language: '',
  contact_address: '',
  tax_id: ''
})

// Preferencias de notificaciones
const notificaciones = ref([
  { NPR_type: 'order', NPR_enabled: true },
  { NPR_type: 'shipment', NPR_enabled: true },
  { NPR_type: 'promo', NPR_enabled: false },
  { NPR_type: 'review', NPR_enabled: true },
  { NPR_type: 'system', NPR_enabled: true }
])

// Seguridad
const password = ref({ actual: '', nueva: '', confirmar: '' })

// Cargar datos
const cargarDatos = async () => {
  try {
    // Perfil desde authStore
    if (auth.usuario) {
      perfil.value = { ...auth.usuario }
    }

    // Configuración de tienda
    const settings = await get('/settings')
    settings.forEach(s => {
      if (s.SET_key in tienda.value) {
        tienda.value[s.SET_key] = s.SET_value
      }
    })

    // Preferencias de notificaciones del usuario
    const prefs = await get(`/notification-preferences?USU_id=${auth.usuario?.USU_id}`)
    if (prefs.length) {
      notificaciones.value = prefs.map(p => ({
        NPR_type: p.NPR_type,
        NPR_enabled: p.NPR_enabled
      }))
    }
  } catch (error) {
    console.error('Error cargando datos:', error)
  }
}

// Guardar perfil
const guardarPerfil = async () => {
  try {
    await put(`/users/${perfil.value.USU_id}`, perfil.value)
    // Actualizar store
    auth.usuario = perfil.value
    localStorage.setItem('usuario', JSON.stringify(perfil.value))
    alert('Perfil actualizado correctamente')
  } catch (error) {
    console.error('Error guardando perfil:', error)
    alert('Error al guardar el perfil')
  }
}

// Guardar configuración tienda
const guardarTienda = async () => {
  try {
    const payload = Object.entries(tienda.value).map(([key, value]) => ({
      SET_key: key,
      SET_value: value,
      SET_group: 'tienda'
    }))
    await put('/settings', payload)
    alert('Configuración guardada correctamente')
  } catch (error) {
    console.error('Error guardando configuración:', error)
    alert('Error al guardar la configuración')
  }
}

// Guardar preferencias de notificaciones
const guardarNotificaciones = async () => {
  try {
    await put('/notification-preferences', notificaciones.value)
    alert('Preferencias guardadas correctamente')
  } catch (error) {
    console.error('Error guardando preferencias:', error)
    alert('Error al guardar las preferencias')
  }
}

// Cambiar contraseña
const cambiarPassword = async () => {
  if (password.value.nueva !== password.value.confirmar) {
    alert('Las contraseñas no coinciden')
    return
  }
  try {
    await put(`/users/${perfil.value.USU_id}/password`, {
      actual: password.value.actual,
      nueva: password.value.nueva
    })
    alert('Contraseña cambiada correctamente')
    password.value = { actual: '', nueva: '', confirmar: '' }
  } catch (error) {
    console.error('Error cambiando contraseña:', error)
    alert('Error al cambiar la contraseña')
  }
}

// Manejo de archivo de foto (simplificado)
const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Aquí podrías subir la imagen a Cloudinary y luego actualizar USU_profile_image
    alert('Funcionalidad de subida de imagen pendiente de implementar con Cloudinary.')
  }
}

onMounted(cargarDatos)
</script>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.admin-content { flex: 1; padding: 2rem; background: #f5f5f5; }
.subtitle { color: var(--color-text-light); margin-bottom: 1.5rem; }
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.settings-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}
.settings-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
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
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.checkbox-group {
  margin: 0.5rem 0;
}
.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.btn-danger:hover { background: #c82333; }
</style>
