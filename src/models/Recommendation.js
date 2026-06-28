const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
    REC_id:           { type: Number },
    USU_id:           { type: Number },
    REC_generated_at: { type: Date, default: Date.now },
    REC_expires_at:   { type: Date }
}, { versionKey: false });

module.exports = mongoose.model("recommendations", recommendationSchema);