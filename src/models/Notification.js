const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    NOT_id:         { type: Number },
    USU_id:         { type: Number },
    NOT_type:       { type: String, enum: ["order", "promo", "shipment", "return", "review", "wishlist", "system"] },
    NOT_message:    { type: String },
    NOT_read_at:    { type: Date, default: null },
    NOT_created_at: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("notifications", notificationSchema);