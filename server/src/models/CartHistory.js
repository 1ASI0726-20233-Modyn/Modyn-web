const mongoose = require("mongoose");

const cartHistorySchema = new mongoose.Schema({
    CHS_id:         { type: Number, unique: true },
    CAR_id:         { type: Number },
    PRO_id:         { type: Number },
    CHS_action:     { type: String, enum: ["added", "removed"] },
    CHS_created_at: { type: Date, default: Date.now }
}, { versionKey: false });


module.exports = mongoose.model("cart_history", cartHistorySchema, "cart_history");