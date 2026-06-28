const { Router } = require("express");
const router = Router();
const Recommendation = require("../../models/Recommendation");

// GET - Listar todas
router.get("/", async (req, res) => {
    try {
        const respuesta = await Recommendation.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por REC_id
router.get("/:REC_id", async (req, res) => {
    try {
        const respuesta = await Recommendation.findOne({ REC_id: req.params.REC_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por usuario
router.get("/user/:USU_id", async (req, res) => {
    try {
        const respuesta = await Recommendation.find({ USU_id: req.params.USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Recommendation.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:REC_id", async (req, res) => {
    try {
        const REC_id = req.params.REC_id;
        const respuesta = await Recommendation.findOneAndDelete({ REC_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;