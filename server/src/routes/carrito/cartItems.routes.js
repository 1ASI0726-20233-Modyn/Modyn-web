const { Router } = require("express");
const router = Router();
const CartItem = require("../../models/CartItem");
const Product = require("../../models/Product");

// Máximo de unidades por producto permitido en el carrito, independiente del stock
const MAX_CANTIDAD_POR_PRODUCTO = 10;

async function validarCantidad(PRO_id, cantidad) {
    const cantidadNum = Number(cantidad);

    if (!Number.isInteger(cantidadNum) || cantidadNum < 1) {
        return "La cantidad debe ser un número entero mayor o igual a 1";
    }

    if (cantidadNum > MAX_CANTIDAD_POR_PRODUCTO) {
        return `La cantidad máxima permitida por producto es ${MAX_CANTIDAD_POR_PRODUCTO} unidades`;
    }

    const producto = await Product.findOne({ PRO_id });
    if (!producto) {
        return "El producto no existe";
    }

    if (typeof producto.PRO_stock === "number" && cantidadNum > producto.PRO_stock) {
        return `Solo hay ${producto.PRO_stock} unidades disponibles de este producto`;
    }

    return null;
}

// GET - Listar todos
router.get("/", async (req, res) => {
    try {
        const respuesta = await CartItem.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por CARTI_id
router.get("/:CARTI_id", async (req, res) => {
    try {
        const respuesta = await CartItem.findOne({ CARTI_id: req.params.CARTI_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por carrito
router.get("/cart/:CAR_id", async (req, res) => {
    try {
        const respuesta = await CartItem.find({ CAR_id: req.params.CAR_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Agregar al carrito
router.post("/", async (req, res) => {
    try {
        const body = req.body;

        const errorCantidad = await validarCantidad(body.PRO_id, body.CARTI_quantity);
        if (errorCantidad) {
            return res.status(400).json({ error: errorCantidad });
        }

        const ultimo = await CartItem.findOne({}, {}, { sort: { CARTI_id: -1 } });
        const nuevoId = ultimo ? ultimo.CARTI_id + 1 : 1;
        const respuesta = await CartItem.create({ ...body, CARTI_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar cantidad
router.put("/:CARTI_id", async (req, res) => {
    try {
        const CARTI_id = req.params.CARTI_id;
        const body = req.body;

        if (body.CARTI_quantity !== undefined) {
            const itemActual = await CartItem.findOne({ CARTI_id });
            if (!itemActual) {
                return res.status(404).json({ error: "El item del carrito no existe" });
            }

            const errorCantidad = await validarCantidad(itemActual.PRO_id, body.CARTI_quantity);
            if (errorCantidad) {
                return res.status(400).json({ error: errorCantidad });
            }
        }

        const respuesta = await CartItem.findOneAndUpdate({ CARTI_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Quitar del carrito
router.delete("/:CARTI_id", async (req, res) => {
    try {
        const CARTI_id = req.params.CARTI_id;
        const respuesta = await CartItem.findOneAndDelete({ CARTI_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;