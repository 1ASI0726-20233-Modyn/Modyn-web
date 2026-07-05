const { Router } = require("express");
const router = Router();
const ProductVariant = require("../../models/ProductVariant");

// GET - Listar todas las variantes
router.get("/", async (req, res) => {
    try {
        const respuesta = await ProductVariant.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por VAR_id
router.get("/:VAR_id", async (req, res) => {
    try {
        const respuesta = await ProductVariant.findOne({ VAR_id: req.params.VAR_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await ProductVariant.findOne({}, {}, { sort: { VAR_id: -1 } });
        const nuevoId = ultimo ? ultimo.VAR_id + 1 : 1;
        const respuesta = await ProductVariant.create({ ...body, VAR_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:VAR_id", async (req, res) => {
    try {
        const VAR_id = req.params.VAR_id;
        const body = req.body;
        const respuesta = await ProductVariant.findOneAndUpdate({ VAR_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:VAR_id", async (req, res) => {
    try {
        const VAR_id = req.params.VAR_id;
        const respuesta = await ProductVariant.findOneAndDelete({ VAR_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;