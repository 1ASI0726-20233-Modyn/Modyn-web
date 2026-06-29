const { Router } = require("express");
const router = Router();
const ProductView = require("../../models/ProductView");

// GET - Listar todas las vistas
router.get("/", async (req, res) => {
    try {
        const respuesta = await ProductView.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por VIEW_id
router.get("/:VIEW_id", async (req, res) => {
    try {
        const respuesta = await ProductView.findOne({ VIEW_id: req.params.VIEW_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener todas las vistas de un usuario (por USU_id)
router.get("/user/:USU_id", async (req, res) => {
    try {
        const USU_id = parseInt(req.params.USU_id); // convertir a número
        const respuesta = await ProductView.find({ USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener todas las vistas de un producto (por PRO_id)
router.get("/product/:PRO_id", async (req, res) => {
    try {
        const PRO_id = parseInt(req.params.PRO_id);
        const respuesta = await ProductView.find({ PRO_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await ProductView.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:VIEW_id", async (req, res) => {
    try {
        const VIEW_id = req.params.VIEW_id;
        const body = req.body;
        const respuesta = await ProductView.findOneAndUpdate({ VIEW_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:VIEW_id", async (req, res) => {
    try {
        const VIEW_id = req.params.VIEW_id;
        const respuesta = await ProductView.findOneAndDelete({ VIEW_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;