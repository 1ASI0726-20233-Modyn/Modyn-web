const { Router } = require("express");
const router = Router();
const OrderDetail = require("../../models/OrderDetail");

// GET - Listar todos los detalles
router.get("/", async (req, res) => {
    try {
        const respuesta = await OrderDetail.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener detalle por DET_id
router.get("/:DET_id", async (req, res) => {
    try {
        const respuesta = await OrderDetail.findOne({ DET_id: req.params.DET_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Listar detalles de un pedido
router.get("/pedido/:ORD_id", async (req, res) => {
    try {
        const respuesta = await OrderDetail.find({ ORD_id: req.params.ORD_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear detalle
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await OrderDetail.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar detalle
router.put("/:DET_id", async (req, res) => {
    try {
        const DET_id = req.params.DET_id;
        const body = req.body;
        const respuesta = await OrderDetail.findOneAndUpdate({ DET_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar detalle
router.delete("/:DET_id", async (req, res) => {
    try {
        const DET_id = req.params.DET_id;
        const respuesta = await OrderDetail.findOneAndDelete({ DET_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;