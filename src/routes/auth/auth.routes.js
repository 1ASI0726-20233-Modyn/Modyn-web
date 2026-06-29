const { Router } = require("express");
const router = Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "modyn-secret-2026";

// POST - Registro
router.post("/register", async (req, res) => {
    try {
        const { USU_name, USU_email, USU_password, USU_phone } = req.body;

        // Verificar si ya existe
        const existe = await User.findOne({ USU_email });
        if (existe) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        // Encriptar password
        const hash = await bcrypt.hash(USU_password, 10);

        // Crear usuario
        const nuevoUsuario = await User.create({
            USU_name,
            USU_email,
            USU_password: hash,
            USU_phone,
            USU_role: "cliente",
            USU_status: "activo"
        });

        res.json({ mensaje: "Usuario creado", usuario: nuevoUsuario });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Login
router.post("/login", async (req, res) => {
    try {
        const { USU_email, USU_password } = req.body;

        // Buscar usuario
        const usuario = await User.findOne({ USU_email });
        if (!usuario) {
            return res.status(401).json({ error: "Email o password incorrectos" });
        }

        // Verificar password
        const valido = await bcrypt.compare(USU_password, usuario.USU_password);
        if (!valido) {
            return res.status(401).json({ error: "Email o password incorrectos" });
        }

        // Generar token
        const token = jwt.sign(
            { USU_id: usuario.USU_id, USU_role: usuario.USU_role },
            SECRET,
            { expiresIn: "24h" }
        );

        res.json({ token, usuario });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Logout
router.post("/logout", (req, res) => {
    res.json({ mensaje: "Sesión cerrada" });
});

// GET - Verificar token (saber si sigue válido)
router.get("/me", async (req, res) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({ error: "Token requerido" });
        }
        const decoded = jwt.verify(token, SECRET);
        const usuario = await User.findOne({ USU_id: decoded.USU_id });
        res.json(usuario);
    } catch (err) {
        res.status(401).json({ error: "Token inválido" });
    }
});


module.exports = router;