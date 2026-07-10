// Migración de un solo uso: recalcula PRO_rating_avg y PRO_total_reviews de TODOS
// los productos a partir de las reseñas reales guardadas en la colección "reviews".
//
// Por qué hace falta: estos dos campos se guardaban como datos semilla (seed) y nunca
// se actualizaban cuando se creaba/eliminaba una reseña, por eso productos sin ninguna
// reseña real mostraban ratings como 4.5, 4.9 o conteos como "42 reseñas". El código de
// server/src/routes/catalogo/reviews.routes.js ya se corrigió para mantenerlos
// sincronizados hacia adelante; este script solo corrige los datos que ya existen.
//
// Cómo correrlo (una sola vez):
//   cd server
//   node scripts/recalcular-ratings.js

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../src/models/Product");
const Review = require("../src/models/Review");

async function main() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27018/modyn_db";
    await mongoose.connect(uri);
    console.log("Conectado a", mongoose.connection.host);

    const stats = await Review.aggregate([
        { $group: { _id: "$PRO_id", promedio: { $avg: "$REV_rating" }, total: { $sum: 1 } } }
    ]);

    const statsPorProducto = new Map(stats.map((s) => [s._id, s]));

    const productos = await Product.find({}, { PRO_id: 1 });
    let actualizados = 0;

    for (const p of productos) {
        const s = statsPorProducto.get(p.PRO_id);
        const nuevoPromedio = s ? Math.round(s.promedio * 10) / 10 : 0;
        const nuevoTotal = s ? s.total : 0;

        await Product.updateOne(
            { PRO_id: p.PRO_id },
            { PRO_rating_avg: nuevoPromedio, PRO_total_reviews: nuevoTotal }
        );
        actualizados++;
    }

    console.log(`Listo. ${actualizados} productos actualizados con sus ratings reales.`);
    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error("Error en la migración:", err);
    process.exit(1);
});
