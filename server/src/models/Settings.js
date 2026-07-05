const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    SET_id:    { type: Number, unique: true },
    SET_key:   { type: String },
    SET_value: { type: String },
    SET_group: { type: String, enum: ["tienda", "email", "general"] }
}, { versionKey: false });

module.exports = mongoose.model("settings", settingsSchema);