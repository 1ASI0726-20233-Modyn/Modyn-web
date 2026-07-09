const { Router } = require("express");
const router = Router();
const Return = require("../../models/Return");

// GET - Listar todos
router.get("/", async (req, res) => {
    try {
        const respuesta = await Return.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por RET_id
router.get("/:RET_id", async (req, res) => {
    try {
        const respuesta = await Return.findOne({ RET_id: req.params.RET_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear (auto-incrementa RET_id)
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await Return.findOne({}, {}, { sort: { RET_id: -1 } });
        const nuevoId = ultimo ? ultimo.RET_id + 1 : 1;
        const respuesta = await Return.create({ ...body, RET_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
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

// DELETE - Eliminar
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