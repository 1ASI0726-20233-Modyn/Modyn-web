const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    SES_id:         { type: Number, unique: true },
    USU_id:         { type: Number },
    SES_ip_address: { type: String },
    SES_device:     { type: String },
    SES_expires_at: { type: Date }
}, { versionKey: false });


module.exports = mongoose.model("sessions", sessionSchema);