const mongoose = require("mongoose");

const notificationEventSchema = new mongoose.Schema({
    NEV_id: { type: Number },
    NOT_id: { type: Number },
    ORD_id: { type: Number, default: null },
    SHI_id: { type: Number, default: null },
    COU_id: { type: Number, default: null }
}, { versionKey: false });

module.exports = mongoose.model("notification_events", notificationEventSchema);