const { Router } = require("express");
const router = Router();
const Settings = require("../../models/Settings");

// GET - Listar todas las configuraciones
router.get("/", async (req, res) => {
    try {
        const respuesta = await Settings.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por grupo
router.get("/group/:SET_group", async (req, res) => {
    try {
        const respuesta = await Settings.find({ SET_group: req.params.SET_group });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await Settings.findOne({}, {}, { sort: { SET_id: -1 } });
        const nuevoId = ultimo ? ultimo.SET_id + 1 : 1;
        const respuesta = await Settings.create({ ...body, SET_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:SET_id", async (req, res) => {
    try {
        const respuesta = await Settings.findOneAndUpdate(
            { SET_id: req.params.SET_id }, req.body, { new: true }
        );
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;