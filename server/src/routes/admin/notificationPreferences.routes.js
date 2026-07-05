const { Router } = require("express");
const router = Router();
const NotificationPreference = require("../../models/NotificationPreference");

// GET - Por usuario
router.get("/user/:USU_id", async (req, res) => {
    try {
        const respuesta = await NotificationPreference.find({ USU_id: req.params.USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear preferencia
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await NotificationPreference.findOne({}, {}, { sort: { NPR_id: -1 } });
        const nuevoId = ultimo ? ultimo.NPR_id + 1 : 1;
        const respuesta = await NotificationPreference.create({ ...body, NPR_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar preferencia
router.put("/:NPR_id", async (req, res) => {
    try {
        const respuesta = await NotificationPreference.findOneAndUpdate(
            { NPR_id: req.params.NPR_id }, req.body, { new: true }
        );
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;