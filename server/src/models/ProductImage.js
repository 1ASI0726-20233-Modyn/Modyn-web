const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema({
    IMG_id:    { type: Number, unique: true },
    PRO_id:    { type: Number },
    IMG_url:   { type: String },
    IMG_order: { type: Number }
}, { versionKey: false });


module.exports = mongoose.model("product_images", productImageSchema);