const { Router } = require("express");
const router = Router();
const NotificationEvent = require("../../models/NotificationEvent");

// GET - Listar todos
router.get("/", async (req, res) => {
    try {
        const respuesta = await NotificationEvent.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por NEV_id
router.get("/:NEV_id", async (req, res) => {
    try {
        const respuesta = await NotificationEvent.findOne({ NEV_id: req.params.NEV_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por notificación
router.get("/notification/:NOT_id", async (req, res) => {
    try {
        const respuesta = await NotificationEvent.find({ NOT_id: req.params.NOT_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await NotificationEvent.findOne({}, {}, { sort: { NEV_id: -1 } });
        const nuevoId = ultimo ? ultimo.NEV_id + 1 : 1;
        const respuesta = await NotificationEvent.create({ ...body, NEV_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;