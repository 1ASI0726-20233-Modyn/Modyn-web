const mongoose = require("mongoose");

const productLikeSchema = new mongoose.Schema({
    PLK_id:         { type: Number, unique: true },
    PRO_id:         { type: Number },
    USU_id:         { type: Number },
    PLK_created_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("product_likes", productLikeSchema, "product_likes");