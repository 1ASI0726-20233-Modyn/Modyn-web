const { Router } = require("express");
const router = Router();
const Coupon = require("../../models/Coupon");

// GET - Listar todos los cupones
router.get("/", async (req, res) => {
    try {
        const respuesta = await Coupon.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener cupón por COU_id
router.get("/:COU_id", async (req, res) => {
    try {
        const respuesta = await Coupon.findOne({ COU_id: req.params.COU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Buscar cupón por código
router.get("/code/:COU_code", async (req, res) => {
    try {
        const respuesta = await Coupon.findOne({ COU_code: req.params.COU_code });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear cupón
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Coupon.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar cupón
router.put("/:COU_id", async (req, res) => {
    try {
        const COU_id = req.params.COU_id;
        const body = req.body;
        const respuesta = await Coupon.findOneAndUpdate({ COU_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar cupón
router.delete("/:COU_id", async (req, res) => {
    try {
        const COU_id = req.params.COU_id;
        const respuesta = await Coupon.findOneAndDelete({ COU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;