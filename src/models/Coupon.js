const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    COU_id:             { type: Number, unique: true },
    COU_code:           { type: String },
    COU_discount_type:  { type: String, enum: ["percentage", "fixed"] },
    COU_discount_value: { type: Number },
    COU_min_purchase:   { type: Number },
    COU_expires_at:     { type: Date }
}, { versionKey: false });

module.exports = mongoose.model("coupons", couponSchema);