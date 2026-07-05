const { Router } = require("express");
const router = Router();
const Supplier = require("../../models/Supplier");

// GET - Listar todos los proveedores
router.get("/", async (req, res) => {
    try {
        const respuesta = await Supplier.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por SUP_id
router.get("/:SUP_id", async (req, res) => {
    try {
        const respuesta = await Supplier.findOne({ SUP_id: req.params.SUP_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await Supplier.findOne({}, {}, { sort: { SUP_id: -1 } });
        const nuevoId = ultimo ? ultimo.SUP_id + 1 : 1;
        const respuesta = await Supplier.create({ ...body, SUP_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:SUP_id", async (req, res) => {
    try {
        const SUP_id = req.params.SUP_id;
        const body = req.body;
        const respuesta = await Supplier.findOneAndUpdate({ SUP_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:SUP_id", async (req, res) => {
    try {
        const SUP_id = req.params.SUP_id;
        const respuesta = await Supplier.findOneAndDelete({ SUP_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;