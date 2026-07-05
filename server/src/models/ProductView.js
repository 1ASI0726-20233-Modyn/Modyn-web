const mongoose = require("mongoose");

const productViewSchema = new mongoose.Schema({
    VIEW_id:         { type: Number, unique: true },
    PRO_id:          { type: Number },
    USU_id:          { type: Number },
    VIEW_created_at: { type: Date, default: Date.now }
}, { versionKey: false });


module.exports = mongoose.model("product_views", productViewSchema, "product_views");