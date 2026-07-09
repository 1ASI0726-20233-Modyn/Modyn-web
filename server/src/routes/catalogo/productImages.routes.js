const { Router } = require("express");
const router = Router();
const ProductImage = require("../../models/ProductImage");

// GET - Listar todas las imágenes
router.get("/", async (req, res) => {
    try {
        const respuesta = await ProductImage.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Imágenes por producto
router.get("/product/:PRO_id", async (req, res) => {
    try {
        const respuesta = await ProductImage.find({ PRO_id: req.params.PRO_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por IMG_id
router.get("/:IMG_id", async (req, res) => {
    try {
        const respuesta = await ProductImage.findOne({ IMG_id: req.params.IMG_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await ProductImage.findOne({}, {}, { sort: { IMG_id: -1 } });
        const nuevoId = ultimo ? ultimo.IMG_id + 1 : 1;
        const respuesta = await ProductImage.create({ ...body, IMG_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:IMG_id", async (req, res) => {
    try {
        const IMG_id = req.params.IMG_id;
        const body = req.body;
        const respuesta = await ProductImage.findOneAndUpdate({ IMG_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:IMG_id", async (req, res) => {
    try {
        const IMG_id = req.params.IMG_id;
        const respuesta = await ProductImage.findOneAndDelete({ IMG_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;