import API_URL, { get, post, put, del, subirArchivo } from './api'

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

// Sube el archivo al backend (guarda el binario en server/uploads/products) y devuelve
// la URL absoluta lista para guardar en IMG_url. Se guarda absoluta (con API_URL incluido)
// para que el resto de la app pueda usarla tal cual, igual que las URLs externas (Unsplash).
export const subirImagenProducto = async (file) => {
    const { url } = await subirArchivo('/uploads/product-image', file, 'imagen')
    return `${API_URL}${url}`
}

// Crea el registro de la imagen en la base de datos, asociado a un producto
export const crearImagenProducto = (imagen) => post('/product-images', imagen)

export const actualizarImagenProducto = (IMG_id, cambios) => put(`/product-images/${IMG_id}`, cambios)

export const eliminarImagenProducto = (IMG_id) => del(`/product-images/${IMG_id}`)

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
