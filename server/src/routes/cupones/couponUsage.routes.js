const { Router } = require("express");
const router = Router();
const CouponUsage = require("../../models/CouponUsage");

// GET - Listar todos los usos de cupones
router.get("/", async (req, res) => {
    try {
        const respuesta = await CouponUsage.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener uso por CPU_id
router.get("/:CPU_id", async (req, res) => {
    try {
        const respuesta = await CouponUsage.findOne({ CPU_id: req.params.CPU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Listar usos de un cupón específico
router.get("/coupon/:COU_id", async (req, res) => {
    try {
        const respuesta = await CouponUsage.find({ COU_id: req.params.COU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Listar usos de cupones de un usuario
router.get("/user/:USU_id", async (req, res) => {
    try {
        const respuesta = await CouponUsage.find({ USU_id: req.params.USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Registrar uso de cupón
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await CouponUsage.findOne({}, {}, { sort: { CPU_id: -1 } });
        const nuevoId = ultimo ? ultimo.CPU_id + 1 : 1;
        const respuesta = await CouponUsage.create({ ...body, CPU_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar uso de cupón
router.put("/:CPU_id", async (req, res) => {
    try {
        const CPU_id = req.params.CPU_id;
        const body = req.body;
        const respuesta = await CouponUsage.findOneAndUpdate({ CPU_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar uso de cupón
router.delete("/:CPU_id", async (req, res) => {
    try {
        const CPU_id = req.params.CPU_id;
        const respuesta = await CouponUsage.findOneAndDelete({ CPU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;