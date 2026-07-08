import { get, put, post, del } from './api'

// ---- Users ----
export const obtenerUsuario = (USU_id) => get(`/users/${USU_id}`)

export const actualizarUsuario = (USU_id, datos) => put(`/users/${USU_id}`, datos)

// ---- Addresses ----
export const listarDireccionesUsuario = (USU_id) => get(`/addresses/user/${USU_id}`)

export const crearDireccion = (direccion) => post('/addresses', direccion)

export const actualizarDireccion = (ADD_id, datos) => put(`/addresses/${ADD_id}`, datos)

export const eliminarDireccion = (ADD_id) => del(`/addresses/${ADD_id}`)
