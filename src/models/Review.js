const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    REV_id:         { type: Number },
    PRO_id:         { type: Number },
    USU_id:         { type: Number },
    ORD_id:         { type: Number },
    REV_rating:     { type: Number, min: 1, max: 5 },
    REV_title:      { type: String },
    REV_comment:    { type: String },
    REV_created_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("reviews", reviewSchema);