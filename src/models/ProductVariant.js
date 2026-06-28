const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema({
    VAR_id:    { type: Number },
    PRO_id:    { type: Number },
    VAR_size:  { type: String },
    VAR_color: { type: String },
    VAR_stock: { type: Number },
    VAR_price: { type: Number }
}, { versionKey: false });

module.exports = mongoose.model("product_variants", productVariantSchema);