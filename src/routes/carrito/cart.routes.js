const { Router } = require("express");
const router = Router();
const Cart = require("../../models/Cart");

// GET - Listar todos
router.get("/", async (req, res) => {
    try {
        const respuesta = await Cart.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por CAR_id
router.get("/:CAR_id", async (req, res) => {
    try {
        const respuesta = await Cart.findOne({ CAR_id: req.params.CAR_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por usuario
router.get("/user/:USU_id", async (req, res) => {
    try {
        const respuesta = await Cart.find({ USU_id: req.params.USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Cart.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:CAR_id", async (req, res) => {
    try {
        const CAR_id = req.params.CAR_id;
        const respuesta = await Cart.findOneAndDelete({ CAR_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;