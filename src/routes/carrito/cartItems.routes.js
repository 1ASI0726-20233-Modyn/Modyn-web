const { Router } = require("express");
const router = Router();
const CartItem = require("../../models/CartItem");

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
        const respuesta = await CartItem.create(body);
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