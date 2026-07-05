const { Router } = require("express");
const router = Router();
const RecommendationItem = require("../../models/RecommendationItem");

// GET - Listar todos
router.get("/", async (req, res) => {
    try {
        const respuesta = await RecommendationItem.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por RIT_id
router.get("/:RIT_id", async (req, res) => {
    try {
        const respuesta = await RecommendationItem.findOne({ RIT_id: req.params.RIT_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por recomendación
router.get("/rec/:REC_id", async (req, res) => {
    try {
        const respuesta = await RecommendationItem.find({ REC_id: req.params.REC_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Agregar item
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await RecommendationItem.findOne({}, {}, { sort: { RIT_id: -1 } });
        const nuevoId = ultimo ? ultimo.RIT_id + 1 : 1;
        const respuesta = await RecommendationItem.create({ ...body, RIT_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:RIT_id", async (req, res) => {
    try {
        const RIT_id = req.params.RIT_id;
        const respuesta = await RecommendationItem.findOneAndDelete({ RIT_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;