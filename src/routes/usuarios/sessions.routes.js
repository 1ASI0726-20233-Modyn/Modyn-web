const { Router } = require("express");
const router = Router();
const Session = require("../../models/Session");

// GET - Listar todas
router.get("/", async (req, res) => {
    try {
        const respuesta = await Session.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por SES_id
router.get("/:SES_id", async (req, res) => {
    try {
        const respuesta = await Session.findOne({ SES_id: req.params.SES_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por usuario
router.get("/user/:USU_id", async (req, res) => {
    try {
        const respuesta = await Session.find({ USU_id: req.params.USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Session.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Cerrar sesión
router.delete("/:SES_id", async (req, res) => {
    try {
        const SES_id = req.params.SES_id;
        const respuesta = await Session.findOneAndDelete({ SES_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;