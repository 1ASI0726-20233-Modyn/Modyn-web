const { Router } = require("express");
const router = Router();
const Payment = require("../../models/Payment");

// GET - Listar todos
router.get("/", async (req, res) => {
    try {
        const respuesta = await Payment.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por PAY_id
router.get("/:PAY_id", async (req, res) => {
    try {
        const respuesta = await Payment.findOne({ PAY_id: req.params.PAY_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear (auto-incrementa PAY_id)
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await Payment.findOne({}, {}, { sort: { PAY_id: -1 } });
        const nuevoId = ultimo ? ultimo.PAY_id + 1 : 1;
        const respuesta = await Payment.create({ ...body, PAY_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
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

// DELETE - Eliminar
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