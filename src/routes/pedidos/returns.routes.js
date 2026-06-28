const { Router } = require("express");
const router = Router();
const Return = require("../../models/Return");

// GET - Listar todas las devoluciones
router.get("/", async (req, res) => {
    try {
        const respuesta = await Return.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener devolución por RET_id
router.get("/:RET_id", async (req, res) => {
    try {
        const respuesta = await Return.findOne({ RET_id: req.params.RET_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Listar devoluciones de un pedido
router.get("/pedido/:ORD_id", async (req, res) => {
    try {
        const respuesta = await Return.find({ ORD_id: req.params.ORD_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear devolución
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Return.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar devolución
router.put("/:RET_id", async (req, res) => {
    try {
        const RET_id = req.params.RET_id;
        const body = req.body;
        const respuesta = await Return.findOneAndUpdate({ RET_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar devolución
router.delete("/:RET_id", async (req, res) => {
    try {
        const RET_id = req.params.RET_id;
        const respuesta = await Return.findOneAndDelete({ RET_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;