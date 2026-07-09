import { get, post, put, del } from './api'

// ---- Cart ----
export const obtenerCarritosUsuario = (USU_id) => get(`/cart/user/${USU_id}`)

export const crearCarrito = (USU_id) => post('/cart', { USU_id })

// Devuelve el carrito activo del usuario, creando uno nuevo si no existe
export const obtenerOCrearCarrito = async (USU_id) => {
    const carritos = await obtenerCarritosUsuario(USU_id)
    if (Array.isArray(carritos) && carritos.length > 0) {
        return carritos[carritos.length - 1]
    }
    return await crearCarrito(USU_id)
}

// ---- Cart items ----
export const listarItemsCarrito = (CAR_id) => get(`/cart-items/cart/${CAR_id}`)

export const agregarItemCarrito = (item) => post('/cart-items', item)

export const actualizarItemCarrito = (CARTI_id, cambios) => put(`/cart-items/${CARTI_id}`, cambios)

export const eliminarItemCarrito = (CARTI_id) => del(`/cart-items/${CARTI_id}`)
