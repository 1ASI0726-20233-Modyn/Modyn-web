const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    SUP_id:            { type: Number },
    SUP_name:          { type: String },
    SUP_contact_email: { type: String },
    SUP_phone:         { type: String }
}, { versionKey: false });

module.exports = mongoose.model("suppliers", supplierSchema);