const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
    SHI_id:              { type: Number, unique: true },
    ORD_id:              { type: Number },
    ADD_id:              { type: Number },
    SHI_carrier:         { type: String },
    SHI_tracking_number: { type: String },
    SHI_status:          { type: String, enum: ["shipped", "in_transit", "delivered", "returned"] },
    SHI_estimated_at:    { type: Date, default: null }
}, { versionKey: false });


module.exports = mongoose.model("shipments", shipmentSchema);