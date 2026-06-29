const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    PRO_id: { type: Number, unique: true },
    CAT_id: { type: Number },
    SUP_id: { type: Number },
    PRO_name: { type: String },
    PRO_description: { type: String },
    PRO_price: { type: Number },
    PRO_discount_price: { type: Number, default: null },
    PRO_stock: { type: Number },
    PRO_brand: { type: String },
    PRO_rating_avg: { type: Number, default: 0 },
    PRO_total_reviews: { type: Number, default: 0 },
    PRO_trending_score: { type: Number, default: 0 },
    PRO_last_trending_update: { type: Date },
    PRO_created_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("products", productSchema);