const { Router } = require("express");
const router = Router();
const Category = require("../../models/Category");

// GET - Listar todas las categorías
router.get("/", async (req, res) => {
    try {
        const respuesta = await Category.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por CAT_id
router.get("/:CAT_id", async (req, res) => {
    try {
        const respuesta = await Category.findOne({ CAT_id: req.params.CAT_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Category.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:CAT_id", async (req, res) => {
    try {
        const CAT_id = req.params.CAT_id;
        const body = req.body;
        const respuesta = await Category.findOneAndUpdate({ CAT_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:CAT_id", async (req, res) => {
    try {
        const CAT_id = req.params.CAT_id;
        const respuesta = await Category.findOneAndDelete({ CAT_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;