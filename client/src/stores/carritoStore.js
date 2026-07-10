import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import {
    obtenerOCrearCarrito,
    listarItemsCarrito,
    agregarItemCarrito,
    actualizarItemCarrito,
    eliminarItemCarrito
} from '../services/carritoService'
import { obtenerProducto, obtenerImagenPrincipal } from '../services/productosService'

// Debe coincidir con MAX_CANTIDAD_POR_PRODUCTO en server/src/routes/carrito/cartItems.routes.js
const MAX_CANTIDAD_POR_PRODUCTO = 10

export const useCarritoStore = defineStore('carrito', () => {
    const CAR_id    = ref(null)
    const items     = ref([]) // { CARTI_id, CAR_id, PRO_id, CARTI_quantity, CARTI_price, producto }
    const cargando  = ref(false)
    const iniciado  = ref(false)

    const total = computed(() =>
        items.value.reduce((acc, item) => acc + item.CARTI_price * item.CARTI_quantity, 0)
    )

    const cantidadItems = computed(() =>
        items.value.reduce((acc, item) => acc + item.CARTI_quantity, 0)
    )

    // Crea/recupera el carrito del usuario logueado y trae sus items
    const inicializar = async () => {
        const auth = useAuthStore()
        if (!auth.usuario) return
        cargando.value = true
        try {
            const carrito = await obtenerOCrearCarrito(auth.usuario.USU_id)
            CAR_id.value = carrito.CAR_id
            await cargarItems()
            iniciado.value = true
        } finally {
            cargando.value = false
        }
    }

    const cargarItems = async () => {
        if (!CAR_id.value) return
        const data = await listarItemsCarrito(CAR_id.value)
        const enriquecidos = await Promise.all(
            (data || []).map(async (item) => {
                const [producto, imagen] = await Promise.all([
                    obtenerProducto(item.PRO_id).catch(() => null),
                    obtenerImagenPrincipal(item.PRO_id).catch(() => null)
                ])
                return { ...item, producto, imagen }
            })
        )
        items.value = enriquecidos
    }

    // producto: objeto de la tabla products (PRO_id, PRO_price, PRO_discount_price, ...)
    // imagen: URL opcional (si ya la tienes, evita otra llamada al backend)
    // Tope de cantidad para un producto: el menor entre el stock disponible y el máximo permitido
    const limiteCantidad = (producto) => {
        const stock = producto?.PRO_stock
        return typeof stock === 'number' ? Math.min(stock, MAX_CANTIDAD_POR_PRODUCTO) : MAX_CANTIDAD_POR_PRODUCTO
    }

    const agregar = async (producto, cantidad = 1, imagen = null) => {
        if (!iniciado.value) await inicializar()
        if (!CAR_id.value) return

        const precio    = producto.PRO_discount_price || producto.PRO_price
        const existente = items.value.find((i) => i.PRO_id === producto.PRO_id)

        if (existente) {
            await actualizarCantidad(existente.CARTI_id, existente.CARTI_quantity + cantidad)
        } else {
            const tope = limiteCantidad(producto)
            const cantidadFinal = Math.min(Math.max(1, cantidad), tope)
            const imagenFinal = imagen ?? await obtenerImagenPrincipal(producto.PRO_id).catch(() => null)
            const nuevo = await agregarItemCarrito({
                CAR_id: CAR_id.value,
                PRO_id: producto.PRO_id,
                CARTI_quantity: cantidadFinal,
                CARTI_price: precio
            })
            items.value.push({ ...nuevo, producto, imagen: imagenFinal })
        }
    }

    const actualizarCantidad = async (CARTI_id, cantidad) => {
        if (cantidad < 1) return quitar(CARTI_id)

        const item = items.value.find((i) => i.CARTI_id === CARTI_id)
        const tope = limiteCantidad(item?.producto)
        const cantidadFinal = Math.min(cantidad, tope)

        const actualizado = await actualizarItemCarrito(CARTI_id, { CARTI_quantity: cantidadFinal })
        if (item) item.CARTI_quantity = actualizado.CARTI_quantity
    }

    const quitar = async (CARTI_id) => {
        await eliminarItemCarrito(CARTI_id)
        items.value = items.value.filter((i) => i.CARTI_id !== CARTI_id)
    }

    const vaciar = async () => {
        await Promise.all(items.value.map((i) => eliminarItemCarrito(i.CARTI_id)))
        items.value = []
    }

    const reset = () => {
        CAR_id.value = null
        items.value = []
        iniciado.value = false
    }

    return {
        CAR_id, items, cargando, iniciado,
        total, cantidadItems,
        inicializar, cargarItems, agregar, actualizarCantidad, quitar, vaciar, reset
    }
})
