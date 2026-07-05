const { Router } = require("express");
const router = Router();
const CartHistory = require("../../models/CartHistory");

// GET - Listar todos
router.get("/", async (req, res) => {
    try {
        const respuesta = await CartHistory.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por CHS_id
router.get("/:CHS_id", async (req, res) => {
    try {
        const respuesta = await CartHistory.findOne({ CHS_id: req.params.CHS_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por carrito
router.get("/cart/:CAR_id", async (req, res) => {
    try {
        const respuesta = await CartHistory.find({ CAR_id: req.params.CAR_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Registrar acción
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await CartHistory.findOne({}, {}, { sort: { CHS_id: -1 } });
        const nuevoId = ultimo ? ultimo.CHS_id + 1 : 1;
        const respuesta = await CartHistory.create({ ...body, CHS_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;