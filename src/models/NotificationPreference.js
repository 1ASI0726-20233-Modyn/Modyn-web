const mongoose = require("mongoose");

const notificationPreferenceSchema = new mongoose.Schema({
    NPR_id:      { type: Number, unique: true },
    USU_id:      { type: Number },
    NPR_type:    { type: String, enum: ["order", "shipment", "promo", "review", "system"] },
    NPR_enabled: { type: Boolean, default: true }
}, { versionKey: false });

module.exports = mongoose.model("notification_preferences", notificationPreferenceSchema, "notification_preferences");