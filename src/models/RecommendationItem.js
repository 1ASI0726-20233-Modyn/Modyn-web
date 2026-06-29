const mongoose = require("mongoose");

const recommendationItemSchema = new mongoose.Schema({
    RIT_id:     { type: Number, unique: true },
    REC_id:     { type: Number },
    PRO_id:     { type: Number },
    RIT_score:  { type: Number },
    RIT_reason: { type: String }
}, { versionKey: false });

module.exports = mongoose.model("recommendation_items", recommendationItemSchema);