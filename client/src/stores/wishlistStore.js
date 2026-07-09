import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
  // 1. Al cargar la página, intentamos recuperar los favoritos guardados previamente
  const guardados = localStorage.getItem('modyn_wishlist')
  const items = ref(guardados ? JSON.parse(guardados) : [])

  // 2. MAGIA: Cada vez que agregues o quites algo, se guardará en tu navegador automáticamente
  watch(
    items,
    (nuevosItems) => {
      localStorage.setItem('modyn_wishlist', JSON.stringify(nuevosItems))
    },
    { deep: true },
  )

  const agregar = (producto) => {
    const existe = items.value.find((i) => i.PRO_id === producto.PRO_id)
    if (!existe) items.value.push(producto)
  }

  const quitar = (PRO_id) => {
    items.value = items.value.filter((i) => i.PRO_id !== PRO_id)
  }

  const esFavorito = (PRO_id) => items.value.some((i) => i.PRO_id === PRO_id)

  return { items, agregar, quitar, esFavorito }
})
