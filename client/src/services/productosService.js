import { get, post } from './api'

// ---- Products ----
export const listarProductos = () => get('/products')

export const obtenerProducto = (PRO_id) => get(`/products/${PRO_id}`)

// ---- Variants ---- (no hay endpoint de filtro por producto, se filtra en el cliente)
export const listarVariantes = () => get('/variants')

export const obtenerVariantesProducto = async (PRO_id) => {
    const variantes = await listarVariantes()
    return variantes.filter((v) => v.PRO_id === Number(PRO_id))
}

// ---- Product images ---- (misma limitación, se filtra en el cliente)
export const listarImagenesProducto = async (PRO_id) => {
    const imagenes = await get('/product-images')
    return imagenes
        .filter((img) => img.PRO_id === Number(PRO_id))
        .sort((a, b) => (a.IMG_order ?? 0) - (b.IMG_order ?? 0))
}

// ---- Reviews ----
export const listarResenasProducto = (PRO_id) => get(`/reviews/product/${PRO_id}`)

export const crearResena = (resena) => post('/reviews', resena)

export const listarImagenesResena = (REV_id) => get(`/review-images/review/${REV_id}`)

export const crearImagenResena = (imagen) => post('/review-images', imagen)

// ---- Q&A ----
export const listarPreguntasProducto = (PRO_id) => get(`/qa/product/${PRO_id}`)

export const crearPregunta = (pregunta) => post('/qa', pregunta)
