const mongoose = require("mongoose");

const newsletterSubscriberSchema = new mongoose.Schema({
    NSB_id:         { type: Number, unique: true },
    NSB_email:      { type: String },
    NSB_status:     { type: String, enum: ["activo", "inactivo"], default: "activo" },
    NSB_created_at: { type: Date, default: Date.now }
}, { versionKey: false });


module.exports = mongoose.model("newsletter_subscribers", newsletterSubscriberSchema, "newsletter_subscribers");