const { Router } = require("express");
const router = Router();
const Address = require("../../models/Address");

// GET - Listar todas
router.get("/", async (req, res) => {
    try {
        const respuesta = await Address.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por ADD_id
router.get("/:ADD_id", async (req, res) => {
    try {
        const respuesta = await Address.findOne({ ADD_id: req.params.ADD_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por usuario
router.get("/user/:USU_id", async (req, res) => {
    try {
        const respuesta = await Address.find({ USU_id: req.params.USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const respuesta = await Address.create(body);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar
router.put("/:ADD_id", async (req, res) => {
    try {
        const ADD_id = req.params.ADD_id;
        const body = req.body;
        const respuesta = await Address.findOneAndUpdate({ ADD_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:ADD_id", async (req, res) => {
    try {
        const ADD_id = req.params.ADD_id;
        const respuesta = await Address.findOneAndDelete({ ADD_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;