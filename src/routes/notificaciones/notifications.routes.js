const { Router } = require("express");
const router = Router();
const Notification = require("../../models/Notification");

// GET - Listar todas
router.get("/", async (req, res) => {
    try {
        const respuesta = await Notification.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por NOT_id
router.get("/:NOT_id", async (req, res) => {
    try {
        const respuesta = await Notification.findOne({ NOT_id: req.params.NOT_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por usuario
router.get("/user/:USU_id", async (req, res) => {
    try {
        const respuesta = await Notification.find({ USU_id: req.params.USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Notification.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:NOT_id", async (req, res) => {
    try {
        const NOT_id = req.params.NOT_id;
        const body = req.body;
        const respuesta = await Notification.findOneAndUpdate({ NOT_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:NOT_id", async (req, res) => {
    try {
        const NOT_id = req.params.NOT_id;
        const respuesta = await Notification.findOneAndDelete({ NOT_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;