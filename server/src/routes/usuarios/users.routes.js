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
        const ultimo = await User.findOne({}, {}, { sort: { USU_id: -1 } });
        const nuevoId = ultimo ? ultimo.USU_id + 1 : 1;
        const respuesta = await User.create({ ...body, USU_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// PUT - Actualizar
router.put("/:USU_id", async (req, res) => {
    try {
        const USU_id = req.params.USU_id;
        const body = req.body;
        const respuesta = await User.findOneAndUpdate({ USU_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:USU_id", async (req, res) => {
    try {
        const USU_id = req.params.USU_id;
        const respuesta = await User.findOneAndDelete({ USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;