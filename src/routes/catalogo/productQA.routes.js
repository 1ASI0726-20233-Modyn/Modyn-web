const { Router } = require("express");
const router = Router();
const ProductQA = require("../../models/ProductQA");

// GET - Listar todas las preguntas
router.get("/", async (req, res) => {
    try {
        const respuesta = await ProductQA.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por QA_id
router.get("/:QA_id", async (req, res) => {
    try {
        const respuesta = await ProductQA.findOne({ QA_id: req.params.QA_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener todas las preguntas de un producto (por PRO_id)
router.get("/product/:PRO_id", async (req, res) => {
    try {
        const PRO_id = parseInt(req.params.PRO_id);
        const respuesta = await ProductQA.find({ PRO_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await ProductQA.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:QA_id", async (req, res) => {
    try {
        const QA_id = req.params.QA_id;
        const body = req.body;
        const respuesta = await ProductQA.findOneAndUpdate({ QA_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:QA_id", async (req, res) => {
    try {
        const QA_id = req.params.QA_id;
        const respuesta = await ProductQA.findOneAndDelete({ QA_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;