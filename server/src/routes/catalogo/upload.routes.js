const { Router } = require("express");
const router = Router();
const upload = require("../../middleware/upload");

// POST - Sube una imagen de producto y devuelve su ruta pública relativa.
// El cliente es responsable de crear luego el registro en /product-images
// con esta URL (ver crearImagenProducto en productosService.js).
router.post("/product-image", (req, res) => {
    upload.single("imagen")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: "No se recibió ningún archivo" });
        }

        const rutaRelativa = `/uploads/products/${req.file.filename}`;
        res.send({ url: rutaRelativa });
    });
});

module.exports = router;
