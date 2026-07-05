import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCarritoStore = defineStore('carrito', () => {
    const items = ref([])

    const total = computed(() =>
        items.value.reduce((acc, item) => acc + item.CARTI_price * item.CARTI_quantity, 0)
    )

    const cantidadItems = computed(() =>
        items.value.reduce((acc, item) => acc + item.CARTI_quantity, 0)
    )

    const agregar = (producto) => {
        const existe = items.value.find(i => i.PRO_id === producto.PRO_id)
        if (existe) {
            existe.CARTI_quantity++
        } else {
            items.value.push({ ...producto, CARTI_quantity: 1 })
        }
    }

    const quitar = (PRO_id) => {
        items.value = items.value.filter(i => i.PRO_id !== PRO_id)
    }

    const vaciar = () => { items.value = [] }

    return { items, total, cantidadItems, agregar, quitar, vaciar }
})