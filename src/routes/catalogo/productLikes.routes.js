const { Router } = require("express");
const router = Router();
const ProductLike = require("../../models/ProductLike");

// GET - Listar todos los likes
router.get("/", async (req, res) => {
    try {
        const respuesta = await ProductLike.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por PLK_id
router.get("/:PLK_id", async (req, res) => {
    try {
        const respuesta = await ProductLike.findOne({ PLK_id: req.params.PLK_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener todos los likes de un producto (por PRO_id)
router.get("/product/:PRO_id", async (req, res) => {
    try {
        const PRO_id = parseInt(req.params.PRO_id);
        const respuesta = await ProductLike.find({ PRO_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener todos los likes de un usuario (por USU_id)
router.get("/user/:USU_id", async (req, res) => {
    try {
        const USU_id = parseInt(req.params.USU_id);
        const respuesta = await ProductLike.find({ USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await ProductLike.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:PLK_id", async (req, res) => {
    try {
        const PLK_id = req.params.PLK_id;
        const body = req.body;
        const respuesta = await ProductLike.findOneAndUpdate({ PLK_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:PLK_id", async (req, res) => {
    try {
        const PLK_id = req.params.PLK_id;
        const respuesta = await ProductLike.findOneAndDelete({ PLK_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;