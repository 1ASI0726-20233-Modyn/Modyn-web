const mongoose = require("mongoose");

const reviewImageSchema = new mongoose.Schema({
    REVIMG_id:  { type: Number },
    REV_id:     { type: Number },
    REVIMG_url: { type: String }
}, { versionKey: false });

module.exports = mongoose.model("product_review_images", reviewImageSchema);