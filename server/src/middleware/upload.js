const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Carpeta donde se guardan las imágenes de producto subidas por el admin.
// Se sirve públicamente desde index.js como /uploads/*
const uploadDir = path.join(__dirname, "..", "..", "uploads", "products");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        // Nombre único para evitar sobrescribir archivos con el mismo nombre original
        const sufijoUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${sufijoUnico}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten archivos de imagen (jpg, png, webp, etc.)"));
    }
};

module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB por imagen
});
