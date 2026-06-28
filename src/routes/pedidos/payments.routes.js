const { Router } = require("express");
const router = Router();
const Payment = require("../../models/Payment");

// GET - Listar todos los pagos
router.get("/", async (req, res) => {
    try {
        const respuesta = await Payment.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener pago por PAY_id
router.get("/:PAY_id", async (req, res) => {
    try {
        const respuesta = await Payment.findOne({ PAY_id: req.params.PAY_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Listar pagos de un pedido
router.get("/pedido/:ORD_id", async (req, res) => {
    try {
        const respuesta = await Payment.find({ ORD_id: req.params.ORD_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear pago
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Payment.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar pago
router.put("/:PAY_id", async (req, res) => {
    try {
        const PAY_id = req.params.PAY_id;
        const body = req.body;
        const respuesta = await Payment.findOneAndUpdate({ PAY_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar pago
router.delete("/:PAY_id", async (req, res) => {
    try {
        const PAY_id = req.params.PAY_id;
        const respuesta = await Payment.findOneAndDelete({ PAY_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;