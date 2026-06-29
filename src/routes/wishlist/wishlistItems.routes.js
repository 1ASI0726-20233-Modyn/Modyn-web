const { Router } = require("express");
const router = Router();
const WishlistItem = require("../../models/WishlistItem");

// GET - Listar todos
router.get("/", async (req, res) => {
    try {
        const respuesta = await WishlistItem.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por WIST_id
router.get("/:WIST_id", async (req, res) => {
    try {
        const respuesta = await WishlistItem.findOne({ WIST_id: req.params.WIST_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por wishlist
router.get("/wishlist/:WIS_id", async (req, res) => {
    try {
        const respuesta = await WishlistItem.find({ WIS_id: req.params.WIS_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Agregar item
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await WishlistItem.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Quitar item
router.delete("/:WIST_id", async (req, res) => {
    try {
        const WIST_id = req.params.WIST_id;
        const respuesta = await WishlistItem.findOneAndDelete({ WIST_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;