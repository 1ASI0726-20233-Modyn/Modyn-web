const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    ORD_id:         { type: Number, unique: true },
    USU_id:         { type: Number },
    COU_id:         { type: Number, default: null },
    ORD_total:      { type: Number },
    ORD_status:     { type: String, enum: ["pending", "shipped", "completed", "cancelled"] },
    ORD_created_at: { type: Date, default: Date.now }
}, { versionKey: false });


module.exports = mongoose.model("orders", orderSchema);