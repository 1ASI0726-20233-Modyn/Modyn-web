const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    USU_id:            { type: Number },
    USU_name:          { type: String },
    USU_email:         { type: String },
    USU_password:      { type: String },
    USU_role:          { type: String, enum: ["cliente", "admin"], default: "cliente" },
    USU_profile_image: { type: String, default: null },
    USU_phone:         { type: String },
    USU_status:        { type: String, enum: ["activo", "inactivo"], default: "activo" },
    USU_created_at:    { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("users", userSchema);