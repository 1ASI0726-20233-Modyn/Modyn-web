const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Carga .env en desarrollo; en producción no hace nada si no existe

const app = express();

require("./database.js");

// CORS: permite tu frontend en producción (opcional, pero recomendado)
const allowedOrigins = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

// Sirve las imágenes de producto subidas por el admin (ver server/src/middleware/upload.js)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (req, res) => {
    res.send("Bienvenidos a Modyn E-commerce");
});

app.use(require("./routes/index.routes.js"));

// ⚠️ CAMBIO IMPORTANTE: usa el puerto de la nube o 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});