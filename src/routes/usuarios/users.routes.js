const { Router } = require("express");
const router = Router();
const User = require("../../models/User");

// GET - Listar todos
router.get("/", async (req, res) => {
    try {
        const respuesta = await User.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por USU_id
router.get("/:USU_id", async (req, res) => {
    try {
        const respuesta = await User.findOne({ USU_id: req.params.USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await User.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const respuesta = await User.findByIdAndUpdate(id, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const respuesta = await User.findByIdAndDelete(id);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;