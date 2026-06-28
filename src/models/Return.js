const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
    RET_id:            { type: Number },
    ORD_id:            { type: Number },
    RET_reason:        { type: String },
    RET_status:        { type: String, enum: ["pending", "approved", "rejected"] },
    RET_refund_amount: { type: Number },
    RET_created_at:    { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("returns", returnSchema);