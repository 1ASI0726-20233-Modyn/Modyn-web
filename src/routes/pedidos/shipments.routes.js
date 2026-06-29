const { Router } = require("express");
const router = Router();
const Shipment = require("../../models/Shipment");

// GET - Listar todos los envíos
router.get("/", async (req, res) => {
    try {
        const respuesta = await Shipment.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener envío por SHI_id
router.get("/:SHI_id", async (req, res) => {
    try {
        const respuesta = await Shipment.findOne({ SHI_id: req.params.SHI_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Listar envíos de un pedido
router.get("/pedido/:ORD_id", async (req, res) => {
    try {
        const respuesta = await Shipment.find({ ORD_id: req.params.ORD_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear envío
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Shipment.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar envío
router.put("/:SHI_id", async (req, res) => {
    try {
        const SHI_id = req.params.SHI_id;
        const body = req.body;
        const respuesta = await Shipment.findOneAndUpdate({ SHI_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar envío
router.delete("/:SHI_id", async (req, res) => {
    try {
        const SHI_id = req.params.SHI_id;
        const respuesta = await Shipment.findOneAndDelete({ SHI_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;