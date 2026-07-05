import { get, post } from './api'

// ---- Orders ----
export const listarPedidosUsuario = (USU_id) => get(`/orders/user/${USU_id}`)

export const crearPedido = (pedido) => post('/orders', pedido)

// ---- Order detail ----
export const listarDetallePedido = (ORD_id) => get(`/order-detail/order/${ORD_id}`)

export const crearDetallePedido = (detalle) => post('/order-detail', detalle)

// ---- Payments ----
export const crearPago = (pago) => post('/payments', pago)

export const listarPagosPedido = (ORD_id) => get(`/payments/pedido/${ORD_id}`)

// ---- Shipments ----
export const crearEnvio = (envio) => post('/shipments', envio)

export const listarEnviosPedido = (ORD_id) => get(`/shipments/pedido/${ORD_id}`)

// ---- Coupons ----
export const buscarCupon = (codigo) => get(`/coupons/code/${codigo}`)

export const registrarUsoCupon = (uso) => post('/coupon-usage', uso)
