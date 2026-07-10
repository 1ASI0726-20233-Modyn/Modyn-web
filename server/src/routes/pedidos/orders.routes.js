const { Router } = require("express");
const router = Router();
const Order = require("../../models/Order");
const { crearNotificacion } = require("../../utils/notify");

const MENSAJES_ESTADO = {
    pending:   "Tu pedido #ORD-{id} fue registrado y está pendiente de confirmación.",
    shipped:   "Tu pedido #ORD-{id} ha sido enviado.",
    completed: "Tu pedido #ORD-{id} fue completado. ¡Gracias por tu compra!",
    cancelled: "Tu pedido #ORD-{id} fue cancelado."
};

// GET - Listar pedidos con paginación, filtros y datos de usuario/pago
router.get("/", async (req, res) => {
    try {
        // 1. Obtener parámetros de consulta
        const { status, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (status && status !== 'Todos') filter.ORD_status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // 2. Agregación para obtener pedidos con datos de usuario y pago
        const orders = await Order.aggregate([
            { $match: filter },
            { $sort: { ORD_created_at: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) },
            // Obtener datos del usuario
            {
                $lookup: {
                    from: "users",
                    localField: "USU_id",
                    foreignField: "USU_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            // Obtener datos del pago
            {
                $lookup: {
                    from: "payments",
                    localField: "ORD_id",
                    foreignField: "ORD_id",
                    as: "payment"
                }
            },
            { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },
            // Proyectar solo los campos necesarios
            {
                $project: {
                    ORD_id: 1,
                    ORD_created_at: 1,
                    ORD_total: 1,
                    ORD_status: 1,
                    "user.USU_name": 1,
                    "payment.PAY_method": 1,
                    "payment.PAY_status": 1
                }
            }
        ]);

        // 3. Contar total de pedidos que coinciden con el filtro
        const total = await Order.countDocuments(filter);

        // 4. Responder con la estructura esperada por el frontend
        res.json({
            data: orders,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener un pedido por ORD_id
router.get("/:ORD_id", async (req, res) => {
    try {
        const respuesta = await Order.findOne({ ORD_id: req.params.ORD_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Listar pedidos de un usuario específico
router.get("/user/:USU_id", async (req, res) => {
    try {
        const respuesta = await Order.find({ USU_id: req.params.USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear un nuevo pedido (auto-incrementa ORD_id)
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        // Obtener el último ORD_id
        const ultimo = await Order.findOne({}, {}, { sort: { ORD_id: -1 } });
        const nuevoId = ultimo ? ultimo.ORD_id + 1 : 1;
        const nuevaOrden = new Order({ ...body, ORD_id: nuevoId });
        await nuevaOrden.save();

        // Notificar al usuario que su pedido fue registrado
        const mensajeEstado = MENSAJES_ESTADO[nuevaOrden.ORD_status] || MENSAJES_ESTADO.pending;
        await crearNotificacion(
            nuevaOrden.USU_id,
            "order",
            mensajeEstado.replace("{id}", nuevaOrden.ORD_id)
        );

        // Si el pedido usó un cupón, notificar también como promo
        if (nuevaOrden.COU_id) {
            await crearNotificacion(
                nuevaOrden.USU_id,
                "promo",
                `Aplicaste un cupón de descuento en tu pedido #ORD-${nuevaOrden.ORD_id}.`
            );
        }

        res.status(201).json(nuevaOrden);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar un pedido (ej. cambiar estado)
router.put("/:ORD_id", async (req, res) => {
    try {
        const ORD_id = req.params.ORD_id;
        const body = req.body;
        const anterior = await Order.findOne({ ORD_id });
        const actualizada = await Order.findOneAndUpdate(
            { ORD_id },
            body,
            { new: true }
        );

        // Notificar solo si el estado del pedido cambió
        if (actualizada && body.ORD_status && anterior?.ORD_status !== actualizada.ORD_status) {
            const tipo = actualizada.ORD_status === "shipped" ? "shipment" : "order";
            const mensaje = (MENSAJES_ESTADO[actualizada.ORD_status] || `Tu pedido #ORD-{id} cambió de estado.`)
                .replace("{id}", actualizada.ORD_id);
            await crearNotificacion(actualizada.USU_id, tipo, mensaje);
        }

        res.json(actualizada);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar un pedido
router.delete("/:ORD_id", async (req, res) => {
    try {
        const ORD_id = req.params.ORD_id;
        const eliminada = await Order.findOneAndDelete({ ORD_id });
        res.json({ message: "Pedido eliminado correctamente", eliminada });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;