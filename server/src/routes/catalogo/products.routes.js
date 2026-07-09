const { Router } = require("express");
const router = Router();
const Product = require("../../models/Product");

// GET - Listar todos los productos
router.get("/", async (req, res) => {
    try {
        const respuesta = await Product.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Top trending
router.get("/trending", async (req, res) => {
    try {
        const respuesta = await Product.find({})
            .sort({ PRO_trending_score: -1 })
            .limit(10);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Por categoría
router.get("/category/:CAT_id", async (req, res) => {
    try {
        const respuesta = await Product.find({ CAT_id: req.params.CAT_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener por PRO_id
router.get("/:PRO_id", async (req, res) => {
    try {
        const respuesta = await Product.findOne({ PRO_id: req.params.PRO_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await Product.findOne({}, {}, { sort: { PRO_id: -1 } });
        const nuevoId = ultimo ? ultimo.PRO_id + 1 : 1;
        const respuesta = await Product.create({ ...body, PRO_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/trending/:periodo", async (req, res) => {
    try {
        const hoy   = new Date()
        let desde   = new Date()

        if (req.params.periodo === 'hoy') {
            desde.setHours(0, 0, 0, 0)
        } else if (req.params.periodo === 'semana') {
            desde.setDate(hoy.getDate() - 7)
        } else if (req.params.periodo === 'mes') {
            desde.setMonth(hoy.getMonth() - 1)
        }

        const respuesta = await Product.find({
            PRO_last_trending_update: { $gte: desde }
        }).sort({ PRO_trending_score: -1 }).limit(10)

        res.send(respuesta)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT - Actualizar
router.put("/:PRO_id", async (req, res) => {
    try {
        const PRO_id = req.params.PRO_id;
        const body = req.body;
        const respuesta = await Product.findOneAndUpdate({ PRO_id }, body, { new: true });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar
router.delete("/:PRO_id", async (req, res) => {
    try {
        const PRO_id = req.params.PRO_id;
        const respuesta = await Product.findOneAndDelete({ PRO_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;