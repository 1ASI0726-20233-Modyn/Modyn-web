import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
    const items = ref([])

    const agregar = (producto) => {
        const existe = items.value.find(i => i.PRO_id === producto.PRO_id)
        if (!existe) items.value.push(producto)
    }

    const quitar = (PRO_id) => {
        items.value = items.value.filter(i => i.PRO_id !== PRO_id)
    }

    const esFavorito = (PRO_id) => items.value.some(i => i.PRO_id === PRO_id)

    return { items, agregar, quitar, esFavorito }
})