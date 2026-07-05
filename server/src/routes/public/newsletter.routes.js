const { Router } = require("express");
const router = Router();
const NewsletterSubscriber = require("../../models/NewsletterSubscriber");

// GET - Listar suscriptores (solo admin lo usaría)
router.get("/", async (req, res) => {
    try {
        const respuesta = await NewsletterSubscriber.find({});
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Suscribirse (público, cualquiera)
router.post("/", async (req, res) => {
    try {
        const { NSB_email, USU_id } = req.body;
        const existe = await NewsletterSubscriber.findOne({ NSB_email });
        if (existe) {
            return res.status(400).json({ error: "Email ya suscrito" });
        }
        const ultimo = await NewsletterSubscriber.findOne({}, {}, { sort: { NSB_id: -1 } });
        const nuevoId = ultimo ? ultimo.NSB_id + 1 : 1;
        const respuesta = await NewsletterSubscriber.create({ ...req.body, NSB_id: nuevoId });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT - Desactivar suscripción
router.put("/:NSB_id", async (req, res) => {
    try {
        const respuesta = await NewsletterSubscriber.findOneAndUpdate(
            { NSB_id: req.params.NSB_id }, req.body, { new: true }
        );
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Desuscribirse
router.delete("/:NSB_id", async (req, res) => {
    try {
        const respuesta = await NewsletterSubscriber.findOneAndDelete({ NSB_id: req.params.NSB_id });
        res.send(respuesta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;