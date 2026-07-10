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

// ---- Product images ----
export const listarImagenesProducto = (PRO_id) => get(`/product-images/product/${PRO_id}`)

// Devuelve solo la URL de la primera imagen (o null), útil para miniaturas (carrito, relacionados)
export const obtenerImagenPrincipal = async (PRO_id) => {
    const imagenes = await listarImagenesProducto(PRO_id)
    const ordenadas = [...imagenes].sort((a, b) => (a.IMG_order ?? 0) - (b.IMG_order ?? 0))
    return ordenadas[0]?.IMG_url || null
}

// ---- Reviews ----
export const listarResenasProducto = (PRO_id) => get(`/reviews/product/${PRO_id}`)

export const crearResena = (resena) => post('/reviews', resena)

export const listarImagenesResena = (REV_id) => get(`/review-images/review/${REV_id}`)

export const crearImagenResena = (imagen) => post('/review-images', imagen)

// ---- Q&A ----
export const listarPreguntasProducto = (PRO_id) => get(`/qa/product/${PRO_id}`)

export const crearPregunta = (pregunta) => post('/qa', pregunta)

// ---- Relacionados ---- (misma categoría, excluyendo el producto actual)
export const listarProductosRelacionados = async (CAT_id, PRO_id_excluir, limite = 4) => {
    const productos = await listarProductos()
    return productos
        .filter((p) => p.CAT_id === CAT_id && p.PRO_id !== Number(PRO_id_excluir))
        .slice(0, limite)
}
