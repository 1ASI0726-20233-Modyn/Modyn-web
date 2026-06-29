const { Router } = require("express");
const router = Router();
const Wishlist = require("../../models/Wishlist");

// GET - Listar todas
router.get("/", async (req, res) => {
    try {
        const respuesta = await Wishlist.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por WIS_id
router.get("/:WIS_id", async (req, res) => {
    try {
        const respuesta = await Wishlist.findOne({ WIS_id: req.params.WIS_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por usuario
router.get("/user/:USU_id", async (req, res) => {
    try {
        const respuesta = await Wishlist.find({ USU_id: req.params.USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Wishlist.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:WIS_id", async (req, res) => {
    try {
        const WIS_id = req.params.WIS_id;
        const respuesta = await Wishlist.findOneAndDelete({ WIS_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;