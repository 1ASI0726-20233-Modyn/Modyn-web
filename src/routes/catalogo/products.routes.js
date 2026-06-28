const { Router } = require("express");
const router = Router();
const Product = require("../../models/Product");

// GET - Listar todos los productos
router.get("/", async (req, res) => {
    try {
        const respuesta = await Product.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por PRO_id
router.get("/:PRO_id", async (req, res) => {
    try {
        const respuesta = await Product.findOne({ PRO_id: req.params.PRO_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Product.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:PRO_id", async (req, res) => {
    try {
        const PRO_id = req.params.PRO_id;
        const body = req.body;
        const respuesta = await Product.findOneAndUpdate({ PRO_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:PRO_id", async (req, res) => {
    try {
        const PRO_id = req.params.PRO_id;
        const respuesta = await Product.findOneAndDelete({ PRO_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;