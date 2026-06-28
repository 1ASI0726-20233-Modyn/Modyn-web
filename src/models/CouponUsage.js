const mongoose = require("mongoose");

const couponUsageSchema = new mongoose.Schema({
    CPU_id:      { type: Number, unique: true },
    COU_id:      { type: Number },
    USU_id:      { type: Number },
    ORD_id:      { type: Number },
    CPU_used_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("coupon_usage", couponUsageSchema, "coupon_usage")