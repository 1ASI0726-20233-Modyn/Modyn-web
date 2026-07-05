const { Router } = require("express");
const router = Router();
const Review = require("../../models/Review");

// GET - Listar todas las reseñas (con filtros opcionales por PRO_id o USU_id)
router.get("/", async (req, res) => {
    try {
        const { PRO_id, USU_id } = req.query;
        let filtro = {};

        if (PRO_id) {
            filtro.PRO_id = parseInt(PRO_id);
        }
        if (USU_id) {
            filtro.USU_id = parseInt(USU_id);
        }

        const respuesta = await Review.find(filtro);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener una reseña por REV_id
router.get("/:REV_id", async (req, res) => {
    try {
        const respuesta = await Review.findOne({ REV_id: req.params.REV_id });
        if (!respuesta) {
            return res.status(404).json({ error: "Reseña no encontrada" });
        }
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener todas las reseñas de un producto específico (por PRO_id)
router.get("/product/:PRO_id", async (req, res) => {
    try {
        const PRO_id = parseInt(req.params.PRO_id);
        const respuesta = await Review.find({ PRO_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener todas las reseñas de un usuario específico (por USU_id)
router.get("/user/:USU_id", async (req, res) => {
    try {
        const USU_id = parseInt(req.params.USU_id);
        const respuesta = await Review.find({ USU_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear una nueva reseña
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await Review.findOne({}, {}, { sort: { REV_id: -1 } });
        const nuevoId = ultimo ? ultimo.REV_id + 1 : 1;
        const respuesta = await Review.create({ ...body, REV_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Actualizar una reseña existente
router.put("/:REV_id", async (req, res) => {
    try {
        const REV_id = req.params.REV_id;
        const body = req.body;

        // Validar rating si viene en el body
        if (body.REV_rating && (body.REV_rating < 1 || body.REV_rating > 5)) {
            return res.status(400).json({ error: "El rating debe estar entre 1 y 5" });
        }

        const respuesta = await Review.findOneAndUpdate(
            { REV_id },
            body,
            { new: true }
        );

        if (!respuesta) {
            return res.status(404).json({ error: "Reseña no encontrada" });
        }

        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar una reseña
router.delete("/:REV_id", async (req, res) => {
    try {
        const REV_id = req.params.REV_id;
        const respuesta = await Review.findOneAndDelete({ REV_id });

        if (!respuesta) {
            return res.status(404).json({ error: "Reseña no encontrada" });
        }

        res.send({ message: "Reseña eliminada correctamente", deleted: respuesta });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;