const { Router } = require("express");
const router = Router();
const ReviewImage = require("../../models/ReviewImage");

// GET - Listar todas las imágenes de reseñas (con filtro opcional por REV_id)
router.get("/", async (req, res) => {
    try {
        const { REV_id } = req.query;
        let filtro = {};

        if (REV_id) {
            filtro.REV_id = parseInt(REV_id);
        }

        const respuesta = await ReviewImage.find(filtro);
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener una imagen por REVIMG_id
router.get("/:REVIMG_id", async (req, res) => {
    try {
        const respuesta = await ReviewImage.findOne({ REVIMG_id: req.params.REVIMG_id });
        if (!respuesta) {
            return res.status(404).json({ error: "Imagen de reseña no encontrada" });
        }
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Obtener todas las imágenes de una reseña específica (por REV_id)
router.get("/review/:REV_id", async (req, res) => {
    try {
        const REV_id = parseInt(req.params.REV_id);
        const respuesta = await ReviewImage.find({ REV_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Crear una nueva imagen de reseña
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        const ultimo = await ReviewImage.findOne({}, {}, { sort: { REVIMG_id: -1 } });
        const nuevoId = ultimo ? ultimo.REVIMG_id + 1 : 1;
        const respuesta = await ReviewImage.create({ ...body, REVIMG_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// PUT - Actualizar una imagen de reseña
router.put("/:REVIMG_id", async (req, res) => {
    try {
        const REVIMG_id = req.params.REVIMG_id;
        const body = req.body;

        // No permitir cambiar REV_id (mantener integridad)
        if (body.REV_id) {
            return res.status(400).json({
                error: "No se puede modificar REV_id de una imagen de reseña"
            });
        }

        const respuesta = await ReviewImage.findOneAndUpdate(
            { REVIMG_id },
            body,
            { new: true }
        );

        if (!respuesta) {
            return res.status(404).json({ error: "Imagen de reseña no encontrada" });
        }

        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Eliminar una imagen de reseña
router.delete("/:REVIMG_id", async (req, res) => {
    try {
        const REVIMG_id = req.params.REVIMG_id;
        const respuesta = await ReviewImage.findOneAndDelete({ REVIMG_id });

        if (!respuesta) {
            return res.status(404).json({ error: "Imagen de reseña no encontrada" });
        }

        res.send({ message: "Imagen de reseña eliminada correctamente", deleted: respuesta });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;