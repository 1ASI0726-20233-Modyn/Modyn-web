const { Router } = require("express");
const router = Router();
const Order = require("../../models/Order");

router.get("/", async (req, res) => {
    try {
        const respuesta = await Order.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:ORD_id", async (req, res) => {
    try {
        const respuesta = await Order.findOne({ ORD_id: req.params.ORD_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/user/:USU_id", async (req, res) => {
    try {
        const respuesta = await Order.find({ USU_id: req.params.USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await Order.findOne({}, {}, { sort: { ORD_id: -1 } });
        const nuevoId = ultimo ? ultimo.ORD_id + 1 : 1;
        const respuesta = await Order.create({ ...body, ORD_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:ORD_id", async (req, res) => {
    try {
        const respuesta = await Order.findOneAndUpdate({ ORD_id: req.params.ORD_id }, req.body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:ORD_id", async (req, res) => {
    try {
        const respuesta = await Order.findOneAndDelete({ ORD_id: req.params.ORD_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;