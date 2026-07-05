const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    PAY_id:      { type: Number, unique: true },
    ORD_id:      { type: Number },
    PAY_method:  { type: String, enum: ["Tarjeta", "Yape", "Plin", "Paypal"] },
    PAY_amount:  { type: Number },
    PAY_status:  { type: String, enum: ["pending", "completed", "refunded"] },
    PAY_paid_at: { type: Date, default: null }
}, { versionKey: false });


module.exports = mongoose.model("payments", paymentSchema);